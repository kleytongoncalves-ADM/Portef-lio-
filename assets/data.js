/* Base fictícia de demonstração.
   Todos os nomes, valores e datas abaixo foram inventados para este portfólio.
   A base reproduz a ESTRUTURA dos controles (cadastros, lançamentos, regras),
   não a operação de nenhuma instituição. */
window.DEMO = (() => {
  // gerador determinístico: os números não mudam a cada visita
  let seed = 20261116;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296);
  const pick = a => a[Math.floor(rnd() * a.length)];

  const HOJE = new Date(2026, 10, 16); // data de referência da demonstração
  const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

  /* ---------- Categorias de despesa ---------- */
  const categorias = [
    { id: 'obras', nome: 'Obras e facilities', curto: 'Obras' },
    { id: 'imoveis', nome: 'Imóveis', curto: 'Imóveis' },
    { id: 'consumo', nome: 'Água e energia', curto: 'Consumo' },
    { id: 'outros', nome: 'Frota e estacionamento', curto: 'Frota/estac.' }
  ];

  /* gastos mensais por categoria (jan a out executados; nov e dez projetados) */
  const base = { obras: 148000, imoveis: 41000, consumo: 23500, outros: 17500 };
  const gastos = MESES.map((m, i) => {
    const row = { mes: m, projetado: i >= 10 };
    categorias.forEach(c => {
      const saz = c.id === 'consumo' ? 1 + 0.18 * Math.cos((i - 1) / 12 * 2 * Math.PI) : 1;
      row[c.id] = Math.round(base[c.id] * saz * (0.86 + rnd() * 0.28) / 100) * 100;
    });
    row.total = categorias.reduce((s, c) => s + row[c.id], 0);
    return row;
  });

  /* ---------- Contratos (fictícios) ---------- */
  const contratos = [
    { id: 'CT-014', objeto: 'Limpeza e conservação', tipo: 'Serviço', valor: 612000, empenho: 520000, aditivos: 40000, executado: 401000, media: 21400, fim: '2027-05-26', pendencias: 0, atrasos: 0, temMaterial: false },
    { id: 'CT-022', objeto: 'Manutenção predial', tipo: 'Serviço + material', valor: 486000, empenho: 380000, aditivos: 25000, executado: 318000, media: 24800, fim: '2027-02-01', pendencias: 2, atrasos: 1, temMaterial: true },
    { id: 'CT-031', objeto: 'Vigilância patrimonial', tipo: 'Serviço', valor: 744000, empenho: 610000, aditivos: 0, executado: 412000, media: 24000, fim: '2027-08-24', pendencias: 1, atrasos: 2, temMaterial: false },
    { id: 'CT-047', objeto: 'Manutenção de elevadores', tipo: 'Serviço', valor: 138000, empenho: 120000, aditivos: 0, executado: 104000, media: 8900, fim: '2026-12-08', pendencias: 0, atrasos: 0, temMaterial: false },
    { id: 'CT-052', objeto: 'Jardinagem', tipo: 'Serviço', valor: 96000, empenho: 90000, aditivos: 6000, executado: 52000, media: 5200, fim: '2027-04-26', pendencias: 0, atrasos: 0, temMaterial: false },
    { id: 'CT-058', objeto: 'Climatização', tipo: 'Serviço + material', valor: 352000, empenho: 260000, aditivos: 30000, executado: 236000, media: 18600, fim: '2027-03-15', pendencias: 3, atrasos: 1, temMaterial: true },
    { id: 'CT-063', objeto: 'Reforma de fachada', tipo: 'Obra', valor: 920000, empenho: 900000, aditivos: 0, executado: 418000, media: 64000, fim: '2027-06-30', pendencias: 1, atrasos: 0, temMaterial: true },
    { id: 'CT-071', objeto: 'Brigada de incêndio', tipo: 'Serviço', valor: 228000, empenho: 200000, aditivos: 0, executado: 158000, media: 15800, fim: '2027-01-20', pendencias: 0, atrasos: 1, temMaterial: false }
  ];
  contratos.forEach(c => {
    c.saldo = c.empenho + c.aditivos - c.executado;
    const fim = new Date(c.fim + 'T00:00:00');
    c.diasFim = Math.round((fim - HOJE) / 86400000);
    c.mesesRestantes = Math.max(1, Math.round(c.diasFim / 30.4));
    c.projetado = c.saldo - c.media * c.mesesRestantes;
    c.situacao = c.projetado < 0 ? 'bad' : c.diasFim <= 120 ? 'warn' : 'ok';
  });

  /* ---------- Imóveis (fictícios) ---------- */
  const imoveis = [
    { nome: 'Unidade Centro', regime: 'Locado', aluguel: 18400, condominio: 3900, iptu: 1250, taxas: 310, status: 'ok' },
    { nome: 'Unidade Norte', regime: 'Locado', aluguel: 9600, condominio: 1450, iptu: 620, taxas: null, status: 'dados' },
    { nome: 'Unidade Leste', regime: 'Próprio', aluguel: 0, condominio: 0, iptu: 980, taxas: 240, status: 'ok' },
    { nome: 'Unidade Serrana', regime: 'Locado', aluguel: 7200, condominio: 0, iptu: 410, taxas: 160, status: 'lancamento' },
    { nome: 'Unidade Litoral', regime: 'Locado', aluguel: 8350, condominio: 1100, iptu: 530, taxas: 190, status: 'ok' },
    { nome: 'Unidade Oeste', regime: 'Próprio', aluguel: 0, condominio: 0, iptu: null, taxas: 210, status: 'dados' }
  ];

  /* ---------- Medidores de consumo (fictícios) ---------- */
  const mkSerie = (ref, amp, picos) => MESES.map((m, i) => {
    const v = ref * (1 + amp * Math.cos((i - 1) / 12 * 2 * Math.PI)) * (0.94 + rnd() * 0.12);
    return Math.round((picos[i] || 1) * v);
  });
  const medidores = [
    { id: 'EN-01', nome: 'Energia · Unidade Centro', unidade: 'kWh', anterior: mkSerie(14200, 0.2, {}), atual: mkSerie(14200, 0.2, { 6: 1.34 }) },
    { id: 'EN-02', nome: 'Energia · Unidade Norte', unidade: 'kWh', anterior: mkSerie(5200, 0.22, {}), atual: mkSerie(5200, 0.22, { 3: 0.42, 8: 1.27 }) },
    { id: 'AG-01', nome: 'Água · Unidade Centro', unidade: 'm³', anterior: mkSerie(210, 0.08, {}), atual: mkSerie(210, 0.08, { 9: 1.45 }) },
    { id: 'AG-02', nome: 'Água · Unidade Litoral', unidade: 'm³', anterior: mkSerie(96, 0.1, {}), atual: mkSerie(96, 0.1, { 1: 0.4 }) }
  ];
  medidores.forEach(m => { m.atual = m.atual.slice(0, 10); }); // ano corrente vai até outubro

  /* ---------- Contas com vencimento (fictícias) ---------- */
  const etapas = ['Protocolo', 'Conferência', 'Contabilidade', 'Pago'];
  const favorecidos = ['Unidade Centro · aluguel', 'Unidade Norte · condomínio', 'EN-01 · energia', 'AG-01 · água', 'CT-022 · manutenção', 'CT-031 · vigilância', 'CT-058 · climatização', 'Estacionamento A', 'CT-014 · limpeza', 'Unidade Litoral · IPTU', 'EN-02 · energia', 'CT-071 · brigada'];
  const contas = [];
  for (let i = 0; i < 48; i++) {
    const dv = Math.round(-25 + rnd() * 50); // dias até o vencimento
    let etapa;
    if (dv < -6) etapa = rnd() < 0.7 ? 'Pago' : pick(['Conferência', 'Contabilidade']);
    else if (dv < 0) etapa = pick(['Pago', 'Contabilidade', 'Conferência', 'Protocolo']);
    else etapa = pick(['Protocolo', 'Conferência', 'Contabilidade', 'Pago', 'Protocolo']);
    const venc = new Date(HOJE); venc.setDate(venc.getDate() + dv);
    const pagoNoPrazo = etapa === 'Pago' ? (dv >= 0 || rnd() < 0.8) : null;
    contas.push({
      id: 'CX-' + String(1040 + i),
      favorecido: favorecidos[i % favorecidos.length],
      valor: Math.round((800 + rnd() * 28000) / 10) * 10,
      venc, dias: dv, etapa, pagoNoPrazo,
      diasNaEtapa: Math.round(1 + rnd() * 14)
    });
  }
  contas.forEach(c => {
    c.situacao = c.etapa === 'Pago' ? 'pago' : c.dias < 0 ? 'vencida' : c.dias <= 7 ? 'proxima' : 'emdia';
  });

  /* ---------- Aditivos para conferência (fictícios) ---------- */
  const aditivos = [
    { contrato: 'CT-014', termo: '2º TA', registro: 40000, protocolo: 'P-2231', protocoloEsperado: 'P-2231', valorProtocolo: 40000, pago: true },
    { contrato: 'CT-022', termo: '1º TA', registro: 25000, protocolo: 'P-2304', protocoloEsperado: 'P-2304', valorProtocolo: 25000, pago: false },
    { contrato: 'CT-058', termo: '3º TA', registro: 30000, protocolo: 'P-2418', protocoloEsperado: 'P-2481', valorProtocolo: 30000, pago: false },
    { contrato: 'CT-052', termo: '1º TA', registro: 6000, protocolo: 'P-2390', protocoloEsperado: 'P-2390', valorProtocolo: 6500, pago: false },
    { contrato: 'CT-031', termo: '2º TA', registro: 18000, protocolo: '', protocoloEsperado: '', valorProtocolo: null, pago: false },
    { contrato: 'CT-063', termo: '1º TA', registro: null, protocolo: 'P-2502', protocoloEsperado: 'P-2502', valorProtocolo: 45000, pago: false }
  ];

  /* ---------- Frota (fictícia) ---------- */
  const abastecimentos = [
    { placa: 'VEI-01', data: '2026-10-02', litros: 42.1, valor: 252.6, hodometro: 51230 },
    { placa: 'VEI-01', data: '2026-10-11', litros: 39.8, valor: 238.8, hodometro: 51702 },
    { placa: 'VEI-02', data: '2026-10-04', litros: 48.0, valor: 288.0, hodometro: 88410 },
    { placa: 'VEI-02', data: '2026-10-04', litros: 48.0, valor: 288.0, hodometro: 88410 },
    { placa: 'VEI-02', data: '2026-10-15', litros: 45.5, valor: 273.0, hodometro: 88902 },
    { placa: 'VEI-03', data: '2026-10-06', litros: 36.2, valor: 217.2, hodometro: 23950 },
    { placa: 'VEI-03', data: '2026-10-19', litros: 37.9, valor: 227.4, hodometro: 23810 },
    { placa: 'VEI-01', data: '2026-10-22', litros: 41.0, valor: 246.0, hodometro: 52188 }
  ];

  /* ---------- Estacionamentos (fictícios) ---------- */
  const estacionamentos = [
    { nome: 'Estacionamento A', vagas: 12, valorGlobal: 86400, periodicidade: 'mensal', meses: 12 },
    { nome: 'Estacionamento B', vagas: 6, valorGlobal: 39600, periodicidade: 'mensal', meses: 12 },
    { nome: 'Estacionamento C', vagas: 4, valorGlobal: 21000, periodicidade: null, meses: null },
    { nome: 'Estacionamento D', vagas: 8, valorGlobal: 4800, periodicidade: 'avulso', meses: null }
  ];

  /* ---------- Mapa de preços (fictício) ---------- */
  const propostas = [
    { fonte: 'Fornecedor 1', valor: 1180 },
    { fonte: 'Fornecedor 2', valor: 1265 },
    { fonte: 'Fornecedor 3', valor: null },
    { fonte: 'Painel público', valor: 1210 },
    { fonte: 'Contratação similar', valor: 1340 }
  ];

  return { HOJE, MESES, categorias, gastos, contratos, imoveis, medidores, contas, etapas, aditivos, abastecimentos, estacionamentos, propostas };
})();
