// Portfólio Kleyton Gonçalves — interações e demonstrações (dados fictícios).
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const brl2 = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  const num1 = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const dfmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const DAY = 864e5;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const addDays = (d, n) => new Date(d.getTime() + n * DAY);
  const diffDays = (a, b) => Math.round((a - b) / DAY);
  const badge = (cls, txt) => `<span class="badge badge--${cls}">${txt}</span>`;

  $('#year').textContent = today.getFullYear();

  /* ---------- Menu ---------- */
  const menuBtn = $('.menu-btn'), nav = $('#nav');
  menuBtn.addEventListener('click', () => {
    const open = menuBtn.getAttribute('aria-expanded') !== 'true';
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    nav.classList.toggle('is-open', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    menuBtn.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open');
  }));

  // Active section in nav
  const navLinks = $$('#nav a[href^="#"]');
  const spy = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      navLinks.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main section[id]').forEach(s => spy.observe(s));

  // Reveal on scroll
  const revealEls = $$('.section__head, .skill, .pipeline, .lab, .principles article, .journey li, .study, .cta');
  revealEls.forEach(el => el.classList.add('reveal'));
  const rev = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); rev.unobserve(e.target); }
  }), { threshold: .12 });
  revealEls.forEach(el => rev.observe(el));

  /* ---------- Hero: planilha viva ---------- */
  const liveRows = [
    { c: 'CT-014 Limpeza', end: 210, saldo: 48200 },
    { c: 'CT-022 Manutenção', end: 96, saldo: 12650 },
    { c: 'CT-031 Vigilância', end: 300, saldo: -3420 },
    { c: 'CT-047 Elevadores', end: 41, saldo: 7800 },
    { c: 'CT-052 Jardinagem', end: 180, saldo: 21900 }
  ];
  const liveMsgs = ['Importando lançamentos…', 'Conferindo vigências…', 'Projetando saldos…', 'Atualizando alertas…', 'Painel atualizado'];
  const liveStatus = r => r.saldo < 0 ? badge('bad', 'Insuficiência') : r.end <= 120 ? badge('warn', 'Renovar') : badge('ok', 'Regular');
  function drawLive(flashIdx = -1) {
    $('#liveSheet').innerHTML = liveRows.map((r, i) => `
      <div class="sheet__row${i === flashIdx ? ' flash' : ''}">
        <span>${r.c}</span>
        <span>${dfmt.format(addDays(today, r.end)).replace(/ de /g, ' ')}</span>
        <span class="num${r.saldo < 0 ? ' neg' : ''}">${brl.format(r.saldo)}</span>
        <span>${liveStatus(r)}</span>
      </div>`).join('');
  }
  drawLive();
  let tick = 0;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) {
    setInterval(() => {
      tick++;
      const i = tick % liveRows.length;
      const r = liveRows[i];
      r.saldo = Math.round((r.saldo + (Math.random() * 9000 - 5000)) / 10) * 10;
      r.end = Math.max(15, r.end - Math.round(Math.random() * 25));
      if (r.end <= 15) r.end = 365;
      drawLive(i);
      $('#liveMsg').textContent = liveMsgs[tick % liveMsgs.length];
    }, 2200);
  } else {
    $('#liveMsg').textContent = 'Painel atualizado';
  }

  /* ---------- Método ---------- */
  const steps = [
    {
      t: 'Registro', d: 'Tudo começa na planilha operacional, onde a equipe registra contratos, vigências, pagamentos e aditivos. Ela é simples de preencher, tem validação de dados e não leva fórmula pesada, para que ninguém quebre o que não vê.',
      chips: ['Validação de dados', 'Padronização', 'Um registro por linha'],
      mini: { cols: 3, rows: [['Contrato', 'Competência', 'Valor'], ['CT-014', '08/2026', 'R$ 18.400'], ['CT-014', '09/2026', 'R$ 18.400'], ['CT-022', '09/2026', '(vazio)']], hl: [3] }
    },
    {
      t: 'Importação', d: 'A base auxiliar puxa os dados de cada operacional por IMPORTRANGE, em abas de entrada bruta (RAW). Assim, o arquivo de quem registra fica separado do arquivo que calcula.',
      chips: ['IMPORTRANGE', 'Abas RAW', 'Parâmetros centralizados'],
      mini: { cols: 2, rows: [['Origem', 'Status'], ['Operacional contratos', 'Conectado'], ['Fonte de pagamentos', 'Conectado'], ['Operacional imóveis', 'Conectado']] }
    },
    {
      t: 'Tratamento', d: 'Normalizo datas, competências e chaves. O mesmo contrato pode aparecer escrito de três jeitos, e aqui ele vira uma chave única. Registro sem vínculo não some: fica marcado para conferência.',
      chips: ['Chaves únicas', 'Normalização de competências', 'Pendências da fonte'],
      mini: { cols: 3, rows: [['Origem', 'Chave', 'Vínculo'], ['ct 14/2025', 'CT-014', 'OK'], ['Contrato 014', 'CT-014', 'OK'], ['Proc. 77/26', '—', 'Sem vínculo']], hl: [3] }
    },
    {
      t: 'Regras', d: 'É aqui que mora a inteligência: saldo atual e projetado por ciclo, risco de insuficiência, janela de renovação de 120 dias, despesas vencidas sem lançamento, duplicidades e anomalias. Cada regra fica escrita e documentada.',
      chips: ['Saldo projetado', 'Janela de 120 dias', 'Detecção de duplicidade'],
      mini: { cols: 3, rows: [['Contrato', 'Saldo proj.', 'Regra'], ['CT-014', 'R$ 48.200', '—'], ['CT-031', '−R$ 3.420', 'Insuficiência'], ['CT-047', 'R$ 7.800', 'Renovação']], hl: [2, 3] }
    },
    {
      t: 'Painel', d: 'Os painéis só leem a base auxiliar. Quem decide filtra por período, contrato ou imóvel e vê o que precisa de ação, já separado do que está regular. Junto de cada indicador fica explicado o que ele significa e o que não significa.',
      chips: ['Risco', 'Renovações', 'Previsão', 'Histórico', 'Anomalias'],
      mini: { cols: 2, rows: [['Indicador', 'Hoje'], ['Contratos em risco', '1'], ['Na janela de renovação', '2'], ['Lançamentos em atraso', '3']] }
    }
  ];
  function renderStep(i) {
    const s = steps[i];
    const mini = s.mini.rows.map((r, ri) => `<div style="--cols:${s.mini.cols}">${r.map(c => `<span class="${ri === 0 ? 'h' : (s.mini.hl || []).includes(ri) ? 'hl' : ''}">${c}</span>`).join('')}</div>`).join('');
    $('#stepPanel').innerHTML = `
      <div><h3>${String(i + 1).padStart(2, '0')} · ${s.t}</h3><p>${s.d}</p>${s.chips.map(c => `<span class="skill-chip">${c}</span>`).join('')}</div>
      <div class="mini" aria-hidden="true">${mini}</div>`;
    $$('.pipeline button').forEach((b, bi) => b.setAttribute('aria-selected', bi === i));
  }
  $$('.pipeline button').forEach(b => b.addEventListener('click', () => renderStep(+b.dataset.step)));
  renderStep(0);

  /* ---------- Lab tabs ---------- */
  const tabs = $$('.lab__tabs button');
  function openDemo(id) {
    tabs.forEach(t => t.setAttribute('aria-selected', t.dataset.demo === id));
    $$('.demo').forEach(d => d.hidden = d.id !== 'demo-' + id);
  }
  tabs.forEach(t => t.addEventListener('click', () => openDemo(t.dataset.demo)));
  $$('[data-open-demo]').forEach(a => a.addEventListener('click', () => openDemo(a.dataset.openDemo)));

  /* ---------- Demo 1: Saldo ---------- */
  const saldoForm = $('#saldoForm');
  const saldoDefaults = Object.fromEntries($$('input', saldoForm).map(i => [i.name, i.value]));
  function calcSaldo() {
    const v = Object.fromEntries($$('input', saldoForm).map(i => [i.name, +i.value]));
    $$('output', saldoForm).forEach(o => {
      const val = v[o.dataset.for];
      o.textContent = o.dataset.for === 'comp' ? `${val} ${val === 1 ? 'mês' : 'meses'}` : brl.format(val);
    });
    const total = v.emp + v.adt;
    const atual = total - v.lan;
    const prev = v.med * v.comp;
    const proj = Math.round((atual - prev) * 100) / 100;
    $('#kAtual').textContent = brl.format(atual);
    $('#kPrev').textContent = brl.format(prev);
    $('#kProj').textContent = brl.format(proj);
    const base = Math.max(total, v.lan + prev, 1);
    $('#segUsed').style.width = (Math.min(v.lan, base) / base * 100) + '%';
    $('#segFore').style.width = (Math.min(prev, Math.max(base - v.lan, 0)) / base * 100) + '%';
    $('#segFree').style.width = (Math.max(proj, 0) / base * 100) + '%';
    $('.stack').classList.toggle('is-over', proj < 0);
    const kMain = $('#kProj').parentElement;
    kMain.className = 'kpi ' + (proj < 0 ? 'kpi--bad' : 'kpi--main');
    const verdict = $('#saldoVerdict');
    verdict.className = 'verdict';
    if (atual < 0) {
      verdict.classList.add('is-bad');
      verdict.textContent = `O lançado já passou do empenho em ${brl.format(-atual)}. Antes de projetar, confira se há aditivo ou reforço de empenho que não foi registrado.`;
    } else if (proj < 0) {
      verdict.classList.add('is-bad');
      const meses = v.med > 0 ? Math.floor(atual / v.med) : 0;
      verdict.textContent = `Risco de insuficiência: faltam ${brl.format(-proj)}. O saldo atual cobre cerca de ${meses} ${meses === 1 ? 'competência' : 'competências'} das ${v.comp} previstas. Hora de pedir reforço ou aditivo.`;
    } else if (proj < v.med) {
      verdict.classList.add('is-warn');
      verdict.textContent = `Cobre, mas no limite: sobram ${brl.format(proj)}, menos de uma média mensal. Vale acompanhar de perto.`;
    } else {
      verdict.textContent = `Saldo suficiente: depois das ${v.comp} competências restantes ainda sobram ${brl.format(proj)}.`;
    }
  }
  saldoForm.addEventListener('input', calcSaldo);
  calcSaldo();

  /* ---------- Demo 2: Renovações ---------- */
  const contracts = [
    { id: 'CT-014', nome: 'Limpeza predial', start: -300, end: 65, tram: false },
    { id: 'CT-022', nome: 'Manutenção predial', start: -200, end: 140, tram: true },
    { id: 'CT-031', nome: 'Vigilância', start: -100, end: 260, tram: false },
    { id: 'CT-047', nome: 'Elevadores', start: -330, end: 20, tram: true },
    { id: 'CT-052', nome: 'Jardinagem', start: -60, end: 330, tram: false },
    { id: 'CT-063', nome: 'Locação de veículos', start: -280, end: 175, tram: false }
  ];
  const renovSlider = $('#renovSlider');
  function renderRenov() {
    const off = +renovSlider.value;
    const ref = addDays(today, off);
    $('#renovDate').textContent = dfmt.format(ref);
    $('#renovList').innerHTML = contracts.map(c => {
      const left = c.end - off;
      const span = c.end - c.start;
      const pct = Math.min(100, Math.max(0, (off - c.start) / span * 100));
      let st, color;
      if (left < 0) { st = badge('bad', 'Encerrado'); color = 'var(--bad)'; }
      else if (left <= 120) { st = badge('warn', `Na janela · ${left} d`); color = 'var(--warn)'; }
      else { st = badge('ok', `Vigente · ${left} d`); color = 'var(--ok)'; }
      const tram = c.tram && left >= 0 ? badge('info', 'Em tramitação') : '';
      return `<div class="tl-row">
        <div class="tl-row__name">${c.id} · ${c.nome}<small>término ${dfmt.format(addDays(today, c.end))}</small></div>
        <div class="tl-track" title="Tempo de vigência decorrido"><div class="tl-fill" style="width:${pct}%;background:${color}"></div></div>
        <div class="tl-row__status">${st}${tram}</div>
      </div>`;
    }).join('');
  }
  renovSlider.addEventListener('input', renderRenov);
  renderRenov();

  /* ---------- Demo 3: Mapa de preço ---------- */
  const precoDefault = [
    { item: 'Filtro de óleo', tipo: 'Peça', refs: [42, 39.9, 47.5], props: [41, 44, 39.5] },
    { item: 'Pastilha de freio', tipo: 'Peça', refs: [189, 172, 205], props: [180, null, 176] },
    { item: 'Troca de óleo', tipo: 'Serviço', refs: [80, 95, null], props: [85, 90, 70] },
    { item: 'Alinhamento', tipo: 'Serviço', refs: [120, 110, 135], props: [115, 100, 0] }
  ];
  let preco = structuredClone(precoDefault);
  const mean = a => a.reduce((s, x) => s + x, 0) / a.length;
  const median = a => { const s = [...a].sort((x, y) => x - y), m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
  const parseVal = v => v.trim() === '' ? null : Number(v.replace(/\./g, '').replace(',', '.'));
  const showVal = v => v === null ? '' : String(v).replace('.', ',');
  function renderPrecoTable() {
    const head = `<thead><tr><th>Item</th><th>Tipo</th><th class="num">Ref. 1</th><th class="num">Ref. 2</th><th class="num">Ref. 3</th><th class="num">Média</th><th class="num">Mediana</th><th class="num">Fornec. A</th><th class="num">Fornec. B</th><th class="num">Fornec. C</th></tr></thead>`;
    const body = preco.map((r, ri) => `<tr data-row="${ri}">
      <td>${r.item}</td><td>${r.tipo}</td>
      ${r.refs.map((v, i) => `<td class="num"><input inputmode="decimal" aria-label="${r.item} referência ${i + 1}" data-k="refs" data-i="${i}" value="${showVal(v)}" placeholder="vazio" class="${v === null ? 'is-empty' : ''}"></td>`).join('')}
      <td class="num" data-out="mean"></td><td class="num" data-out="med"></td>
      ${r.props.map((v, i) => `<td class="num"><input inputmode="decimal" aria-label="${r.item} fornecedor ${'ABC'[i]}" data-k="props" data-i="${i}" value="${showVal(v)}" placeholder="vazio" class="${v === null ? 'is-empty' : ''}"></td>`).join('')}
    </tr>`).join('');
    $('#precoTable').innerHTML = head + `<tbody>${body}</tbody>`;
    calcPreco();
  }
  function calcPreco() {
    const totals = [0, 0, 0], missing = [0, 0, 0], zeros = [0, 0, 0], parts = [0, 0, 0], serv = [0, 0, 0];
    let refTotal = 0, refsFew = 0;
    preco.forEach((r, ri) => {
      const tr = $(`#precoTable tr[data-row="${ri}"]`);
      const valid = r.refs.filter(v => v !== null && !Number.isNaN(v) && v > 0);
      const m = valid.length ? mean(valid) : null, md = valid.length ? median(valid) : null;
      $('[data-out="mean"]', tr).innerHTML = m === null ? '—' : brl2.format(m);
      $('[data-out="med"]', tr).innerHTML = md === null ? '—' : `<b>${brl2.format(md)}</b>${valid.length < 3 ? `<span class="cell-note">${valid.length} de 3 fontes</span>` : ''}`;
      if (valid.length < 3) refsFew++;
      if (md !== null) refTotal += md;
      r.props.forEach((v, i) => {
        if (v === null || Number.isNaN(v)) missing[i]++;
        else if (v === 0) zeros[i]++;
        else { totals[i] += v; (r.tipo === 'Peça' ? parts : serv)[i] += v; }
      });
      $$('input', tr).forEach(inp => inp.classList.toggle('is-empty', inp.value.trim() === ''));
    });
    const complete = [0, 1, 2].filter(i => !missing[i] && !zeros[i]);
    const best = complete.length ? complete.reduce((a, b) => totals[a] <= totals[b] ? a : b) : -1;
    const cards = [0, 1, 2].map(i => {
      const issues = [];
      if (missing[i]) issues.push(`${missing[i]} sem cotação`);
      if (zeros[i]) issues.push(`${zeros[i]} com valor zero`);
      const cls = issues.length ? 'kpi kpi--warn' : 'kpi';
      return `<div class="${cls}"><span>Fornecedor ${'ABC'[i]}${i === best ? ' · <b class="best">menor completo</b>' : ''}</span><strong>${brl2.format(totals[i])}</strong><span>${issues.length ? '⚠ Incompleta: ' + issues.join(', ') : `Peças ${brl2.format(parts[i])} · Serviços ${brl2.format(serv[i])}`}</span></div>`;
    }).join('');
    $('#precoSummary').innerHTML = `<div class="kpi kpi--main"><span>Referência (soma das medianas)</span><strong>${brl2.format(refTotal)}</strong><span>${refsFew ? `${refsFew} ${refsFew === 1 ? 'item' : 'itens'} com menos de 3 fontes` : 'Todas as linhas com 3 fontes'}</span></div>${cards}`;
  }
  $('#precoTable').addEventListener('input', e => {
    const inp = e.target.closest('input'); if (!inp) return;
    const ri = +inp.closest('tr').dataset.row;
    preco[ri][inp.dataset.k][+inp.dataset.i] = parseVal(inp.value);
    calcPreco();
  });
  renderPrecoTable();

  /* ---------- Demo 4: Frota ---------- */
  const frotaDefault = [
    { id: 1, data: '02/09', placa: 'ABC-1D23', tipo: 'Gasolina', posto: 'Posto Centro', km: 48210, litros: 38, valor: 231.8 },
    { id: 2, data: '09/09', placa: 'ABC-1D23', tipo: 'Gasolina', posto: 'Posto Centro', km: 48602, litros: 35, valor: 213.5 },
    { id: 3, data: '09/09', placa: 'ABC-1D23', tipo: 'Gasolina', posto: 'Posto Centro', km: 48602, litros: 35, valor: 213.5 },
    { id: 4, data: '10/09', placa: 'ABC-1D23', tipo: 'Lavagem', posto: 'Lava-Jato Sul', km: null, litros: null, valor: 60 },
    { id: 5, data: '16/09', placa: 'ABC-1D23', tipo: 'Gasolina', posto: 'Posto Norte', km: 48590, litros: 30, valor: 183 },
    { id: 6, data: '03/09', placa: 'XYZ-9K87', tipo: 'Diesel', posto: 'Posto Rodovia', km: 102300, litros: 60, valor: 372 },
    { id: 7, data: '12/09', placa: 'XYZ-9K87', tipo: 'Diesel', posto: 'Posto Rodovia', km: 102820, litros: 52, valor: 322.4 },
    { id: 8, data: '20/09', placa: 'XYZ-9K87', tipo: 'Diesel', posto: 'Posto Rodovia', km: 103950, litros: 40, valor: 248 }
  ];
  let frota = structuredClone(frotaDefault);
  function analyzeFrota() {
    const out = new Map(frota.map(r => [r.id, { flags: [], kmRun: null, kml: null }]));
    const lastKm = {};
    const fuel = frota.filter(r => r.tipo !== 'Lavagem');
    // ordem por placa e data (já ordenado por placa no exemplo)
    fuel.forEach(r => {
      const o = out.get(r.id);
      const prev = lastKm[r.placa];
      if (prev !== undefined && r.km !== null) {
        o.kmRun = r.km - prev;
        if (o.kmRun <= 0) o.flags.push(['bad', o.kmRun === 0 ? 'KM não avançou' : 'Hodômetro regrediu']);
        else if (r.litros > 0) {
          o.kml = o.kmRun / r.litros;
          if (o.kml < 5 || o.kml > 20) o.flags.push(['warn', `Consumo ${num1.format(o.kml)} km/L`]);
        }
      }
      if (r.km !== null) lastKm[r.placa] = Math.max(prev ?? -Infinity, r.km);
    });
    // repetidos no mesmo dia / duplicidade financeira
    const sameDay = {}, dupKey = {};
    fuel.forEach(r => {
      (sameDay[r.placa + r.data] ||= []).push(r.id);
      (dupKey[[r.data, r.placa, r.posto, r.valor, r.tipo].join('|')] ||= []).push(r.id);
    });
    Object.values(sameDay).filter(g => g.length > 1).forEach(g => g.forEach(id => out.get(id).flags.push(['info', 'Repetido no dia'])));
    Object.values(dupKey).filter(g => g.length > 1).forEach(g => g.forEach(id => out.get(id).flags.push(['bad', 'Possível duplicidade'])));
    frota.filter(r => r.tipo === 'Lavagem').forEach(r => out.get(r.id).flags.push(['muted', 'Fora do consumo']));
    return out;
  }
  function renderFrota() {
    const res = analyzeFrota();
    const only = $('#frotaOnly').checked;
    const head = `<thead><tr><th>Data</th><th>Placa</th><th>Tipo</th><th>Posto</th><th class="num">Hodômetro</th><th class="num">Litros</th><th class="num">Valor</th><th class="num">KM rodado</th><th class="num">km/L</th><th>Conferência</th></tr></thead>`;
    const body = frota.map(r => {
      const o = res.get(r.id);
      const real = o.flags.filter(f => f[0] !== 'muted');
      return `<tr data-id="${r.id}" class="${real.length ? 'is-flag' : ''} ${only && !real.length ? 'is-hidden' : ''}">
        <td>${r.data}</td><td>${r.placa}</td><td>${r.tipo}</td><td>${r.posto}</td>
        <td class="num">${r.km === null ? '—' : `<input inputmode="numeric" aria-label="Hodômetro registro ${r.id}" data-k="km" value="${r.km}">`}</td>
        <td class="num">${r.litros === null ? '—' : `<input inputmode="decimal" aria-label="Litros registro ${r.id}" data-k="litros" value="${showVal(r.litros)}">`}</td>
        <td class="num">${brl2.format(r.valor)}</td>
        <td class="num">${o.kmRun === null ? '—' : o.kmRun.toLocaleString('pt-BR')}</td>
        <td class="num">${o.kml === null ? '—' : num1.format(o.kml)}</td>
        <td>${o.flags.length ? o.flags.map(f => badge(f[0], f[1])).join('') : badge('ok', 'OK')}</td>
      </tr>`;
    }).join('');
    $('#frotaTable').innerHTML = head + `<tbody>${body}</tbody>`;
    const flagged = frota.filter(r => res.get(r.id).flags.some(f => f[0] !== 'muted'));
    const dupIds = frota.filter(r => res.get(r.id).flags.some(f => f[1] === 'Possível duplicidade'));
    const comb = frota.filter(r => r.tipo !== 'Lavagem').reduce((s, r) => s + r.valor, 0);
    const outros = frota.filter(r => r.tipo === 'Lavagem').reduce((s, r) => s + r.valor, 0);
    $('#frotaSummary').innerHTML = `
      <div class="kpi"><span>Combustível</span><strong>${brl2.format(comb)}</strong></div>
      <div class="kpi"><span>Outros serviços</span><strong>${brl2.format(outros)}</strong></div>
      <div class="kpi ${flagged.length ? 'kpi--warn' : ''}"><span>Registros para conferir</span><strong>${flagged.length} de ${frota.length}</strong></div>
      <div class="kpi ${dupIds.length ? 'kpi--bad' : ''}"><span>Valor em análise (duplicidade)</span><strong>${brl2.format(dupIds.reduce((s, r) => s + r.valor, 0))}</strong></div>`;
  }
  $('#frotaTable').addEventListener('change', e => {
    const inp = e.target.closest('input'); if (!inp) return;
    const r = frota.find(x => x.id === +inp.closest('tr').dataset.id);
    const v = parseVal(inp.value);
    r[inp.dataset.k] = v === null || Number.isNaN(v) ? r[inp.dataset.k] : v;
    renderFrota();
  });
  $('#frotaOnly').addEventListener('change', renderFrota);
  renderFrota();

  /* ---------- Demo 5: Imóveis ---------- */
  // venc: dias a partir da base (null = sem vencimento); lanc: true se há valor positivo lançado; na: não se aplica
  const imovBase = addDays(today, -20);
  const imoveis = [
    { nome: 'Sede · Centro', vinc: 'Próprio', d: { Aluguel: { na: true }, 'Condomínio': { venc: 10, lanc: true }, IPTU: { venc: 15, lanc: false }, Taxas: { venc: 28, lanc: false } } },
    { nome: 'Regional Norte', vinc: 'Locado', d: { Aluguel: { venc: 5, lanc: true }, 'Condomínio': { venc: 10, lanc: false }, IPTU: { venc: 15, lanc: true }, Taxas: { venc: null, lanc: false } } },
    { nome: 'Regional Sul', vinc: 'Locado', d: { Aluguel: { venc: 5, lanc: false }, 'Condomínio': { venc: 22, lanc: false }, IPTU: { venc: 40, lanc: false }, Taxas: { venc: 18, lanc: true } } },
    { nome: 'Depósito', vinc: 'Locado', d: { Aluguel: { venc: 25, lanc: false }, 'Condomínio': { na: true }, IPTU: { venc: 15, lanc: false }, Taxas: { venc: 35, lanc: false } } }
  ];
  const tiposDesp = ['Aluguel', 'Condomínio', 'IPTU', 'Taxas'];
  const imovSlider = $('#imovSlider');
  function renderImov() {
    const off = +imovSlider.value;
    const ref = addDays(imovBase, off);
    $('#imovDate').textContent = dfmt.format(ref);
    let atraso = 0, dados = 0;
    const head = `<thead><tr><th>Imóvel</th>${tiposDesp.map(t => `<th>${t}</th>`).join('')}</tr></thead>`;
    const body = imoveis.map(im => `<tr><td><b>${im.nome}</b><span class="cell-note">${im.vinc}</span></td>${tiposDesp.map(t => {
      const x = im.d[t];
      if (x.na) return `<td><span class="cell-note">não se aplica</span></td>`;
      if (x.venc === null) { dados++; return `<td>${badge('muted', 'Sem vencimento')}<span class="cell-note">pendência de dados</span></td>`; }
      const venc = addDays(imovBase, x.venc);
      const left = diffDays(venc, ref);
      const when = `<span class="cell-note">vence ${dfmt.format(venc).replace(/ de /g, ' ')}</span>`;
      if (x.lanc) return `<td>${badge('ok', 'Lançado')}${when}</td>`;
      if (left < 0) { atraso++; return `<td>${badge('bad', 'Vencido sem lançamento')}${when}</td>`; }
      if (left <= 5) return `<td>${badge('warn', left === 0 ? 'Vence hoje' : `Vence em ${left} d`)}${when}</td>`;
      return `<td>${badge('info', 'A vencer')}${when}</td>`;
    }).join('')}</tr>`).join('');
    $('#imovTable').innerHTML =
      `<caption style="caption-side:bottom;text-align:left;padding:10px 12px;font-size:.84rem;color:var(--ink-2)">${atraso} ${atraso === 1 ? 'pendência' : 'pendências'} de lançamento · ${dados} ${dados === 1 ? 'pendência' : 'pendências'} de dados. Lançamento em atraso indica falta de registro; não prova inadimplência.</caption>` +
      head + `<tbody>${body}</tbody>`;
  }
  imovSlider.addEventListener('input', renderImov);
  renderImov();

  /* ---------- Reset ---------- */
  $('#labReset').addEventListener('click', () => {
    $$('input', saldoForm).forEach(i => { i.value = saldoDefaults[i.name]; }); calcSaldo();
    renovSlider.value = 0; renderRenov();
    preco = structuredClone(precoDefault); renderPrecoTable();
    frota = structuredClone(frotaDefault); $('#frotaOnly').checked = false; renderFrota();
    imovSlider.value = 20; renderImov();
  });
})();
