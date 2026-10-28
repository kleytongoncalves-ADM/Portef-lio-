/* Interações v4 — tudo opcional: sem JS o conteúdo continua visível e legível. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

  /* ---------- Aviso (toast) ---------- */
  const toastEl = $('#toast');
  let toastTimer;
  const toast = msg => {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2200);
  };

  /* ---------- Tema ---------- */
  const themeBtn = $('#tema');
  const isDark = () => root.dataset.theme === 'dark' || (!root.dataset.theme && matchMedia('(prefers-color-scheme: dark)').matches);
  if (themeBtn) {
    const paint = () => {
      const d = isDark();
      themeBtn.querySelector('span').textContent = d ? 'Tema claro' : 'Tema escuro';
      themeBtn.querySelector('use').setAttribute('href', d ? '#i-sun' : '#i-moon');
      themeBtn.setAttribute('aria-label', d ? 'Mudar para o tema claro' : 'Mudar para o tema escuro');
    };
    themeBtn.addEventListener('click', () => {
      root.classList.add('theme-anim');
      root.dataset.theme = isDark() ? 'light' : 'dark';
      try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
      paint();
      setTimeout(() => root.classList.remove('theme-anim'), 400);
    });
    paint();
  }

  /* ---------- Rolagem suave só em cliques internos (links diretos abrem na seção, sem deslizar) ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const target = id && document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Entrada suave ao rolar ---------- */
  $$('.bento').forEach(b => [...b.children].forEach((c, i) => c.style.setProperty('--i', Math.min(i, 5))));
  const initReveal = () => {
    // anima só o que ainda está abaixo da dobra: links diretos (#lab) e a primeira tela nunca ficam vazios
    const below = $$('.sec__head, .sec .card, .job').filter(el => el.getBoundingClientRect().top > innerHeight * 0.92);
    below.forEach(el => el.setAttribute('data-rv', ''));
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: 0.08, rootMargin: '0px 0px -4% 0px' });
    below.forEach(el => io.observe(el));
  };
  if (root.classList.contains('rv')) requestAnimationFrame(() => requestAnimationFrame(initReveal));

  /* ---------- Menu, indicador e progresso ---------- */
  const side = $('.side'), nav = $('.nav'), menuBtn = $('.menu-btn'), bar = $('.progress');
  const links = nav ? $$('a', nav) : [];
  const secs = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  let ind = null;
  if (nav) {
    ind = document.createElement('span');
    ind.className = 'nav__ind';
    nav.prepend(ind);
    nav.classList.add('has-ind');
  }
  const placeInd = () => {
    const cur = nav && $('a[aria-current="true"]', nav);
    if (!cur || !ind) return;
    ind.style.height = cur.offsetHeight + 'px';
    ind.style.setProperty('--y', cur.offsetTop + 'px');
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      if (secs.length) {
        let cur = secs[0];
        secs.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) cur = s; });
        if (max > 0 && scrollY >= max - 4) cur = secs[secs.length - 1];
        links.forEach(l => l.setAttribute('aria-current', String(l.getAttribute('href') === '#' + cur.id)));
        placeInd();
      }
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { placeInd(); if (innerWidth > 900) setOpen(false); });
  onScroll();

  const setOpen = o => {
    if (!side || !menuBtn) return;
    side.classList.toggle('is-open', o);
    menuBtn.setAttribute('aria-expanded', String(o));
    if (o) requestAnimationFrame(placeInd);
  };
  if (menuBtn) {
    menuBtn.addEventListener('click', () => setOpen(!side.classList.contains('is-open')));
    links.forEach(a => a.addEventListener('click', () => setOpen(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && side.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); } });
    document.addEventListener('click', e => { if (side.classList.contains('is-open') && !side.contains(e.target)) setOpen(false); });
  }

  /* ---------- Copiar e-mail ---------- */
  $$('[data-copy]').forEach(btn => btn.addEventListener('click', async () => {
    const text = btn.dataset.copy, label = btn.querySelector('span');
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
      const t = document.createElement('textarea');
      t.value = text; t.style.position = 'fixed'; t.style.opacity = '0';
      document.body.appendChild(t); t.select();
      try { ok = document.execCommand('copy'); } catch (e2) {}
      t.remove();
    }
    const old = label.textContent;
    label.textContent = ok ? 'Copiado' : 'Copie manualmente';
    toast(ok ? 'E-mail copiado' : 'Não foi possível copiar: ' + text);
    setTimeout(() => { label.textContent = old; }, 1800);
  }));

  /* ---------- Filtro da tabela de contratos ---------- */
  const rows = $$('#contratos tbody tr');
  const fbtns = $$('.fbtn');
  if (rows.length && fbtns.length) {
    const status = $('#tstatus');
    const names = { all: 'Todos', ok: 'Regular', warn: 'Renovar', bad: 'Insuficiência' };
    fbtns.forEach(b => {
      const f = b.dataset.f;
      const n = f === 'all' ? rows.length : rows.filter(r => r.dataset.s === f).length;
      b.textContent = `${names[f]} (${n})`;
    });
    const apply = f => {
      let n = 0;
      rows.forEach(r => {
        const show = f === 'all' || r.dataset.s === f;
        r.classList.toggle('is-off', !show);
        r.classList.remove('row-in');
        if (show) { r.style.setProperty('--i', n++); void r.offsetWidth; if (!reduce) r.classList.add('row-in'); }
      });
      fbtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
      status.textContent = `Mostrando ${n} de ${rows.length} contratos` + (f === 'all' ? '.' : ` (filtro: ${names[f]}).`);
    };
    fbtns.forEach(b => b.addEventListener('click', () => apply(b.dataset.f)));
  }

  /* ---------- Utilidades dos simuladores ---------- */
  const tween = (el, to, fmt) => {
    el.dataset.v = to;
    const from = el._v ?? to;
    el._v = to;
    cancelAnimationFrame(el._raf);
    clearTimeout(el._t);
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 320;
    const step = now => {
      const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
    // garante o valor final mesmo se o navegador atrasar quadros (aba em segundo plano, aparelho lento)
    el._t = setTimeout(() => { cancelAnimationFrame(el._raf); el.textContent = fmt(to); }, dur + 80);
  };
  const fillRange = r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  const setVerdict = (el, cls, icon, msg) => {
    const first = el.dataset.msg === undefined;
    if (first) el.dataset.msg = el.textContent.trim();
    const changed = el.dataset.msg !== msg;
    el.dataset.msg = msg;
    el.className = 'verdict ' + cls;
    el.innerHTML = `<svg class="icon" aria-hidden="true"><use href="#${icon}"/></svg><span></span>`;
    el.querySelector('span').textContent = msg;
    if (changed && !reduce) { void el.offsetWidth; el.classList.add('swap'); }
  };
  const $id = id => document.getElementById(id);

  /* ---------- Simulador de saldo ---------- */
  const saldo = $id('saldo');
  if (saldo) {
    const defaults = { emp: 240000, adit: 20000, lanc: 150000, med: 18500, comp: 6 };
    const calc = () => {
      const v = k => +$id(k).value;
      const emp = v('emp'), adit = v('adit'), lanc = v('lanc'), med = v('med'), comp = v('comp');
      $$('input[type=range]', saldo).forEach(fillRange);
      $id('emp-o').textContent = brl.format(emp); $id('adit-o').textContent = brl.format(adit); $id('lanc-o').textContent = brl.format(lanc);
      $id('med-o').textContent = brl.format(med); $id('comp-o').textContent = comp + (comp === 1 ? ' mês' : ' meses');
      const total = emp + adit, atual = total - lanc, prev = med * comp, proj = atual - prev;
      tween($id('k-atual'), atual, brl.format.bind(brl));
      tween($id('k-prev'), prev, brl.format.bind(brl));
      tween($id('k-proj'), proj, brl.format.bind(brl));
      $id('kp').className = 'kpi ' + (proj < 0 ? 'bad' : 'ok');
      const base = Math.max(total, 1);
      const a = Math.min(Math.max(lanc, 0), base), b = Math.min(Math.max(prev, 0), Math.max(base - a, 0)), c = Math.max(base - a - b, 0);
      $id('seg-a').style.width = (a / base * 100) + '%'; $id('seg-b').style.width = (b / base * 100) + '%'; $id('seg-c').style.width = (c / base * 100) + '%';
      $id('lg-a').textContent = brl.format(a); $id('lg-b').textContent = brl.format(b); $id('lg-c').textContent = brl.format(c);
      const vd = $id('verdict');
      if (atual < 0) setVerdict(vd, 'bad', 'i-alert', `O lançado já passou do empenho em ${brl.format(-atual)}. Confira se há aditivo ou reforço de empenho não registrado.`);
      else if (proj < 0) setVerdict(vd, 'bad', 'i-alert', `Risco de insuficiência: faltam ${brl.format(-proj)}. O saldo atual cobre cerca de ${med > 0 ? Math.floor(atual / med) : 0} das ${comp} competências previstas. Hora de pedir reforço ou aditivo.`);
      else if (proj < med) setVerdict(vd, 'warn', 'i-info', `Cobre, mas no limite: sobram ${brl.format(proj)}, menos de uma média mensal.`);
      else setVerdict(vd, 'ok', 'i-check', `Saldo suficiente: depois das ${comp} competências restantes ainda sobram ${brl.format(proj)}.`);
    };
    $$('input[type=range]', saldo).forEach(i => i.addEventListener('input', calc));
    $id('saldo-reset').addEventListener('click', () => {
      Object.entries(defaults).forEach(([k, val]) => { $id(k).value = val; });
      calc();
      toast('Valores restaurados');
    });
    calc();
  }

  /* ---------- Radar de renovação (janela de 120 dias) ---------- */
  const dt = $id('termino');
  if (dt) {
    if (!dt.value) { const d = new Date(); d.setDate(d.getDate() + 95); dt.value = d.toISOString().slice(0, 10); }
    const calcRadar = () => {
      const out = $id('radar'), chip = $id('radar-chip');
      if (!dt.value) { chip.className = 'chip'; chip.textContent = '—'; $id('radar-dias').textContent = '—'; setVerdict(out, '', 'i-info', 'Escolha uma data para ver a situação do contrato.'); return; }
      const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
      const dias = Math.round((new Date(dt.value + 'T00:00:00') - hoje) / 86400000);
      $id('radar-lab').textContent = dias < 0 ? 'Passaram' : 'Faltam';
      $id('radar-dias').textContent = Math.abs(dias) + (Math.abs(dias) === 1 ? ' dia' : ' dias');
      if (dias < 0) { chip.className = 'chip bad'; chip.textContent = 'Vigência encerrada'; setVerdict(out, 'bad', 'i-alert', `A vigência terminou há ${-dias} dias. Verifique se há termo aditivo ou nova contratação em andamento.`); }
      else if (dias <= 120) { chip.className = 'chip warn'; chip.textContent = 'Renovar'; setVerdict(out, 'warn', 'i-info', `Dentro da janela de 120 dias: faltam ${dias} dias. A situação da tramitação é acompanhada à parte.`); }
      else { chip.className = 'chip ok'; chip.textContent = 'Regular'; setVerdict(out, 'ok', 'i-check', `Fora da janela: a renovação passa a ser sinalizada em ${dias - 120} dias.`); }
    };
    dt.addEventListener('input', calcRadar);
    calcRadar();
  }

  /* ---------- Impressão do currículo ---------- */
  $$('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));
})();
