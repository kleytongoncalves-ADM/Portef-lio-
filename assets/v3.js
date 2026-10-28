(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  /* Tema */
  const root = document.documentElement;
  try { const t = localStorage.getItem('tema'); if (t) root.dataset.theme = t; } catch (e) {}
  const themeBtn = $('#tema');
  const isDark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  const paintTheme = () => { themeBtn.querySelector('span').textContent = isDark() ? 'Tema claro' : 'Tema escuro'; };
  themeBtn.addEventListener('click', () => {
    root.dataset.theme = isDark() ? 'light' : 'dark';
    try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
    paintTheme();
  });
  paintTheme();

  /* Menu móvel */
  const side = $('.side'), mbtn = $('.menu-btn');
  mbtn.addEventListener('click', () => { const o = side.classList.toggle('is-open'); mbtn.setAttribute('aria-expanded', o); });
  $$('.nav a').forEach(a => a.addEventListener('click', () => { side.classList.remove('is-open'); mbtn.setAttribute('aria-expanded', 'false'); }));

  /* Seção ativa no menu */
  const links = $$('.nav a'), secs = links.map(a => $(a.getAttribute('href')));
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + e.target.id))); });
  }, { rootMargin: '-35% 0px -55% 0px' });
  secs.forEach(s => s && io.observe(s));

  /* Simulador de saldo */
  const f = id => $('#' + id);
  const calcSaldo = () => {
    const emp = +f('emp').value, adit = +f('adit').value, lanc = +f('lanc').value, med = +f('med').value, comp = +f('comp').value;
    f('emp-o').textContent = brl.format(emp); f('adit-o').textContent = brl.format(adit); f('lanc-o').textContent = brl.format(lanc);
    f('med-o').textContent = brl.format(med); f('comp-o').textContent = comp + (comp === 1 ? ' mês' : ' meses');
    const total = emp + adit, atual = total - lanc, prev = med * comp, proj = atual - prev;
    f('k-atual').textContent = brl.format(atual); f('k-prev').textContent = brl.format(prev); f('k-proj').textContent = brl.format(proj);
    f('kp').className = 'kpi ' + (proj < 0 ? 'bad' : 'ok');
    const base = Math.max(total, 1);
    const a = Math.min(Math.max(lanc, 0), base), b = Math.min(Math.max(prev, 0), Math.max(base - a, 0));
    f('seg-a').style.width = (a / base * 100) + '%'; f('seg-b').style.width = (b / base * 100) + '%'; f('seg-c').style.width = (Math.max(base - a - b, 0) / base * 100) + '%';
    const v = f('verdict'); let cls = 'ok', msg;
    if (atual < 0) { cls = 'bad'; msg = `O lançado já passou do empenho em ${brl.format(-atual)}. Confira se há aditivo ou reforço de empenho não registrado.`; }
    else if (proj < 0) { const m = med > 0 ? Math.floor(atual / med) : 0; cls = 'bad'; msg = `Risco de insuficiência: faltam ${brl.format(-proj)}. O saldo atual cobre cerca de ${m} das ${comp} competências previstas. Hora de pedir reforço ou aditivo.`; }
    else if (proj < med) { cls = 'warn'; msg = `Cobre, mas no limite: sobram ${brl.format(proj)}, menos de uma média mensal.`; }
    else { msg = `Saldo suficiente: depois das ${comp} competências restantes ainda sobram ${brl.format(proj)}.`; }
    v.className = 'verdict ' + cls; v.textContent = msg;
  };
  $$('#saldo input').forEach(i => i.addEventListener('input', calcSaldo));
  f('saldo-reset').addEventListener('click', () => {
    const d = { emp: 240000, adit: 20000, lanc: 150000, med: 18500, comp: 6 };
    Object.entries(d).forEach(([k, v]) => { f(k).value = v; }); calcSaldo();
  });
  calcSaldo();

  /* Radar de renovação (janela de 120 dias) */
  const dt = f('termino');
  const iso = d => d.toISOString().slice(0, 10);
  const setDefault = () => { const d = new Date(); d.setDate(d.getDate() + 95); dt.value = iso(d); };
  const calcRadar = () => {
    if (!dt.value) return;
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const fim = new Date(dt.value + 'T00:00:00');
    const dias = Math.round((fim - hoje) / 86400000);
    const out = f('radar'), chip = f('radar-chip'), n = f('radar-dias');
    n.textContent = dias < 0 ? Math.abs(dias) + ' dias' : dias + ' dias';
    if (dias < 0) { chip.className = 'chip bad'; chip.textContent = 'Vigência encerrada'; out.className = 'verdict bad'; out.textContent = `A vigência terminou há ${Math.abs(dias)} dias. Verifique se há termo aditivo ou nova contratação em andamento.`; }
    else if (dias <= 120) { chip.className = 'chip warn'; chip.textContent = 'Renovar'; out.className = 'verdict warn'; out.textContent = `Dentro da janela de 120 dias: faltam ${dias} dias. A situação da tramitação é acompanhada à parte.`; }
    else { chip.className = 'chip ok'; chip.textContent = 'Regular'; out.className = 'verdict ok'; out.textContent = `Fora da janela: a renovação passa a ser sinalizada em ${dias - 120} dias.`; }
  };
  setDefault(); dt.addEventListener('input', calcRadar); calcRadar();
})();
