/**
 * Standalone educational demonstrations. Every record below is invented.
 * These calculations are adaptations; they do not execute the native workbooks.
 */
export const DEMO_DATE = '2026-09-18';
const finite = value => typeof value === 'number' && Number.isFinite(value);
const sum = values => values.filter(finite).reduce((total, value) => total + value, 0);
const sumAvailable = values => values.some(finite) ? sum(values) : null;
const clone = value => JSON.parse(JSON.stringify(value));
const roundMoney = value => Math.round((value + Number.EPSILON) * 100) / 100;
const month = row => row.period || row.date?.slice(0, 7) || '';
const entity = row => row.entity;
const escape = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function parseNumericInput(value) {
  if (value == null || String(value).trim() === '') return null;
  const parsed = Number(String(value).replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

export function calculateFacilities(row) {
  const allocated = [row.base, row.amendments].every(finite) ? roundMoney(row.base + row.amendments) : null;
  const balance = [allocated, row.posted].every(finite) ? roundMoney(allocated - row.posted) : null;
  const forecast = [row.average, row.missingMonths].every(finite) ? roundMoney(row.average * row.missingMonths) : null;
  const projected = [balance, forecast].every(finite) ? roundMoney(balance - forecast) : null;
  return { allocated, balance, forecast, projected, status: projected === null ? 'pending' : projected < 0 ? 'risk' : 'covered' };
}

export function propertyStatus(row, today = DEMO_DATE) {
  if (row.protocol && !row.due) return 'missingDue';
  if (finite(row.posted) && row.posted > 0) return 'posted';
  if (!row.due || !finite(row.amount)) return 'pending';
  return row.due < today ? 'late' : 'upcoming';
}

export function fleetConsumption(row) {
  if (row.type === 'wash') return 'wash';
  if (!finite(row.importedKm)) return 'pending';
  if (row.importedKm <= 0) return 'check';
  if (!finite(row.importedKmL)) return 'pending';
  if (row.importedKmL < 5) return 'high';
  if (row.importedKmL > 20) return 'low';
  return 'ok';
}

export function fleetDuplicateInfo(rows) {
  const dayGroups = new Map();
  const financeGroups = new Map();
  for (const row of rows) {
    if (row.type !== 'fuel') continue;
    const dayKey = JSON.stringify([row.entity, row.date]);
    const financeKey = JSON.stringify([row.date, row.driver, row.entity, row.station, finite(row.amount) ? Math.round(row.amount * 100) : null, row.type]);
    const groups = [[dayGroups, dayKey], ...(finite(row.amount) ? [[financeGroups, financeKey]] : [])];
    for (const [map, key] of groups) {
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(row);
    }
  }
  const days = [...dayGroups.values()].filter(group => group.length > 1);
  const finances = [...financeGroups.values()].filter(group => group.length > 1);
  return {
    dayIds: new Set(days.flat().map(row => row.id)),
    financeIds: new Set(finances.flat().map(row => row.id)),
    groups: finances,
    reviewAmount: roundMoney(sum(finances.flat().map(row => row.amount))),
    reviewCount: finances.reduce((total, group) => total + group.length, 0),
  };
}

/** Simplified teaching aid: it is deliberately not the native median/reconnection engine. */
export function deriveMileage(rows) {
  const result = new Map();
  const previous = new Map();
  const ordered = [...rows].sort((a, b) => `${a.date}T${a.time || '00:00'}-${a.id}`.localeCompare(`${b.date}T${b.time || '00:00'}-${b.id}`));
  for (const row of ordered) {
    if (row.type === 'wash') { result.set(row.id, { km: null, status: 'wash' }); continue; }
    if (!finite(row.odometer)) { result.set(row.id, { km: null, status: 'pending' }); continue; }
    const timestamp = Date.parse(`${row.date}T${row.time || '00:00'}:00Z`);
    if (!finite(timestamp)) { result.set(row.id, { km: null, status: 'pending' }); continue; }
    const anchor = previous.get(row.entity);
    if (!anchor) {
      previous.set(row.entity, {odometer: row.odometer, timestamp});
      result.set(row.id, { km: null, status: 'first' });
      continue;
    }
    const delta = roundMoney(row.odometer - anchor.odometer);
    const elapsedDays = (timestamp - anchor.timestamp) / 86_400_000;
    if (delta <= 0 || elapsedDays <= 0 || delta / elapsedDays > 600) { result.set(row.id, { km: null, status: 'check' }); continue; }
    previous.set(row.entity, {odometer: row.odometer, timestamp});
    result.set(row.id, { km: delta, status: 'ok' });
  }
  return result;
}

export function priceStats(values) {
  const valid = values.filter(finite).sort((a, b) => a - b);
  if (!valid.length) return { count: 0, mean: null, median: null };
  const middle = Math.floor(valid.length / 2);
  return {
    count: valid.length,
    mean: roundMoney(sum(valid) / valid.length),
    median: valid.length % 2 ? valid[middle] : roundMoney((valid[middle - 1] + valid[middle]) / 2),
  };
}

export function summarizeQuotes(rows) {
  return Array.from({ length: 3 }, (_, index) => {
    const values = rows.map(row => row.suppliers[index]);
    const filled = values.filter(finite).length;
    const complete = rows.length > 0 && filled === rows.length;
    return { index, filled, needed: rows.length, complete, total: complete ? roundMoney(sum(values)) : null, partial: roundMoney(sum(values)) };
  });
}

export function parkingTotals(rows) {
  const linked = rows.filter(row => row.linked !== false);
  const amountFor = type => {
    const relevant = linked.filter(row => row.type === type);
    const total = relevant.length ? sumAvailable(relevant.map(row => row.amount)) : 0;
    return total === null ? null : roundMoney(total);
  };
  return {
    monthly: amountFor('monthly'),
    global: amountFor('global'),
    knownSlots: linked.length ? sumAvailable(linked.map(row => row.slots)) : 0,
    missingSlots: linked.filter(row => !finite(row.slots)).length,
  };
}

export function filterRows(rows, filters) {
  return rows.filter(row => (!filters.period || month(row) === filters.period) && (!filters.entity || entity(row) === filters.entity) && (!filters.type || row.type === filters.type));
}

export const EXAMPLE_DATA = {
  facilities: [
    {id:'DEMO-F01-S',period:'2026-09',entity:'DEMO-F01',name:{pt:'Manutenção predial Alfa',en:'Alpha building maintenance'},type:'service',base:48000,amendments:2000,posted:32100,average:4400,missingMonths:4,expires:'2027-01-31'},
    {id:'DEMO-F01-M',period:'2026-09',entity:'DEMO-F01',name:{pt:'Manutenção predial Alfa',en:'Alpha building maintenance'},type:'material',base:8000,amendments:0,posted:5599.97,average:600,missingMonths:4,expires:'2027-01-31'},
    {id:'DEMO-F02-S',period:'2026-09',entity:'DEMO-F02',name:{pt:'Conservação Beta',en:'Beta conservation'},type:'service',base:24000,amendments:0,posted:17500,average:2500,missingMonths:3,expires:'2026-12-31'},
    {id:'DEMO-F03-M',period:'2026-08',entity:'DEMO-F03',name:{pt:'Materiais Gama',en:'Gamma materials'},type:'material',base:6000,amendments:1200,posted:3800,average:700,missingMonths:4,expires:'2027-02-28'},
    {id:'DEMO-F04-S',period:'2026-08',entity:'DEMO-F04',name:{pt:'Climatização Delta',en:'Delta climate control'},type:'service',base:16000,amendments:0,posted:9800,average:null,missingMonths:4,expires:'2026-12-31'},
    {id:'DEMO-F05-S',period:'2026-07',entity:'DEMO-F05',name:{pt:'Inspeções Épsilon',en:'Epsilon inspections'},type:'service',base:9000,amendments:0,posted:6000,average:1000,missingMonths:3,expires:'2026-10-31'},
  ],
  imoveis: [
    {id:'DEMO-I01-09A',period:'2026-09',entity:'DEMO-I01',name:{pt:'Unidade Alfa',en:'Alpha unit'},type:'rent',tenure:'rented',amount:4200,posted:4200,due:'2026-09-10',expires:'2027-06-30',protocol:'DEMO-P01'},
    {id:'DEMO-I01-09C',period:'2026-09',entity:'DEMO-I01',name:{pt:'Unidade Alfa',en:'Alpha unit'},type:'condo',tenure:'rented',amount:680,posted:null,due:'2026-09-12',expires:'2027-06-30',protocol:'DEMO-P02'},
    {id:'DEMO-I01-09T',period:'2026-09',entity:'DEMO-I01',name:{pt:'Unidade Alfa',en:'Alpha unit'},type:'tax',tenure:'rented',amount:210,posted:0,due:'2026-09-25',expires:'2027-06-30',protocol:'DEMO-P03'},
    {id:'DEMO-I02-09C',period:'2026-09',entity:'DEMO-I02',name:{pt:'Unidade Beta',en:'Beta unit'},type:'condo',tenure:'owned',amount:940,posted:940,due:'2026-09-08',expires:null,protocol:'DEMO-P04'},
    {id:'DEMO-I02-09F',period:'2026-09',entity:'DEMO-I02',name:{pt:'Unidade Beta',en:'Beta unit'},type:'fees',tenure:'owned',amount:120,posted:null,due:null,expires:null,protocol:'DEMO-P05'},
    {id:'DEMO-I03-08A',period:'2026-08',entity:'DEMO-I03',name:{pt:'Unidade Gama',en:'Gamma unit'},type:'rent',tenure:'rented',amount:3500,posted:3500,due:'2026-08-15',expires:'2026-12-31',protocol:'DEMO-P06'},
    {id:'DEMO-I03-07T',period:'2026-07',entity:'DEMO-I03',name:{pt:'Unidade Gama',en:'Gamma unit'},type:'tax',tenure:'rented',amount:null,posted:null,due:'2026-07-15',expires:'2026-12-31',protocol:'DEMO-P07'},
  ],
  frota: [
    {id:'DEMO-T01',date:'2026-08-25',time:'09:00',entity:'DEMO-V01',name:{pt:'Veículo Alfa',en:'Alpha vehicle'},type:'fuel',ownership:'owned',driver:'DEMO-D01',station:'DEMO-PONTO-A',amount:180,liters:30,importedKm:285,importedKmL:9.5,odometer:10000},
    {id:'DEMO-T02',date:'2026-09-03',time:'10:00',entity:'DEMO-V01',name:{pt:'Veículo Alfa',en:'Alpha vehicle'},type:'fuel',ownership:'owned',driver:'DEMO-D01',station:'DEMO-PONTO-A',amount:192,liters:32,importedKm:300,importedKmL:9.375,odometer:10300},
    {id:'DEMO-T03',date:'2026-09-08',time:'11:00',entity:'DEMO-V01',name:{pt:'Veículo Alfa',en:'Alpha vehicle'},type:'wash',ownership:'owned',driver:'DEMO-D01',station:'DEMO-PONTO-B',amount:45,liters:null,importedKm:null,importedKmL:null,odometer:10400},
    {id:'DEMO-T04',date:'2026-09-12',time:'08:20',entity:'DEMO-V01',name:{pt:'Veículo Alfa',en:'Alpha vehicle'},type:'fuel',ownership:'owned',driver:'DEMO-D01',station:'DEMO-PONTO-A',amount:210,liters:35,importedKm:315,importedKmL:9,odometer:10615},
    {id:'DEMO-T05',date:'2026-09-12',time:'08:21',entity:'DEMO-V01',name:{pt:'Veículo Alfa',en:'Alpha vehicle'},type:'fuel',ownership:'owned',driver:'DEMO-D01',station:'DEMO-PONTO-A',amount:210,liters:35,importedKm:0,importedKmL:0,odometer:10615},
    {id:'DEMO-T06',date:'2026-08-28',time:'14:00',entity:'DEMO-V02',name:{pt:'Veículo Beta',en:'Beta vehicle'},type:'fuel',ownership:'rented',driver:'DEMO-D02',station:'DEMO-PONTO-C',amount:240,liters:40,importedKm:360,importedKmL:9,odometer:24000},
    {id:'DEMO-T07',date:'2026-09-10',time:'14:00',entity:'DEMO-V02',name:{pt:'Veículo Beta',en:'Beta vehicle'},type:'fuel',ownership:'rented',driver:'DEMO-D02',station:'DEMO-PONTO-C',amount:240,liters:40,importedKm:140,importedKmL:3.5,odometer:24140},
    {id:'DEMO-T08',date:'2026-09-15',time:'12:00',entity:'DEMO-V02',name:{pt:'Veículo Beta',en:'Beta vehicle'},type:'fuel',ownership:'rented',driver:'DEMO-D02',station:'DEMO-PONTO-C',amount:120,liters:20,importedKm:440,importedKmL:22,odometer:25900},
    {id:'DEMO-T09',date:'2026-07-21',time:'09:00',entity:'DEMO-V03',name:{pt:'Veículo Gama',en:'Gamma vehicle'},type:'fuel',ownership:'owned',driver:'DEMO-D03',station:'DEMO-PONTO-B',amount:0,liters:0,importedKm:null,importedKmL:null,odometer:null},
  ],
  estacionamento: [
    {id:'DEMO-E01',period:'2026-09',entity:'DEMO-E01',name:{pt:'Estacionamento Alfa',en:'Alpha parking'},provider:'DEMO-PRESTADOR-A',type:'monthly',amount:1800,slots:12,start:'2026-01-01',expires:'2026-12-31'},
    {id:'DEMO-E02',period:'2026-09',entity:'DEMO-E02',name:{pt:'Estacionamento Beta',en:'Beta parking'},provider:'DEMO-PRESTADOR-A',type:'global',amount:9600,slots:4,start:'2026-03-01',expires:'2027-02-28'},
    {id:'DEMO-E03',period:'2026-08',entity:'DEMO-E03',name:{pt:'Estacionamento Gama',en:'Gamma parking'},provider:'DEMO-PRESTADOR-B',type:'monthly',amount:750,slots:null,start:'2026-04-01',expires:'2027-03-31'},
    {id:'DEMO-E04',period:'2026-07',entity:'DEMO-E04',name:{pt:'Estacionamento Delta',en:'Delta parking'},provider:'DEMO-PRESTADOR-C',type:'global',amount:null,slots:2,start:'2026-07-01',expires:'2027-06-30'},
    {id:'DEMO-E05',period:'2026-09',entity:'DEMO-SEM-VINCULO',name:{pt:'Registro sem vínculo cadastral',en:'Record without a registry link'},provider:'DEMO-PRESTADOR-D',type:'monthly',amount:300,slots:2,start:null,expires:null,linked:false},
  ],
  precos: [
    {id:'DEMO-Q01',period:'2026-09',entity:'DEMO-PESQ-A',name:{pt:'Filtro demonstrativo',en:'Sample filter'},type:'parts',quantity:1,media:[42,45,43],suppliers:[41,44,46]},
    {id:'DEMO-Q02',period:'2026-09',entity:'DEMO-PESQ-A',name:{pt:'Correia demonstrativa',en:'Sample belt'},type:'parts',quantity:1,media:[85,90,88],suppliers:[82,86,null]},
    {id:'DEMO-Q03',period:'2026-09',entity:'DEMO-PESQ-A',name:{pt:'Serviço demonstrativo',en:'Sample service'},type:'services',quantity:1,media:[150,165,155],suppliers:[140,160,155]},
    {id:'DEMO-Q04',period:'2026-08',entity:'DEMO-PESQ-B',name:{pt:'Componente sem cotação',en:'Component without a quote'},type:'parts',quantity:1,media:[null,null,null],suppliers:[null,null,null]},
    {id:'DEMO-Q05',period:'2026-08',entity:'DEMO-PESQ-B',name:{pt:'Inspeção incluída — zero explícito',en:'Included inspection — explicit zero'},type:'services',quantity:1,media:[0,null,0],suppliers:[0,null,0]},
    {id:'DEMO-Q06',period:'2026-07',entity:'DEMO-PESQ-C',name:{pt:'Conjunto demonstrativo',en:'Sample assembly'},type:'parts',quantity:1,media:[310,330,320],suppliers:[305,315,325]},
  ],
};

const TEXT = {
  pt: {
    period:'Competência',entity:'Entidade',type:'Tipo',all:'Todas',allEntities:'Todas as entidades',allTypes:'Todos os tipos',restore:'Restaurar exemplos',clear:'Limpar filtros',details:'Detalhes',edit:'Editar exemplo selecionado',save:'Aplicar alteração',saved:'Alteração aplicada a esta sessão.',restored:'Exemplos restaurados.',empty:'Nenhum registro corresponde a estes filtros.',emptyHint:'Limpe os filtros ou escolha outra combinação.',missing:'Não informado',noQuote:'Sem cotação',records:'registros',selected:'Selecionado',choose:'Selecionar',status:'Situação',item:'Item',value:'Valor',date:'Data',identifier:'Identificador fictício',sample:'Dados inteiramente fictícios · data-base 18/09/2026',session:'As alterações ficam somente nesta sessão do navegador. Campos vazios continuam ausentes; zero é um valor válido.',incomplete:'Há valores ausentes; os totais exibidos somam somente os valores informados.',help:'Filtre os exemplos, selecione uma linha e altere uma entrada para observar o efeito nos indicadores.',readout:'Resultado do filtro',detailTitle:'Explore este registro',name:'Descrição',amount:'Valor previsto',posted:'Valor lançado',base:'Dotação inicial',amendments:'Aditivos do ciclo',average:'Média mensal demonstrativa',missingMonths:'Competências sem lançamento',due:'Vencimento da despesa',expires:'Fim da vigência contratual',notApplicable:'Não se aplica',validity:'Vigência',slots:'Vagas informadas',odometer:'Hodômetro',liters:'Litros',importedKm:'KM importado',importedKmL:'KM/L importado',media:'Mídia',supplier:'Fornecedor',mean:'Média da mídia',median:'Mediana da mídia',quotes:'Cotações',complete:'Completa',partial:'Incompleta',total:'Total',count:'Quantidade',risk:'Risco de insuficiência',covered:'Saldo não negativo',pending:'Informação pendente',missingDue:'Protocolo sem vencimento',late:'Vencimento passado sem lançamento',upcoming:'A vencer',wash:'Lavagem',check:'Conferir',high:'Consumo alto',low:'Consumo baixo',ok:'Dentro da faixa',first:'Sem intervalo anterior',service:'Serviços',material:'Materiais',rent:'Aluguel',condo:'Condomínio',tax:'IPTU',fees:'Taxas',fuel:'Combustível',monthly:'Mensal',global:'Global',parts:'Peças',services:'Serviços',owned:'Próprio',rented:'Locado',postedStatus:'Lançamento registrado',unknown:'Indefinido',projection:'Saldo projetado',allocated:'Valor do ciclo',balance:'Saldo após lançamentos',forecast:'Estimativa a lançar',duplicate:'Suspeita de duplicidade',sameDay:'Mais de um registro no dia',chart:'Visualização do recorte',noChart:'Sem valores informados para este gráfico.',currency:'Valores em reais (BRL).',changeHint:'Deixe o campo em branco para testar uma informação ausente.',readonlyQuantity:'Quantidade fixa em 1 nesta demonstração.',noTotal:'Total indisponível: proposta incompleta.',showing:'Exibindo',of:'de',projectedExplain:'Valor do ciclo − lançamentos do ciclo − média × competências sem lançamento.',
  },
  en: {
    period:'Reporting month',entity:'Entity',type:'Type',all:'All',allEntities:'All entities',allTypes:'All types',restore:'Reset examples',clear:'Clear filters',details:'Details',edit:'Edit the selected example',save:'Apply change',saved:'Change applied to this session.',restored:'Examples restored.',empty:'No records match these filters.',emptyHint:'Clear the filters or choose another combination.',missing:'Not provided',noQuote:'No quote',records:'records',selected:'Selected',choose:'Select',status:'Status',item:'Item',value:'Amount',date:'Date',identifier:'Fictional identifier',sample:'Entirely fictional data · reference date Sep 18, 2026',session:'Changes stay in this browser session. Empty fields remain missing; zero is a valid amount.',incomplete:'Some values are missing; displayed totals add only provided amounts.',help:'Filter the examples, select a row and change an input to see how the indicators respond.',readout:'Filter results',detailTitle:'Explore this record',name:'Description',amount:'Expected amount',posted:'Posted amount',base:'Initial allocation',amendments:'Cycle amendments',average:'Demonstration monthly average',missingMonths:'Months without a posting',due:'Expense due date',expires:'Contract expiry date',notApplicable:'Not applicable',validity:'Contract term',slots:'Reported spaces',odometer:'Odometer',liters:'Liters',importedKm:'Imported KM',importedKmL:'Imported KM/L',media:'Media',supplier:'Supplier',mean:'Media mean',median:'Media median',quotes:'Quotes',complete:'Complete',partial:'Incomplete',total:'Total',count:'Count',risk:'Insufficiency risk',covered:'Nonnegative balance',pending:'Missing information',missingDue:'Protocol without a due date',late:'Past due date without a posting',upcoming:'Upcoming',wash:'Car wash',check:'Check',high:'High consumption',low:'Low consumption',ok:'Within range',first:'No previous interval',service:'Services',material:'Materials',rent:'Rent',condo:'Condominium',tax:'Property tax',fees:'Fees',fuel:'Fuel',monthly:'Monthly',global:'Global',parts:'Parts',services:'Services',owned:'Owned',rented:'Rented',postedStatus:'Posting recorded',unknown:'Unknown',projection:'Projected balance',allocated:'Cycle allocation',balance:'Balance after postings',forecast:'Estimated future postings',duplicate:'Possible duplicate',sameDay:'Multiple records on the same day',chart:'Filtered view',noChart:'No provided values for this chart.',currency:'Amounts in Brazilian reais (BRL).',changeHint:'Leave an input empty to test missing information.',readonlyQuantity:'Quantity is fixed at 1 in this demonstration.',noTotal:'Total unavailable: incomplete proposal.',showing:'Showing',of:'of',projectedExplain:'Cycle allocation − cycle postings − average × months without a posting.',
  },
};

const NOTICES = {
  facilities: {
    pt:'Adaptação didática: serviços e materiais permanecem separados. Média e competências sem lançamento são entradas deste exemplo; não reproduzem o motor completo de ciclos da planilha. Risco somente quando o saldo projetado, arredondado em centavos, é negativo. Valor lançado não confirma quitação.',
    en:'Educational adaptation: services and materials remain separate. Average and months without a posting are inputs here; they do not reproduce the workbook’s complete cycle engine. Risk means a projected balance below zero after rounding to cents. A posting does not confirm payment.',
  },
  imoveis: {
    pt:'Aluguel, condomínio, IPTU e taxas se vinculam ao ID do imóvel. Vencimento da despesa e fim da vigência são datas distintas. Vencimento passado sem lançamento é uma pendência para conferir; não comprova inadimplência. Valor lançado não significa quitação bancária.',
    en:'Rent, condominium, property tax and fees link to the property ID. Expense due dates and contract expiry are separate dates. A past due date without a posting is a review item; it does not prove default. A posting is not bank payment confirmation.',
  },
  frota: {
    pt:'KM/L importado, hodômetro e consumo são campos distintos. Lavagens não compõem litros, consumo ou análise de duplicidade. O delta de hodômetro é didático: usa abastecimentos, rejeita regressão, zero e taxa superior a 600 km/dia pelo intervalo real de data e hora; não replica mediana, reconexão ou rateio mensal da origem. Duplicidades são suspeitas, sem exclusão automática.',
    en:'Imported KM/L, odometer and consumption are separate fields. Car washes do not contribute liters, consumption or duplicate analysis. The educational odometer delta uses fuel entries and rejects regression, zero and a rate above 600 km/day based on actual elapsed date and time; it does not reproduce the source’s median, reconnection or monthly allocation. Duplicate flags are suspicions, with no automatic removal.',
  },
  estacionamento: {
    pt:'Painel web adaptado, sem painel equivalente confirmado na origem. Cada contrato é uma unidade, mesmo quando compartilha prestador. Vagas são opcionais. Valores mensais e globais permanecem separados, sem conversão. Registros sem vínculo cadastral ficam visíveis para conferência e fora dos totais contratuais.',
    en:'Adapted web panel; no equivalent source dashboard was confirmed. Each contract is a separate unit even when providers are shared. Spaces are optional. Monthly and global amounts remain separate, with no conversion. Records without a registry link remain visible for review and outside contract totals.',
  },
  precos: {
    pt:'Três referências de mídia e três fornecedores. Quantidade fixa em 1 para manter bases comparáveis nesta demonstração. A planilha original alterna referências unitárias e totais nas médias e medianas. Vazio não é zero. Proposta incompleta não recebe total comparável; não há ranking, menor preço ou economia automática.',
    en:'Three media references and three suppliers. Quantity is fixed at 1 to keep this demonstration comparable. The source workbook alternates unit and total references in its means and medians. Blank is not zero. Incomplete proposals have no comparable total; there is no ranking, lowest-price or automatic savings claim.',
  },
};

const ENTITY_LABEL = {
  facilities:{pt:'Contrato',en:'Contract'},imoveis:{pt:'Imóvel',en:'Property'},frota:{pt:'Veículo',en:'Vehicle'},estacionamento:{pt:'Contrato de estacionamento',en:'Parking contract'},precos:{pt:'Pesquisa',en:'Research set'},
};
const LABELS = {
  pt:{allocation:'Dotação informada',projection:'Projeção calculável',risks:'Linhas com risco',needs:'Informação pendente',expected:'Despesas informadas',posted:'Lançamentos registrados',late:'Atrasos a conferir',anomalies:'Protocolos sem vencimento',fuelSpend:'Combustível lançado',fuelVolume:'Litros de combustível',washSpend:'Lavagens lançadas',review:'Valor em análise',monthly:'Valores mensais',global:'Valores globais',spaces:'Vagas cadastradas',contracts:'Contratos no recorte',items:'Itens no recorte',withMedia:'Itens com mídia',completeQuotes:'Propostas completas',mediaCount:'Cotações de mídia',spendByType:'Composição das despesas',fuelByVehicle:'Combustível por veículo',coveredByLine:'Saldo projetado por linha',parkingChart:'Valores por contrato e natureza',quoteChart:'Preenchimento das propostas',calculated:'linhas calculáveis',missingSlots:'contratos sem informação de vagas',reviewHint:'Todos os registros dos grupos financeiros suspeitos',subset:'Completude e totais calculados somente para os itens do recorte.',mediaUnit:'Mídia — unitário',supplierTotal:'Fornecedor — total do item',composition:'Composição da proposta',partialSubtotal:'Subtotal informado',mileage:'Δ hodômetro didático',flags:'Conferência',native:'A interpretação da planilha original está documentada no guia do projeto.',budgetLines:'Serviço e material são linhas separadas do contrato.'},
  en:{allocation:'Provided allocation',projection:'Calculable projection',risks:'Lines at risk',needs:'Missing information',expected:'Provided expenses',posted:'Recorded postings',late:'Overdue items to review',anomalies:'Protocols without due dates',fuelSpend:'Posted fuel amount',fuelVolume:'Fuel liters',washSpend:'Posted car washes',review:'Amount under review',monthly:'Monthly amounts',global:'Global amounts',spaces:'Reported spaces',contracts:'Contracts in scope',items:'Items in scope',withMedia:'Items with media',completeQuotes:'Complete proposals',mediaCount:'Media quotes',spendByType:'Expense composition',fuelByVehicle:'Fuel by vehicle',coveredByLine:'Projected balance per line',parkingChart:'Amounts by contract and type',quoteChart:'Proposal completion',calculated:'calculable lines',missingSlots:'contracts without a spaces count',reviewHint:'All records in suspected financial duplicate groups',subset:'Completeness and totals refer only to items in the filtered scope.',mediaUnit:'Media — unit price',supplierTotal:'Supplier — item total',composition:'Proposal composition',partialSubtotal:'Provided subtotal',mileage:'Educational odometer Δ',flags:'Review',native:'Source workbook interpretation is documented in the project guide.',budgetLines:'Service and material are separate contract lines.'},
};

const mounted = new WeakMap();
const memory = new Map();
let mountNumber = 0;

function loadRows(moduleId) {
  if (memory.has(moduleId)) return clone(memory.get(moduleId));
  try {
    const saved = JSON.parse(globalThis.sessionStorage?.getItem(`portfolio-demo-v2-${moduleId}`) || 'null');
    const source = EXAMPLE_DATA[moduleId];
    if (Array.isArray(saved) && saved.length === source.length && saved.every((row, index) => row.id === source[index].id)) return saved;
  } catch { /* Storage can be disabled; in-memory editing still works. */ }
  return clone(EXAMPLE_DATA[moduleId]);
}

function storeRows(moduleId, rows) {
  memory.set(moduleId, clone(rows));
  try { globalThis.sessionStorage?.setItem(`portfolio-demo-v2-${moduleId}`, JSON.stringify(rows)); } catch { /* Session-only memory fallback. */ }
}

/** Mount a framework-free demo. Returns a cleanup function. */
export function mountDemo(container, moduleId, lang = 'pt') {
  if (!container || !EXAMPLE_DATA[moduleId]) throw new Error('Unknown demonstration or missing container');
  mounted.get(container)?.();
  lang = lang === 'en' ? 'en' : 'pt';
  const t = TEXT[lang];
  const label = LABELS[lang];
  const prefix = `demo-${moduleId}-${++mountNumber}`;
  const locale = lang === 'en' ? 'en-US' : 'pt-BR';
  const money = value => finite(value) ? new Intl.NumberFormat(locale, {style:'currency',currency:'BRL'}).format(value) : t.missing;
  const number = (value, digits = 2) => finite(value) ? new Intl.NumberFormat(locale, {maximumFractionDigits:digits}).format(value) : t.missing;
  const date = value => value ? new Date(`${value}T12:00:00Z`).toLocaleDateString(locale, {timeZone:'UTC'}) : t.missing;
  const title = row => row.name?.[lang] || row.name?.pt || row.entity;
  const typeName = type => t[type] || type;
  const statusName = status => status === 'posted' ? t.postedStatus : (t[status] || status);
  let rows = loadRows(moduleId);
  let filters = {period:'',entity:'',type:''};
  let selectedId = null;
  let announcement = '';

  const tag = (key, text = statusName(key)) => `<span class="tag ${['risk','late','high','missingDue','check'].includes(key) ? 'tag-alert' : ''}">${escape(text)}</span>`;
  const metric = (name, value, hint = '') => `<div class="metric"><span class="metric-label">${escape(name)}</span><strong>${escape(value)}</strong>${hint ? `<small>${escape(hint)}</small>` : ''}</div>`;
  const rowSelect = row => `<button type="button" class="button secondary" data-select="${escape(row.id)}" aria-pressed="${row.id === selectedId}" aria-label="${escape(`${t.choose}: ${title(row)}`)}">${row.id === selectedId ? t.selected : t.details}</button>`;
  const table = (headers, body) => `<div class="table-scroll" role="region" aria-label="${escape(t.readout)}" tabindex="0"><table class="data-table"><caption class="sr-only">${escape(t.sample)}</caption><thead><tr>${headers.map(header => `<th scope="col">${escape(header)}</th>`).join('')}</tr></thead><tbody>${body.join('')}</tbody></table></div>`;
  const rowHtml = cells => `<tr>${cells.map((cell, index) => index === 0 ? `<th scope="row">${cell}</th>` : `<td>${cell}</td>`).join('')}</tr>`;
  const bars = (heading, entries, format = money) => {
    const valid = entries.filter(entry => finite(entry.value));
    const max = Math.max(1, ...valid.map(entry => Math.abs(entry.value)));
    return `<section class="panel demo-chart" aria-label="${escape(heading)}"><h3>${escape(heading)}</h3>${valid.length ? `<div class="chart-bars">${valid.map(entry => `<div class="bar-row"><div class="bar-label"><span>${escape(entry.label)}</span><strong>${escape(format(entry.value))}</strong></div><div class="bar-track" aria-hidden="true"><span class="bar-fill ${entry.value < 0 ? 'negative' : ''}" style="display:block;width:${Math.max(entry.value === 0 ? 0 : 1, Math.abs(entry.value) / max * 100)}%;height:100%;background:${entry.value < 0 ? 'var(--danger, #a64235)' : 'var(--accent, #176b58)'}"></span></div></div>`).join('')}</div>` : `<p class="empty">${t.noChart}</p>`}</section>`;
  };

  function viewFacilities(visible) {
    const calculations = visible.map(row => ({row,...calculateFacilities(row)}));
    const known = calculations.filter(item => item.projected !== null);
    const needs = calculations.filter(item => item.status === 'pending').length;
    const metrics = metric(label.allocation,money(sumAvailable(calculations.map(item=>item.allocated)))) + metric(label.projection,money(sumAvailable(known.map(item=>item.projected))),`${known.length}/${visible.length} ${label.calculated}`) + metric(label.risks,calculations.filter(item=>item.status==='risk').length) + metric(label.needs,needs);
    const body = calculations.map(item=>rowHtml([`${escape(title(item.row))}<small>${escape(item.row.entity)}</small>`,escape(typeName(item.row.type)),escape(money(item.allocated)),escape(money(item.row.posted)),escape(money(item.forecast)),escape(money(item.projected)),tag(item.status),rowSelect(item.row)]));
    return {metrics,table:table([ENTITY_LABEL[moduleId][lang],t.type,t.allocated,t.posted,t.forecast,t.projection,t.status,t.details],body),chart:bars(label.coveredByLine,calculations.map(item=>({label:`${item.row.entity} · ${typeName(item.row.type)}`,value:item.projected}))),note:needs ? t.incomplete : label.budgetLines};
  }

  function viewProperties(visible) {
    const metrics = metric(label.expected,money(sumAvailable(visible.map(row=>row.amount)))) + metric(label.posted,money(sumAvailable(visible.map(row=>row.posted)))) + metric(label.late,visible.filter(row=>propertyStatus(row)==='late').length) + metric(label.anomalies,visible.filter(row=>propertyStatus(row)==='missingDue').length);
    const body = visible.map(row=>rowHtml([`${escape(title(row))}<small>${escape(row.entity)} · ${escape(typeName(row.tenure))}</small>`,escape(typeName(row.type)),escape(date(row.due)),escape(money(row.amount)),escape(money(row.posted)),tag(propertyStatus(row)),rowSelect(row)]));
    return {metrics,table:table([ENTITY_LABEL[moduleId][lang],t.type,t.due,t.amount,t.posted,t.status,t.details],body),chart:bars(label.spendByType,['rent','condo','tax','fees'].map(type=>({label:typeName(type),value:visible.some(row=>row.type===type && finite(row.amount)) ? sum(visible.filter(row=>row.type===type).map(row=>row.amount)) : null}))),note:visible.some(row=>!finite(row.amount)) ? t.incomplete : t.currency};
  }

  function viewFleet(visible) {
    const duplicates = fleetDuplicateInfo(visible);
    const mileage = deriveMileage(rows);
    const fuelRows = visible.filter(row=>row.type==='fuel');
    const washRows = visible.filter(row=>row.type==='wash');
    const fuelSpend = fuelRows.length ? sumAvailable(fuelRows.map(row=>row.amount)) : 0;
    const fuelVolume = fuelRows.length ? sumAvailable(fuelRows.map(row=>row.liters)) : 0;
    const washSpend = washRows.length ? sumAvailable(washRows.map(row=>row.amount)) : 0;
    const metrics = metric(label.fuelSpend,money(fuelSpend)) + metric(label.fuelVolume,finite(fuelVolume)?`${number(fuelVolume)} L`:t.missing) + metric(label.washSpend,money(washSpend)) + metric(label.review,money(duplicates.reviewAmount),label.reviewHint);
    const body = visible.map(row=>{
      const interval = mileage.get(row.id);
      const flags = duplicates.financeIds.has(row.id) ? tag('check',t.duplicate) : duplicates.dayIds.has(row.id) ? tag('check',t.sameDay) : '—';
      return rowHtml([`${escape(title(row))}<small>${escape(row.entity)} · ${escape(typeName(row.ownership))}</small>`,escape(date(row.date)),escape(typeName(row.type)),escape(money(row.amount)),row.type==='wash' ? '—' : escape(number(row.liters)),row.type==='wash' ? '—' : escape(number(row.importedKmL)),tag(fleetConsumption(row)),interval?.km === null ? tag(interval.status) : `${escape(number(interval?.km))} km`,flags,rowSelect(row)]);
    });
    const vehicles = [...new Set(fuelRows.map(row=>row.entity))];
    return {metrics,table:table([ENTITY_LABEL[moduleId][lang],t.date,t.type,t.value,t.liters,t.importedKmL,t.status,label.mileage,label.flags,t.details],body),chart:bars(label.fuelByVehicle,vehicles.map(vehicle=>({label:vehicle,value:sumAvailable(fuelRows.filter(row=>row.entity===vehicle).map(row=>row.amount))}))),note:lang==='pt'?'Os alertas de consumo usam o KM e o KM/L importados. Intervalos de hodômetro preservam os registros anteriores ao filtro de competência.':'Consumption alerts use imported KM and KM/L. Odometer intervals retain records preceding the reporting-month filter.'};
  }

  function viewParking(visible) {
    const totals = parkingTotals(visible);
    const linked = visible.filter(row=>row.linked!==false);
    const unlinked = visible.length-linked.length;
    const linkLabel = lang==='pt'?'Vínculo cadastral':'Registry link';
    const unlinkedLabel = lang==='pt'?'Sem vínculo confirmado':'No confirmed link';
    const metrics = metric(label.monthly,money(totals.monthly)) + metric(label.global,money(totals.global)) + metric(label.spaces,number(totals.knownSlots),`${totals.missingSlots} ${label.missingSlots}`) + metric(label.contracts,linked.length,`${unlinked} ${unlinkedLabel.toLowerCase()}`);
    const body = visible.map(row=>rowHtml([`${escape(title(row))}<small>${escape(row.id)} · ${escape(row.provider)}</small>`,tag(row.type,typeName(row.type)),escape(money(row.amount)),escape(number(row.slots,0)),row.linked===false?tag('check',unlinkedLabel):escape(lang==='pt'?'Vinculado':'Linked'),escape(date(row.expires)),rowSelect(row)]));
    return {metrics,table:table([ENTITY_LABEL[moduleId][lang],t.type,t.value,t.slots,linkLabel,t.expires,t.details],body),chart:bars(label.parkingChart,linked.map(row=>({label:`${row.id} · ${typeName(row.type)}`,value:row.amount}))),note:visible.some(row=>!finite(row.amount)) ? t.incomplete : t.currency};
  }

  function viewPrices(visible) {
    const quotes = summarizeQuotes(visible);
    const stats = visible.map(row=>priceStats(row.media));
    const metrics = metric(label.items,visible.length) + metric(label.withMedia,stats.filter(item=>item.count>0).length) + metric(label.completeQuotes,`${quotes.filter(item=>item.complete).length}/3`) + metric(label.mediaCount,`${sum(stats.map(item=>item.count))}/${visible.length*3}`);
    const price = value=>finite(value) ? money(value) : t.noQuote;
    const body = visible.map(row=>{
      const stats = priceStats(row.media);
      return rowHtml([`${escape(title(row))}<small>${escape(typeName(row.type))} · ${t.count}: 1</small>`,...row.media.map(value=>escape(price(value))),escape(price(stats.mean)),escape(price(stats.median)),...row.suppliers.map(value=>escape(price(value))),rowSelect(row)]);
    });
    const quoteCards = `<div class="metric-grid quote-summary">${quotes.map(quote=>`<div class="metric"><span class="metric-label">${t.supplier} ${quote.index+1}</span><strong>${quote.complete?escape(money(quote.total)):t.partial}</strong><small>${quote.filled}/${quote.needed} ${lang==='pt'?'itens preenchidos':'items provided'}</small>${quote.complete?`<small>${t.parts}: ${escape(money(sum(visible.filter(row=>row.type==='parts').map(row=>row.suppliers[quote.index]))))} · ${t.services}: ${escape(money(sum(visible.filter(row=>row.type==='services').map(row=>row.suppliers[quote.index]))))}</small>`:`<small>${t.noTotal}</small>`}</div>`).join('')}</div>`;
    return {metrics,table:table([t.item,`${t.media} 1`,`${t.media} 2`,`${t.media} 3`,t.mean,t.median,`${t.supplier} 1`,`${t.supplier} 2`,`${t.supplier} 3`,t.details],body),chart:bars(label.quoteChart,quotes.map(quote=>({label:`${t.supplier} ${quote.index+1} · ${quote.complete?t.complete:t.partial}`,value:quote.filled})),value=>`${value}/${visible.length}`)+quoteCards,note:label.subset};
  }

  function field(key, name, value, kind = 'number', min = '0') {
    const step = ['slots','missingMonths'].includes(key) ? '1' : '0.01';
    return `<label class="field" for="${prefix}-edit-${key}"><span>${escape(name)}</span><input id="${prefix}-edit-${key}" name="${escape(key)}" type="${kind}" ${kind==='number'?`step="${step}" ${min!==null?`min="${min}"`:''}`:''} value="${escape(value??'')}" autocomplete="off"></label>`;
  }

  function details(row) {
    let info = '';
    let fields = '';
    if (moduleId === 'facilities') {
      const calc = calculateFacilities(row);
      info = `<p>${tag(calc.status)} ${escape(t.projectedExplain)}</p><dl><dt>${t.expires}</dt><dd>${escape(date(row.expires))}</dd><dt>${t.projection}</dt><dd>${escape(money(calc.projected))}</dd></dl>`;
      fields = field('base',t.base,row.base)+field('amendments',t.amendments,row.amendments,'number',null)+field('posted',t.posted,row.posted)+field('average',t.average,row.average)+field('missingMonths',t.missingMonths,row.missingMonths);
    } else if (moduleId === 'imoveis') {
      info = `<p>${tag(propertyStatus(row))}</p><dl><dt>${t.expires}</dt><dd>${row.expires?escape(date(row.expires)):t.notApplicable}</dd><dt>${lang==='pt'?'Protocolo fictício':'Fictional protocol'}</dt><dd>${escape(row.protocol)}</dd></dl>`;
      fields = field('amount',t.amount,row.amount)+field('posted',t.posted,row.posted)+field('due',t.due,row.due,'date');
    } else if (moduleId === 'frota') {
      const interval=deriveMileage(rows).get(row.id);
      info=`<p>${tag(fleetConsumption(row))} ${tag(interval.status,`${label.mileage}: ${finite(interval.km)?`${number(interval.km)} km`:statusName(interval.status)}`)}</p><dl><dt>${lang==='pt'?'Condutor fictício':'Fictional driver'}</dt><dd>${escape(row.driver)}</dd><dt>${lang==='pt'?'Ponto fictício':'Fictional station'}</dt><dd>${escape(row.station)}</dd></dl>`;
      fields=field('amount',t.value,row.amount)+field('odometer',t.odometer,row.odometer)+(row.type==='fuel'?field('liters',t.liters,row.liters)+field('importedKm',t.importedKm,row.importedKm,'number',null)+field('importedKmL',t.importedKmL,row.importedKmL):'');
    } else if (moduleId === 'estacionamento') {
      info=`<p>${tag(row.type,typeName(row.type))} ${row.linked===false?tag('check',lang==='pt'?'Sem vínculo confirmado; fora dos totais contratuais':'No confirmed link; excluded from contract totals'):''}</p><dl><dt>${t.validity}</dt><dd>${escape(date(row.start))} — ${escape(date(row.expires))}</dd><dt>${lang==='pt'?'Prestador fictício':'Fictional provider'}</dt><dd>${escape(row.provider)}</dd></dl>`;
      fields=field('amount',`${t.value} · ${typeName(row.type)}`,row.amount)+field('slots',t.slots,row.slots);
    } else {
      info=`<p>${t.readonlyQuantity} ${label.subset}</p>`;
      fields=`<fieldset><legend>${label.mediaUnit}</legend><div class="filters">${row.media.map((value,index)=>field(`media${index}`,`${t.media} ${index+1}`,value)).join('')}</div></fieldset><fieldset><legend>${label.supplierTotal}</legend><div class="filters">${row.suppliers.map((value,index)=>field(`suppliers${index}`,`${t.supplier} ${index+1}`,value)).join('')}</div></fieldset>`;
    }
    return `<section class="panel demo-detail" id="${prefix}-detail" aria-labelledby="${prefix}-detail-title"><div><span class="eyebrow">${t.detailTitle}</span><h3 id="${prefix}-detail-title" tabindex="-1">${escape(title(row))}</h3><p><small>${t.identifier}: ${escape(row.id)}</small></p>${info}</div><form data-demo-edit><h4>${t.edit}</h4><p>${t.changeHint}</p><div class="filters">${fields}</div><button class="button" type="submit">${t.save}</button></form></section>`;
  }

  function render(focusTarget) {
    const visible = filterRows(rows, filters);
    if (!visible.some(row=>row.id===selectedId)) selectedId = visible[0]?.id || null;
    const renderers={facilities:viewFacilities,imoveis:viewProperties,frota:viewFleet,estacionamento:viewParking,precos:viewPrices};
    const view=renderers[moduleId](visible);
    const periods=[...new Set(rows.map(month))].sort().reverse();
    const entities=[...new Set(rows.map(entity))];
    const types=[...new Set(rows.map(row=>row.type))];
    const option=(value,text,current)=>`<option value="${escape(value)}" ${value===current?'selected':''}>${escape(text)}</option>`;
    const selector=(name,title,values,defaultText,formatter=value=>value)=>`<label class="field" for="${prefix}-${name}"><span>${escape(title)}</span><select id="${prefix}-${name}" data-filter="${name}">${option('',defaultText,filters[name])}${values.map(value=>option(value,formatter(value),filters[name])).join('')}</select></label>`;
    container.innerHTML=`<p class="notice">${escape(NOTICES[moduleId][lang])}</p><div class="demo-heading"><p><strong>${t.sample}</strong><br>${t.help}</p><button type="button" class="button secondary" data-action="restore">${t.restore}</button></div><div class="filters">${selector('period',t.period,periods,t.all,value=>new Date(`${value}-01T12:00:00Z`).toLocaleDateString(locale,{year:'numeric',month:'long',timeZone:'UTC'}))}${selector('entity',ENTITY_LABEL[moduleId][lang],entities,t.allEntities,value=>moduleId==='precos'?value:`${value} · ${title(rows.find(row=>row.entity===value))}`)}${selector('type',t.type,types,t.allTypes,typeName)}<button type="button" class="button secondary" data-action="clear">${t.clear}</button></div><p class="demo-status" role="status" aria-live="polite">${announcement?`${escape(announcement)} `:''}${t.showing} ${visible.length} ${t.of} ${rows.length} ${t.records}.</p>${visible.length?`<div class="metric-grid">${view.metrics}</div><p class="demo-note">${escape(view.note)}</p>${view.chart}${view.table}${details(visible.find(row=>row.id===selectedId))}`:`<div class="empty"><h3>${t.empty}</h3><p>${t.emptyHint}</p></div>`}<p class="demo-note">${t.session}</p>`;
    if(focusTarget==='details') container.querySelector(`#${prefix}-detail-title`)?.focus({preventScroll:true});
    else if(focusTarget) container.querySelector(`[data-filter="${focusTarget}"]`)?.focus({preventScroll:true});
  }

  function onChange(event) {
    const control=event.target.closest('[data-filter]');
    if(!control || !container.contains(control)) return;
    filters[control.dataset.filter]=control.value;
    announcement='';
    render(control.dataset.filter);
  }

  function onClick(event) {
    const button=event.target.closest('button');
    if(!button || !container.contains(button)) return;
    if(button.dataset.select){selectedId=button.dataset.select;announcement='';render('details');}
    if(button.dataset.action==='clear'){filters={period:'',entity:'',type:''};announcement='';render('period');}
    if(button.dataset.action==='restore'){rows=clone(EXAMPLE_DATA[moduleId]);storeRows(moduleId,rows);filters={period:'',entity:'',type:''};selectedId=null;announcement=t.restored;render('period');}
  }

  function onSubmit(event) {
    if(!event.target.matches('[data-demo-edit]')) return;
    event.preventDefault();
    if(!event.target.reportValidity()) return;
    const selected=rows.find(row=>row.id===selectedId);
    if(!selected) return;
    const allowed={facilities:['base','amendments','posted','average','missingMonths'],imoveis:['amount','posted','due'],frota:['amount','odometer','liters','importedKm','importedKmL'],estacionamento:['amount','slots'],precos:['media0','media1','media2','suppliers0','suppliers1','suppliers2']}[moduleId];
    for(const [key,value] of new FormData(event.target)){
      if(!allowed.includes(key)) continue;
      if(key==='due'){selected.due=value || null;continue;}
      const parsed=parseNumericInput(value);
      const quote=key.match(/^(media|suppliers)([0-2])$/);
      if(quote)selected[quote[1]][Number(quote[2])]=parsed;
      else selected[key]=parsed;
    }
    storeRows(moduleId,rows);announcement=t.saved;render('details');
  }

  container.addEventListener('change',onChange);
  container.addEventListener('click',onClick);
  container.addEventListener('submit',onSubmit);
  const cleanup=()=>{container.removeEventListener('change',onChange);container.removeEventListener('click',onClick);container.removeEventListener('submit',onSubmit);mounted.delete(container);};
  mounted.set(container,cleanup);
  render();
  return cleanup;
}
