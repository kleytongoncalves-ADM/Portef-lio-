/* Portfólio · interações e demonstrações (dados fictícios em data.js).
   Sem JS, o conteúdo textual continua visível; as demonstrações dependem deste arquivo. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const $id = id => document.getElementById(id);
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const D = window.DEMO || null;
  const NS = 'http://www.w3.org/2000/svg';

  const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const num = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 });
  const int = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 });
  const money = v => (v < 0 ? '−' : '') + brl.format(Math.abs(v));
  const compact = v => {
    const a = Math.abs(v), s = v < 0 ? '−' : '';
    if (a >= 1e6) return `${s}R$ ${num.format(a / 1e6)} mi`;
    if (a >= 1e3) return `${s}R$ ${int.format(a / 1e3)} mil`;
    return s + brl.format(a);
  };
  const dateBR = d => d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const icon = id => `<svg class="icon" aria-hidden="true"><use href="#${id}"/></svg>`;
  const chip = (cls, txt) => `<span class="chip ${cls}">${esc(txt)}</span>`;

  /* ---------- Aviso ---------- */
  const toastEl = $id('toast');
  let toastTimer;
  const toast = msg => {
    if (!toastEl) return;
    toastEl.querySelector('span').textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('on'), 2200);
  };

  /* ---------- Tema (escuro é o padrão da identidade) ---------- */
  const themeBtn = $id('tema');
  const isLight = () => root.dataset.theme === 'light';
  if (themeBtn) {
    const paint = () => {
      const l = isLight();
      themeBtn.querySelector('use').setAttribute('href', l ? '#i-moon' : '#i-sun');
      themeBtn.setAttribute('aria-label', l ? 'Mudar para o tema escuro' : 'Mudar para o tema claro');
    };
    themeBtn.addEventListener('click', () => {
      root.classList.add('theme-anim');
      root.dataset.theme = isLight() ? 'dark' : 'light';
      try { localStorage.setItem('tema', root.dataset.theme); } catch (e) {}
      paint();
      setTimeout(() => root.classList.remove('theme-anim'), 400);
    });
    paint();
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
  $$('[data-print]').forEach(b => b.addEventListener('click', () => window.print()));

  if (!$id('inicio')) return; // currículo: só precisa do que está acima

  /* ---------- Rolagem suave em links internos ---------- */
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
    const id = a.getAttribute('href').slice(1);
    const target = id && $id(id);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    history.pushState(null, '', '#' + id);
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });

  /* ---------- Menu, seção ativa e progresso ---------- */
  const top = $('.top'), nav = $id('nav'), menuBtn = $('.menu-btn'), bar = $('.progress i');
  const links = $$('a[href^="#"]', nav);
  const secs = links.map(a => $id(a.getAttribute('href').slice(1))).filter(Boolean);
  const setOpen = o => {
    top.classList.toggle('is-open', o);
    menuBtn.setAttribute('aria-expanded', String(o));
    menuBtn.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
    menuBtn.querySelector('use').setAttribute('href', o ? '#i-close' : '#i-menu');
  };
  menuBtn.addEventListener('click', () => setOpen(!top.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape' && top.classList.contains('is-open')) { setOpen(false); menuBtn.focus(); } });
  document.addEventListener('click', e => { if (top.classList.contains('is-open') && !top.contains(e.target)) setOpen(false); });
  addEventListener('resize', () => { if (innerWidth > 1080) setOpen(false); });

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
      top.classList.toggle('is-scrolled', scrollY > 12);
      let cur = null;
      secs.forEach(s => { if (s.getBoundingClientRect().top <= innerHeight * 0.35) cur = s; });
      links.forEach(l => {
        const on = cur && l.getAttribute('href') === '#' + cur.id;
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    });
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Entrada suave ao rolar ---------- */
  const revealOnce = (els, cb) => {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { cb(e.target); io.unobserve(e.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    els.forEach(el => io.observe(el));
  };
  if (root.classList.contains('rv')) {
    requestAnimationFrame(() => {
      const els = $$('.sec__head, .domain, .card, .layers, .lpanel, .pipeline, .scale__item, .job, .pair, .tool, .arch, .flow, .cta, .qtabs, .ptabs, .competencias')
        .filter(el => el.getBoundingClientRect().top > innerHeight * 0.92);
      els.forEach(el => el.setAttribute('data-rv', ''));
      revealOnce(els, el => el.classList.add('in'));
    });
  }

  /* ---------- Contagem progressiva ---------- */
  const tween = (el, to, fmt, dur = 320) => {
    const from = el._v ?? to;
    el._v = to;
    cancelAnimationFrame(el._raf);
    clearTimeout(el._t);
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = now => {
      const k = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(from + (to - from) * e);
      if (k < 1) el._raf = requestAnimationFrame(step);
    };
    el._raf = requestAnimationFrame(step);
    el._t = setTimeout(() => { cancelAnimationFrame(el._raf); el.textContent = fmt(to); }, dur + 80);
  };
  const countUp = (el, to, fmt) => { el._v = 0; tween(el, to, fmt, 1100); };

  /* ---------- Dica flutuante dos gráficos ---------- */
  const tip = $id('tip');
  const showTip = (html, x, y) => {
    tip.innerHTML = html; tip.hidden = false;
    const r = tip.getBoundingClientRect();
    let left = x + 14, topY = y - r.height - 12;
    if (left + r.width > innerWidth - 8) left = x - r.width - 14;
    if (topY < 8) topY = y + 16;
    tip.style.transform = `translate(${Math.round(left)}px, ${Math.round(topY)}px)`;
  };
  const hideTip = () => { tip.hidden = true; };
  addEventListener('scroll', hideTip, { passive: true });

  /* ---------- Primitivas SVG ---------- */
  const svgEl = (tag, attrs = {}, parent) => {
    const el = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    if (parent) parent.appendChild(el);
    return el;
  };
  const mkSvg = (el, w, h, label) => {
    el.innerHTML = '';
    const s = svgEl('svg', { viewBox: `0 0 ${w} ${h}`, width: w, height: h, class: 'viz', role: 'img', 'aria-label': label });
    el.appendChild(s);
    return s;
  };
  const niceMax = v => {
    if (v <= 0) return 1;
    const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p;
    return (n <= 1 ? 1 : n <= 1.5 ? 1.5 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 3 ? 3 : n <= 4 ? 4 : n <= 5 ? 5 : n <= 6 ? 6 : n <= 8 ? 8 : 10) * p;
  };
  const roundedTopRect = (x, y, w, h, r = 3) => {
    // barra com cantos arredondados só na ponta (longe da linha de base)
    r = Math.min(r, w / 2, Math.abs(h));
    if (h <= 0) return '';
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  };
  const growIn = (s) => { if (!reduce) { s.classList.add('grow'); requestAnimationFrame(() => requestAnimationFrame(() => s.classList.add('grown'))); } };

  /* Linha com área, projeção tracejada e cursor de leitura */
  const W = el => Math.max(260, Math.round(el.clientWidth || 520));
  const lineChart = (el, { labels, values, projFrom = values.length, fmt = compact, label, h = 180, refLine = null }) => {
    const w = W(el), pl = 44, pr = 12, pt = 12, pb = 24;
    const s = mkSvg(el, w, h, label);
    const max = niceMax(Math.max(...values, refLine || 0) * 1.08);
    const X = i => pl + (i / (values.length - 1)) * (w - pl - pr);
    const Y = v => pt + (1 - v / max) * (h - pt - pb);
    const g = svgEl('g', { class: 'axis' }, s);
    [0, 0.5, 1].forEach(k => {
      svgEl('line', { x1: pl, x2: w - pr, y1: Y(max * k), y2: Y(max * k), class: 'grid' }, g);
      svgEl('text', { x: pl - 8, y: Y(max * k) + 3, 'text-anchor': 'end' }, g).textContent = compact(max * k).replace('R$ ', '');
    });
    const every = w < 420 ? 3 : w < 640 ? 2 : 1;
    labels.forEach((l, i) => { if (i % every === 0) svgEl('text', { x: X(i), y: h - 6, 'text-anchor': 'middle' }, g).textContent = l; });
    const pts = values.map((v, i) => [X(i), Y(v)]);
    const real = pts.slice(0, projFrom), proj = pts.slice(projFrom - 1);
    const path = p => p.map((q, i) => (i ? 'L' : 'M') + q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('');
    svgEl('path', { d: path(real) + `L${real[real.length - 1][0]},${Y(0)}L${real[0][0]},${Y(0)}Z`, class: 'area' }, s);
    const ln = svgEl('path', { d: path(real), class: 'line', pathLength: 1 }, s);
    if (proj.length > 1) svgEl('path', { d: path(proj), class: 'line line--proj' }, s);
    if (refLine) svgEl('line', { x1: pl, x2: w - pr, y1: Y(refLine), y2: Y(refLine), class: 'ref' }, s);
    const last = real[real.length - 1];
    svgEl('circle', { cx: last[0], cy: last[1], r: 4, class: 'endpt' }, s);
    if (!reduce && !el.dataset.drawn) { ln.classList.add('draw'); el.dataset.drawn = '1'; }
    // cursor
    const cross = svgEl('line', { y1: pt, y2: h - pb, class: 'cross', visibility: 'hidden' }, s);
    const dot = svgEl('circle', { r: 4.5, class: 'hoverpt', visibility: 'hidden' }, s);
    const hit = svgEl('rect', { x: pl, y: 0, width: w - pl - pr, height: h, fill: 'transparent' }, s);
    const move = ev => {
      const r = s.getBoundingClientRect();
      const px = ((ev.clientX - r.left) / r.width) * w;
      const i = Math.max(0, Math.min(values.length - 1, Math.round((px - pl) / (w - pl - pr) * (values.length - 1))));
      cross.setAttribute('x1', X(i)); cross.setAttribute('x2', X(i)); cross.setAttribute('visibility', 'visible');
      dot.setAttribute('cx', X(i)); dot.setAttribute('cy', Y(values[i])); dot.setAttribute('visibility', 'visible');
      showTip(`<b>${esc(labels[i])}</b><span>${fmt(values[i])}</span>${i >= projFrom ? '<em>projeção</em>' : ''}`, ev.clientX, ev.clientY);
    };
    hit.addEventListener('pointermove', move);
    hit.addEventListener('pointerleave', () => { cross.setAttribute('visibility', 'hidden'); dot.setAttribute('visibility', 'hidden'); hideTip(); });
    return s;
  };

  /* Rosca com legenda (identidade nunca só pela cor) */
  const donut = (el, items, { label, center }) => {
    el.innerHTML = '';
    const total = items.reduce((a, b) => a + b.v, 0);
    const wrap = document.createElement('div'); wrap.className = 'donut';
    const s = svgEl('svg', { viewBox: '0 0 120 120', class: 'viz', role: 'img', 'aria-label': label });
    wrap.appendChild(s);
    const R = 46, C = 2 * Math.PI * R;
    let acc = 0;
    items.forEach((it, i) => {
      const frac = it.v / total, gap = 1.6;
      const seg = svgEl('circle', { cx: 60, cy: 60, r: R, class: `arc c${i + 1}`, 'stroke-dasharray': `${Math.max(frac * C - gap, 0)} ${C}`, 'stroke-dashoffset': -acc * C, transform: 'rotate(-90 60 60)' }, s);
      seg.addEventListener('pointermove', ev => showTip(`<b>${esc(it.n)}</b><span>${compact(it.v)} · ${num.format(frac * 100)}%</span>`, ev.clientX, ev.clientY));
      seg.addEventListener('pointerleave', hideTip);
      acc += frac;
    });
    if (center) {
      svgEl('text', { x: 60, y: 58, 'text-anchor': 'middle', class: 'dc1' }, s).textContent = center[0];
      svgEl('text', { x: 60, y: 72, 'text-anchor': 'middle', class: 'dc2' }, s).textContent = center[1];
    }
    const ul = document.createElement('ul'); ul.className = 'dlegend';
    ul.innerHTML = items.map((it, i) => `<li><i class="sw c${i + 1}"></i><span>${esc(it.n)}</span><b class="mono">${num.format(it.v / total * 100)}%</b></li>`).join('');
    wrap.appendChild(ul);
    el.appendChild(wrap);
  };

  /* Barras horizontais divergentes (saldo projetado positivo × negativo) */
  const hbars = (el, items, { label, fmt = compact }) => {
    el.innerHTML = '';
    const max = Math.max(...items.map(i => Math.abs(i.v)), 1);
    const ul = document.createElement('ul'); ul.className = 'hbars'; ul.setAttribute('aria-label', label);
    ul.innerHTML = items.map(it => {
      const pct = Math.abs(it.v) / max * 50;
      const cls = it.v < 0 ? 'neg' : it.cls || 'pos';
      return `<li tabindex="0" data-tip="${esc(it.n)}|${esc(fmt(it.v))}${it.extra ? '|' + esc(it.extra) : ''}"><span class="mono n">${esc(it.n)}</span><span class="track"><i class="${cls}" style="--w:${pct}%"></i></span><b class="mono v ${it.v < 0 ? 'bad-t' : ''}">${fmt(it.v)}</b></li>`;
    }).join('');
    el.appendChild(ul);
    bindTips(ul);
    if (!reduce) { ul.classList.add('grow'); requestAnimationFrame(() => requestAnimationFrame(() => ul.classList.add('grown'))); }
  };
  const bindTips = scope => $$('[data-tip]', scope).forEach(n => {
    const parts = () => n.dataset.tip.split('|');
    const show = (x, y) => { const [a, b, c] = parts(); showTip(`<b>${a}</b><span>${b}</span>${c ? `<em>${c}</em>` : ''}`, x, y); };
    n.addEventListener('pointermove', ev => show(ev.clientX, ev.clientY));
    n.addEventListener('pointerleave', hideTip);
    n.addEventListener('focus', () => { const r = n.getBoundingClientRect(); show(r.left + r.width / 2, r.top); });
    n.addEventListener('blur', hideTip);
  });

  /* Colunas verticais simples (com classe por barra) */
  const columns = (el, items, { label, h = 180, fmt = compact, ref = null }) => {
    const w = W(el), pl = 44, pr = 8, pt = 10, pb = 24;
    const s = mkSvg(el, w, h, label);
    const max = niceMax(Math.max(...items.flatMap(i => [i.v, i.r || 0])) * 1.1);
    const Y = v => pt + (1 - v / max) * (h - pt - pb);
    const g = svgEl('g', { class: 'axis' }, s);
    [0, 0.5, 1].forEach(k => {
      svgEl('line', { x1: pl, x2: w - pr, y1: Y(max * k), y2: Y(max * k), class: 'grid' }, g);
      svgEl('text', { x: pl - 8, y: Y(max * k) + 3, 'text-anchor': 'end' }, g).textContent = fmt(max * k, true);
    });
    const slot = (w - pl - pr) / items.length;
    items.forEach((it, i) => {
      const x0 = pl + i * slot;
      if (it.r != null) {
        const bw = slot * 0.3;
        svgEl('path', { d: roundedTopRect(x0 + slot * 0.16, Y(it.r), bw, Y(0) - Y(it.r)), class: 'bar bar--ref' }, s);
      }
      const bw = it.r != null ? slot * 0.3 : slot * 0.56;
      const bx = it.r != null ? x0 + slot * 0.16 + bw + 2 : x0 + slot * 0.22;
      if (it.v != null) svgEl('path', { d: roundedTopRect(bx, Y(it.v), bw, Y(0) - Y(it.v)), class: 'bar ' + (it.cls || '') }, s);
      if (slot >= 26 || i % 2 === 0) svgEl('text', { x: x0 + slot / 2, y: h - 6, 'text-anchor': 'middle' }, g).textContent = it.n;
      const hit = svgEl('rect', { x: x0, y: pt, width: slot, height: h - pt - pb, fill: 'transparent', class: 'hit' }, s);
      hit.addEventListener('pointermove', ev => showTip(it.tip || `<b>${esc(it.n)}</b><span>${fmt(it.v)}</span>`, ev.clientX, ev.clientY));
      hit.addEventListener('pointerleave', hideTip);
    });
    if (ref != null) svgEl('line', { x1: pl, x2: w - pr, y1: Y(ref), y2: Y(ref), class: 'ref' }, s);
    growIn(s);
    return s;
  };

  /* Redesenho dos gráficos (largura real do contêiner, sem distorcer textos) */
  const draws = [];
  const draw = fn => { draws.push(fn); fn(); };
  const redraw = () => draws.forEach(fn => fn());
  let lastW = innerWidth, rT;
  addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rT); rT = setTimeout(redraw, 150); });

  /* Abas acessíveis (setas, Home, End) */
  const tabs = (list, onChange) => {
    const ts = $$('[role=tab]', list);
    const select = (t, focus) => {
      ts.forEach(x => {
        const on = x === t;
        x.setAttribute('aria-selected', String(on));
        x.tabIndex = on ? 0 : -1;
        const p = $id(x.getAttribute('aria-controls'));
        if (p) { p.hidden = !on; if (on && !reduce) { p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); } }
      });
      if (focus) t.focus();
      redraw();
      onChange && onChange(t);
    };
    ts.forEach((t, i) => {
      t.addEventListener('click', () => select(t));
      t.addEventListener('keydown', e => {
        let j = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') j = (i + 1) % ts.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') j = (i - 1 + ts.length) % ts.length;
        if (e.key === 'Home') j = 0;
        if (e.key === 'End') j = ts.length - 1;
        if (j !== null) { e.preventDefault(); select(ts[j], true); }
      });
    });
    return select;
  };

  const setVerdict = (el, cls, ic, msg) => {
    const changed = el.dataset.msg !== msg;
    el.dataset.msg = msg;
    el.className = 'verdict ' + cls;
    el.innerHTML = `${icon(ic)}<span></span>`;
    el.querySelector('span').textContent = msg;
    if (changed && !reduce) { void el.offsetWidth; el.classList.add('swap'); }
  };

  if (!D) return;

  /* =========================================================
     HERO · centro de inteligência
     ========================================================= */
  const exec = D.gastos.filter(g => !g.projetado);
  const totExec = exec.reduce((s, g) => s + g.total, 0);
  const saldoTot = D.contratos.reduce((s, c) => s + c.saldo, 0);
  const emRisco = D.contratos.filter(c => c.projetado < 0).length;
  const pagas = D.contas.filter(c => c.etapa === 'Pago');
  const pctPrazo = Math.round(pagas.filter(c => c.pagoNoPrazo).length / pagas.length * 100);
  const mediaMes = totExec / exec.length;
  const kpiTargets = { exec: [totExec, compact], saldo: [saldoTot, compact], risco: [emRisco, v => int.format(v)], prazo: [pctPrazo, v => int.format(v) + '%'] };
  $$('[data-count]').forEach(el => { const [v, f] = kpiTargets[el.dataset.count]; countUp(el, v, f); });
  $id('h-exec-d').textContent = `média ${compact(mediaMes)}/mês`;
  $id('h-saldo-d').textContent = `${D.contratos.length} contratos`;

  draw(() => lineChart($id('h-line'), {
    labels: D.MESES, values: D.gastos.map(g => g.total), projFrom: 10, h: 150,
    label: 'Linha de despesas mensais fictícias de janeiro a dezembro, com novembro e dezembro projetados'
  }));
  const catTot = D.categorias.map(c => ({ n: c.nome, curto: c.curto, v: exec.reduce((s, g) => s + g[c.id], 0) }));
  donut($id('h-donut'), catTot.map(c => ({ ...c, n: c.curto })), { label: 'Distribuição das despesas fictícias por categoria', center: [compact(totExec).replace('R$ ', ''), 'no ano'] });
  hbars($id('h-proj'), [...D.contratos].sort((a, b) => a.projetado - b.projetado).slice(0, 5).map(c => ({ n: c.id, v: c.projetado, extra: c.objeto })), { label: 'Saldo projetado por contrato fictício' });

  // alertas com "tempo real" simulado
  const alertPool = [
    ...D.contratos.filter(c => c.projetado < 0).map(c => ({ c: 'bad', t: `${c.id} · saldo pode acabar antes do fim da vigência` })),
    ...D.contratos.filter(c => c.diasFim <= 120 && c.diasFim >= 0).map(c => ({ c: 'warn', t: `${c.id} · vigência termina em ${c.diasFim} dias` })),
    ...D.contas.filter(c => c.situacao === 'proxima').slice(0, 4).map(c => ({ c: 'warn', t: `${c.favorecido} · vence em ${c.dias} dia${c.dias === 1 ? '' : 's'}` })),
    { c: 'ok', t: 'Lançamentos de outubro conferidos' },
    { c: 'info', t: 'Justificativas sincronizadas com a base' },
    { c: 'bad', t: 'AG-01 · consumo 45% acima da referência' },
    { c: 'ok', t: 'Relatório semanal gerado em PDF' }
  ];
  const alertsEl = $id('h-alerts');
  let ai = 0;
  const pushAlert = first => {
    const a = alertPool[ai++ % alertPool.length];
    const li = document.createElement('li');
    li.className = 'a-' + a.c + (first ? '' : ' new');
    const ic = a.c === 'ok' ? 'i-check' : a.c === 'info' ? 'i-sync' : a.c === 'bad' ? 'i-alert' : 'i-info';
    li.innerHTML = `${icon(ic)}<span>${esc(a.t)}</span>`;
    alertsEl.prepend(li);
    while (alertsEl.children.length > 3) alertsEl.lastElementChild.remove();
  };
  for (let i = 0; i < 3; i++) pushAlert(true);
  if (!reduce) {
    let timer = null;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting && !timer) timer = setInterval(() => { if (!document.hidden) pushAlert(false); }, 3600);
        else if (!e.isIntersecting && timer) { clearInterval(timer); timer = null; }
      });
    });
    io.observe(alertsEl);
  }

  /* minigráficos da seção Atuação */
  $$('[data-spark]').forEach(el => {
    const v = el.dataset.spark.split(',').map(Number), w = 160, h = 34, max = Math.max(...v) * 1.1;
    const s = mkSvg(el, w, h, 'Minigráfico de consumo fictício');
    const pts = v.map((y, i) => `${(i / (v.length - 1) * (w - 6) + 3).toFixed(1)},${(h - 3 - y / max * (h - 6)).toFixed(1)}`);
    svgEl('polyline', { points: pts.join(' '), class: 'line' }, s);
    const peak = v.indexOf(Math.max(...v));
    const [px, py] = pts[peak].split(',');
    svgEl('circle', { cx: px, cy: py, r: 3.5, class: 'endpt endpt--warn' }, s);
  });

  /* =========================================================
     CASE · Camada 1, fonte única
     ========================================================= */
  const fmtFim = iso => new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '').replace(' de ', '/');
  $id('ssot-cad').innerHTML = D.contratos.slice(0, 5).map(c => `<tr data-id="${c.id}"><td class="mono">${c.id}</td><td>${esc(c.objeto)}</td><td class="mono">${fmtFim(c.fim)}</td></tr>`).join('');
  const sel = $id('ssot-sel');
  sel.innerHTML = D.contratos.slice(0, 5).map(c => `<option value="${c.id}">${c.id}</option>`).join('');
  const ssot = () => {
    const c = D.contratos.find(x => x.id === sel.value);
    $$('#ssot-cad tr').forEach(tr => tr.classList.toggle('hit', tr.dataset.id === c.id));
    $id('ssot-out').innerHTML = [
      ['Objeto', c.objeto], ['Tipo', c.tipo], ['Fim da vigência', new Date(c.fim + 'T00:00:00').toLocaleDateString('pt-BR')],
      ['Empenho + aditivos', money(c.empenho + c.aditivos)], ['Saldo atual', money(c.saldo)]
    ].map(([k, v]) => `<div><dt>${k}</dt><dd class="mono">${esc(v)}</dd></div>`).join('');
    const out = $id('ssot-out');
    if (!reduce) { out.classList.remove('flash'); void out.offsetWidth; out.classList.add('flash'); }
  };
  sel.addEventListener('change', ssot);
  ssot();

  /* =========================================================
     CASE · Camada 2, módulos de painéis
     ========================================================= */
  const modview = $id('modview');
  const abertas = D.contas.filter(c => c.etapa !== 'Pago');
  const modules = {
    exec: () => {
      modview.innerHTML = `<p class="mono lbl">Painel executivo</p>
        <div class="kpis3 kpis3--tight">
          <div class="kpi"><span>Gastos do ano</span><strong class="mono">${compact(totExec)}</strong></div>
          <div class="kpi"><span>Saldos disponíveis</span><strong class="mono">${compact(saldoTot)}</strong></div>
          <div class="kpi"><span>Contas vencidas</span><strong class="mono">${D.contas.filter(c => c.situacao === 'vencida').length}</strong></div>
        </div>
        <p class="mono lbl">Lista de prioridades</p>
        <ul class="plist">${[...D.contratos].sort((a, b) => a.projetado - b.projetado).slice(0, 3).map(c => `<li>${chip(c.situacao, c.situacao === 'bad' ? 'Risco' : c.situacao === 'warn' ? 'Renovar' : 'Regular')}<b class="mono">${c.id}</b><span>${esc(c.objeto)}</span></li>`).join('')}</ul>`;
    },
    gastos: () => {
      modview.innerHTML = `<p class="mono lbl">Análise de gastos · mensal por categoria</p><div class="chart" id="mv-chart"></div>`;
      columns($id('mv-chart'), exec.map(g => ({ n: g.mes, v: g.total, tip: `<b>${g.mes}</b>${D.categorias.map(c => `<span>${esc(c.nome)}: ${compact(g[c.id])}</span>`).join('')}` })), { label: 'Gastos mensais fictícios', h: 170, fmt: (v, ax) => ax ? compact(v).replace('R$ ', '') : compact(v) });
    },
    contratual: () => {
      const w = [30, 60, 90].map(d => ({ d, n: D.contratos.filter(c => c.diasFim >= 0 && c.diasFim <= d).length }));
      modview.innerHTML = `<p class="mono lbl">Inteligência contratual · renovações</p>
        <div class="windows">${w.map(x => `<div><span class="mono">${x.d} dias</span><strong class="mono">${x.n}</strong><small>contrato(s)</small></div>`).join('')}</div>
        <p class="mono lbl">Vigências</p>
        <ul class="plist">${[...D.contratos].sort((a, b) => a.diasFim - b.diasFim).slice(0, 4).map(c => `<li><b class="mono">${c.id}</b><span>${esc(c.objeto)}</span><em class="mono">${c.diasFim} d</em></li>`).join('')}</ul>`;
    },
    risco: () => {
      modview.innerHTML = `<p class="mono lbl">Risco financeiro · saldo projetado até o encerramento</p><div id="mv-chart"></div>`;
      hbars($id('mv-chart'), [...D.contratos].sort((a, b) => a.projetado - b.projetado).map(c => {
        const meses = c.media > 0 ? Math.floor(c.saldo / c.media) : 0;
        return { n: c.id, v: c.projetado, extra: c.projetado < 0 ? `saldo cobre ~${meses} de ${c.mesesRestantes} meses` : 'cobre a vigência' };
      }), { label: 'Saldo projetado por contrato fictício' });
    },
    atrasos: () => {
      const v = D.contas.filter(c => c.situacao === 'vencida'), p = D.contas.filter(c => c.situacao === 'proxima');
      modview.innerHTML = `<p class="mono lbl">Gestão de atrasos</p>
        <div class="kpis3 kpis3--tight">
          <div class="kpi bad"><span>Vencidas</span><strong class="mono">${v.length}</strong></div>
          <div class="kpi warn"><span>Vencem em 7 dias</span><strong class="mono">${p.length}</strong></div>
          <div class="kpi"><span>Pagas no prazo</span><strong class="mono">${pctPrazo}%</strong></div>
        </div>
        <p class="mono lbl">Etapa em que estão paradas</p>
        <ul class="plist">${['Protocolo', 'Conferência', 'Contabilidade'].map(e => `<li><b class="mono">${abertas.filter(c => c.etapa === e).length}</b><span>${e}</span></li>`).join('')}</ul>`;
    },
    auditoria: () => {
      const items = [
        ['bad', 'Valor divergente', 'CT-052 · 1º TA'], ['bad', 'Protocolo divergente', 'CT-058 · 3º TA'],
        ['warn', 'Dado faltante', 'Unidade Norte · taxas'], ['warn', 'Registro incompleto', 'Unidade Oeste · IPTU'], ['warn', 'Hodômetro regressivo', 'VEI-03 · 19/10']
      ];
      modview.innerHTML = `<p class="mono lbl">Auditoria e conferência · pendências</p>
        <ul class="plist">${items.map(([c, t, w]) => `<li>${chip(c, t)}<span>${esc(w)}</span><a class="mono golink" href="#analises">corrigir →</a></li>`).join('')}</ul>
        <p class="muted small">Na ferramenta real, cada linha leva direto à célula a corrigir.</p>`;
    },
    relatorios: () => {
      modview.innerHTML = `<p class="mono lbl">Relatórios gerenciais</p>
        <ul class="reports">${['Relatório semanal', 'Relatório mensal', 'Relatório de protocolos', 'Relatório anual de gastos', 'Comparação entre anos', 'Ocorrências resolvidas'].map(r => `<li>${icon('i-file')}<span>${r}</span></li>`).join('')}</ul>`;
    }
  };
  let curMod = 'exec';
  $$('.mod').forEach(b => b.addEventListener('click', () => {
    $$('.mod').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    curMod = b.dataset.mod;
    modules[curMod]();
    if (!reduce) { modview.classList.remove('enter'); void modview.offsetWidth; modview.classList.add('enter'); }
  }));
  draw(() => modules[curMod]());

  /* =========================================================
     CASE · Camada 3, aplicação web (tabela, filtros, justificativas, sincronização)
     ========================================================= */
  const names = { all: 'Todos', ok: 'Regular', warn: 'Renovar', bad: 'Insuficiência' };
  const tbody = $('#contratos tbody');
  tbody.innerHTML = D.contratos.map(c => `<tr data-s="${c.situacao}" data-id="${c.id}">
      <td><b class="mono">${c.id}</b> ${esc(c.objeto)}</td>
      <td class="mono">${new Date(c.fim + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/\./g, '').replace(/ de /g, ' ')}</td>
      <td class="mono r ${c.projetado < 0 ? 'bad-t' : ''}">${money(c.projetado)}</td>
      <td>${chip(c.situacao, names[c.situacao])}</td>
      <td>${c.situacao !== 'ok' ? `<button type="button" class="linkbtn" data-just="${c.id}">Justificar</button>` : ''}</td></tr>`).join('');
  const rows = $$('tr', tbody), fbtns = $$('.fbtn');
  fbtns.forEach(b => { const f = b.dataset.f; b.textContent = `${names[f]} (${f === 'all' ? rows.length : rows.filter(r => r.dataset.s === f).length})`; });
  const applyF = f => {
    let n = 0;
    rows.forEach(r => {
      const show = f === 'all' || r.dataset.s === f;
      r.classList.toggle('is-off', !show);
      r.classList.remove('row-in');
      if (show) { r.style.setProperty('--i', n++); void r.offsetWidth; if (!reduce) r.classList.add('row-in'); }
    });
    fbtns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    $id('tstatus').textContent = `Mostrando ${n} de ${rows.length} contratos` + (f === 'all' ? '.' : ` (filtro: ${names[f]}).`);
  };
  fbtns.forEach(b => b.addEventListener('click', () => applyF(b.dataset.f)));
  applyF('all');

  const form = $id('just'), pending = [];
  let justCt = null;
  tbody.addEventListener('click', e => {
    const b = e.target.closest('[data-just]');
    if (!b) return;
    justCt = b.dataset.just;
    $id('just-ct').textContent = justCt;
    form.hidden = false;
    $id('just-prov').focus();
  });
  $id('just-cancel').addEventListener('click', () => { form.hidden = true; form.reset(); });
  const syncN = $id('sync-n'), log = $id('synclog');
  form.addEventListener('submit', e => {
    e.preventDefault();
    pending.push({ ct: justCt, prov: $id('just-prov').value.trim(), resp: $id('just-resp').value.trim() });
    form.reset(); form.hidden = true;
    syncN.textContent = pending.length;
    const tr = rows.find(r => r.dataset.id === justCt);
    const btn = tr && $('[data-just]', tr);
    if (btn) { btn.outerHTML = '<span class="chip info">Justificado</span>'; }
    toast('Justificativa registrada na aplicação');
  });
  $id('sync-btn').addEventListener('click', () => {
    const btn = $id('sync-btn');
    if (!pending.length) { toast('Nada pendente para sincronizar'); return; }
    btn.disabled = true; btn.classList.add('spin');
    setTimeout(() => {
      const hora = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      pending.splice(0).forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `${icon('i-check')}<span>${hora} · ${esc(p.ct)} → base operacional · “${esc(p.prov)}” (${esc(p.resp)})</span>`;
        log.prepend(li);
      });
      syncN.textContent = 0;
      btn.disabled = false; btn.classList.remove('spin');
      toast('Justificativas sincronizadas com a planilha');
    }, reduce ? 50 : 900);
  });
  $id('app-print').addEventListener('click', () => {
    document.body.classList.add('print-app');
    const done = () => { document.body.classList.remove('print-app'); removeEventListener('afterprint', done); };
    addEventListener('afterprint', done);
    window.print();
    setTimeout(done, 1500);
  });

  tabs($('.layers'));

  /* =========================================================
     ESCALA (calculada da base fictícia)
     ========================================================= */
  const totAno = D.gastos.reduce((s, g) => s + g.total, 0);
  const scaleItems = [
    [D.contratos.length, 'contratos de serviços e obras', v => int.format(v)],
    [D.imoveis.length, 'imóveis próprios e locados', v => int.format(v)],
    [D.estacionamentos.length, 'contratos de estacionamento', v => int.format(v)],
    [D.medidores.length, 'medidores de água e energia', v => int.format(v)],
    [D.contratos.reduce((s, c) => s + c.valor, 0), 'valor total dos contratos', compact],
    [saldoTot, 'saldo disponível nos contratos', compact],
    [totExec, 'executado de jan a out', compact],
    [mediaMes, 'média mensal de gastos', compact],
    [D.contas.length, 'contas acompanhadas por vencimento', v => int.format(v)],
    [7, 'módulos de painéis gerenciais', v => int.format(v)]
  ];
  const scale = $id('scale');
  scale.innerHTML = scaleItems.map(([v, l], i) => `<div class="scale__item"><strong class="mono" data-si="${i}">${scaleItems[i][2](v)}</strong><span>${l}</span></div>`).join('') +
    `<p class="scale__note mono">Base fictícia · ${totAno > 0 ? 'projeção anual ' + compact(totAno) : ''} · referência ${D.HOJE.toLocaleDateString('pt-BR')}</p>`;
  revealOnce($$('[data-si]', scale), el => { const [v, , f] = scaleItems[+el.dataset.si]; countUp(el, v, f); });

  const catSorted = [...catTot].sort((a, b) => b.v - a.v);
  hbars($id('s-cat'), catSorted.map(c => ({ n: c.n, v: c.v, extra: num.format(c.v / totExec * 100) + '% do total' })), { label: 'Despesas fictícias por categoria' });
  const sit = [['vencida', 'Vencidas', 'neg'], ['proxima', 'Vencem em 7 dias', 'warn'], ['emdia', 'Em dia', 'pos'], ['pago', 'Pagas', 'muted']];
  hbars($id('s-contas'), sit.map(([k, n, cls]) => ({ n, v: D.contas.filter(c => c.situacao === k).length, cls })), { label: 'Contas fictícias por situação', fmt: v => int.format(v) });

  /* =========================================================
     ANÁLISES · abas
     ========================================================= */
  tabs($('.qtabs'));

  /* Q1 · simulador de saldo + gráfico mês a mês */
  const saldoBox = $id('saldo');
  const defaults = { emp: 240000, adit: 20000, lanc: 150000, med: 18500, comp: 6 };
  const fillRange = r => r.style.setProperty('--p', ((r.value - r.min) / (r.max - r.min) * 100) + '%');
  const calcSaldo = () => {
    const v = k => +$id(k).value;
    const emp = v('emp'), adit = v('adit'), lanc = v('lanc'), med = v('med'), comp = v('comp');
    $$('input[type=range]', saldoBox).forEach(fillRange);
    $id('emp-o').textContent = brl.format(emp); $id('adit-o').textContent = brl.format(adit); $id('lanc-o').textContent = brl.format(lanc);
    $id('med-o').textContent = brl.format(med); $id('comp-o').textContent = comp + (comp === 1 ? ' mês' : ' meses');
    const total = emp + adit, atual = total - lanc, prev = med * comp, proj = atual - prev;
    tween($id('k-atual'), atual, money);
    tween($id('k-prev'), prev, money);
    tween($id('k-proj'), proj, money);
    $id('kp').className = 'kpi ' + (proj < 0 ? 'bad' : proj < med ? 'warn' : 'ok');
    // série mensal
    const hoje = D.HOJE, labels = ['hoje'], vals = [atual];
    for (let i = 1; i <= comp; i++) { const d = new Date(hoje); d.setMonth(d.getMonth() + i); labels.push(D.MESES[d.getMonth()]); vals.push(atual - med * i); }
    const w = W($id('saldo-chart')), h = 170;
    const s = mkSvg($id('saldo-chart'), w, h, 'Saldo projetado mês a mês');
    const pl = 52, pr = 10, pt = 10, pb = 24;
    const mx = Math.max(...vals.map(Math.abs), 1);
    const maxV = niceMax(Math.max(...vals, 0) * 1.1 || 1), minV = Math.min(...vals, 0) < 0 ? -niceMax(-Math.min(...vals) * 1.1) : 0;
    const Y = x => pt + (maxV - x) / (maxV - minV) * (h - pt - pb);
    const g = svgEl('g', { class: 'axis' }, s);
    [maxV, 0, minV].filter((x, i, a) => a.indexOf(x) === i && (x === 0 || Math.abs(Y(x) - Y(0)) > 16)).forEach(t => {
      svgEl('line', { x1: pl, x2: w - pr, y1: Y(t), y2: Y(t), class: t === 0 ? 'zero' : 'grid' }, g);
      svgEl('text', { x: pl - 8, y: Y(t) + 3, 'text-anchor': 'end' }, g).textContent = compact(t).replace('R$ ', '');
    });
    const slot = (w - pl - pr) / vals.length;
    let fim = -1;
    vals.forEach((val, i) => {
      if (val < 0 && fim < 0) fim = i;
      const x = pl + i * slot + slot * 0.2, bw = slot * 0.6;
      const y0 = Y(0), y1 = Y(val);
      const d = val >= 0 ? roundedTopRect(x, y1, bw, y0 - y1) : `M${x},${y0}V${y1 - 3}Q${x},${y1} ${x + 3},${y1}H${x + bw - 3}Q${x + bw},${y1} ${x + bw},${y1 - 3}V${y0}Z`;
      svgEl('path', { d, class: 'bar ' + (val < 0 ? 'bar--bad' : i === 0 ? 'bar--now' : val < med ? 'bar--warn' : '') }, s);
      svgEl('text', { x: pl + i * slot + slot / 2, y: h - 6, 'text-anchor': 'middle' }, g).textContent = labels[i];
      const hit = svgEl('rect', { x: pl + i * slot, y: pt, width: slot, height: h - pt - pb, fill: 'transparent' }, s);
      hit.addEventListener('pointermove', ev => showTip(`<b>${labels[i]}</b><span>${money(val)}</span>${val < 0 ? '<em>insuficiência</em>' : ''}`, ev.clientX, ev.clientY));
      hit.addEventListener('pointerleave', hideTip);
    });
    void mx;
    const vd = $id('verdict');
    if (atual < 0) setVerdict(vd, 'bad', 'i-alert', `Os pagamentos já passaram do empenho em ${money(-atual)}. Confira se há aditivo ou reforço de empenho não registrado.`);
    else if (proj < 0) setVerdict(vd, 'bad', 'i-alert', `Risco de insuficiência: faltam ${money(-proj)}. O saldo deve acabar em ${labels[fim]}, cobrindo cerca de ${med > 0 ? Math.floor(atual / med) : 0} dos ${comp} meses restantes. Hora de sinalizar reforço ou aditivo.`);
    else if (proj < med) setVerdict(vd, 'warn', 'i-info', `Cobre, mas no limite: sobram ${money(proj)}, menos de uma média mensal.`);
    else setVerdict(vd, 'ok', 'i-check', `Saldo suficiente: depois dos ${comp} meses restantes ainda sobram ${money(proj)}.`);
  };
  $$('input[type=range]', saldoBox).forEach(i => i.addEventListener('input', calcSaldo));
  $id('saldo-reset').addEventListener('click', () => { Object.entries(defaults).forEach(([k, val]) => { $id(k).value = val; }); calcSaldo(); toast('Valores restaurados'); });
  draw(calcSaldo);

  /* Radar de renovação (janela de 120 dias) */
  const dt = $id('termino');
  if (!dt.value) { const d = new Date(); d.setDate(d.getDate() + 95); dt.value = d.toISOString().slice(0, 10); }
  const calcRadar = () => {
    const out = $id('radar'), ch = $id('radar-chip');
    if (!dt.value) { ch.className = 'chip'; ch.textContent = '—'; $id('radar-dias').textContent = '—'; setVerdict(out, '', 'i-info', 'Escolha uma data para ver a situação do contrato.'); return; }
    const hoje = new Date(); hoje.setHours(0, 0, 0, 0);
    const dias = Math.round((new Date(dt.value + 'T00:00:00') - hoje) / 86400000);
    $id('radar-lab').textContent = dias < 0 ? 'Passaram' : 'Faltam';
    $id('radar-dias').textContent = Math.abs(dias) + (Math.abs(dias) === 1 ? ' dia' : ' dias');
    if (dias < 0) { ch.className = 'chip bad'; ch.textContent = 'Encerrada'; setVerdict(out, 'bad', 'i-alert', `A vigência terminou há ${-dias} dias. Verifique se há termo aditivo ou nova contratação em andamento.`); }
    else if (dias <= 120) { ch.className = 'chip warn'; ch.textContent = 'Renovar'; setVerdict(out, 'warn', 'i-info', `Dentro da janela de 120 dias: faltam ${dias} dias para o término.`); }
    else { ch.className = 'chip ok'; ch.textContent = 'Regular'; setVerdict(out, 'ok', 'i-check', `Fora da janela: a renovação passa a ser sinalizada em ${dias - 120} dias.`); }
  };
  dt.addEventListener('input', calcRadar);
  calcRadar();

  /* Q2 · atrasos */
  const funnel = $id('funnel');
  const etapasAbertas = ['Protocolo', 'Conferência', 'Contabilidade'];
  const maxE = Math.max(...etapasAbertas.map(e => abertas.filter(c => c.etapa === e).length), 1);
  funnel.innerHTML = etapasAbertas.map(e => {
    const arr = abertas.filter(c => c.etapa === e), venc = arr.filter(c => c.dias < 0).length;
    return `<div class="funnel__row" tabindex="0" data-tip="${e}|${arr.length} conta(s) em aberto|${venc} vencida(s)"><span>${e}</span><span class="track"><i class="pos" style="--w:${arr.length / maxE * 100}%"></i><i class="neg" style="--w:${venc / maxE * 100}%"></i></span><b class="mono">${arr.length}</b></div>`;
  }).join('') + '<ul class="legend mono"><li><i class="sw sw--cur"></i>Em aberto</li><li><i class="sw sw--bad"></i>Das quais vencidas</li></ul>';
  bindTips(funnel);
  $id('a-prazo').textContent = pctPrazo + '%';
  $id('a-venc').textContent = D.contas.filter(c => c.situacao === 'vencida').length;
  $id('a-tempo').textContent = num.format(abertas.reduce((s, c) => s + c.diasNaEtapa, 0) / abertas.length) + ' d';
  const aBody = $id('a-body'), aV = $id('a-verdict');
  const etapaChip = c => chip(c.etapa === 'Pago' ? 'ok' : c.dias < 0 ? 'bad' : 'info', c.etapa);
  const applyA = f => {
    const list = D.contas.filter(c => c.situacao === f).sort((a, b) => a.dias - b.dias);
    $$('.fbtn2').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
    aBody.innerHTML = list.map(c => `<tr><td class="mono">${c.id}</td><td>${esc(c.favorecido)}</td><td class="mono">${dateBR(c.venc)}${c.situacao === 'vencida' ? ` <span class="bad-t">(${-c.dias} d)</span>` : ''}</td><td>${etapaChip(c)}</td><td class="mono r">${money(c.valor)}</td></tr>`).join('') || '<tr><td colspan="5" class="muted">Nenhuma conta nesta situação.</td></tr>';
    const msgs = {
      vencida: () => { const e = etapasAbertas.map(x => [x, list.filter(c => c.etapa === x).length]).sort((a, b) => b[1] - a[1])[0]; return ['bad', 'i-alert', `${list.length} conta(s) vencida(s) em aberto. A maior parte está parada em ${e[0]}: é por onde começar as providências.`]; },
      proxima: () => ['warn', 'i-info', `${list.length} conta(s) vencem nos próximos 7 dias. Priorize as que ainda estão em Protocolo.`],
      emdia: () => ['ok', 'i-check', `${list.length} conta(s) dentro do prazo e em tramitação.`],
      pago: () => ['ok', 'i-check', `${list.length} conta(s) pagas; ${pctPrazo}% delas dentro do prazo.`]
    };
    setVerdict(aV, ...msgs[f]());
  };
  $$('.fbtn2').forEach(b => {
    b.textContent += ` (${D.contas.filter(c => c.situacao === b.dataset.f).length})`;
    b.addEventListener('click', () => applyA(b.dataset.f));
  });
  applyA('vencida');

  /* Q3 · consumo */
  const cMed = $id('c-med'), cLim = $id('c-lim');
  cMed.innerHTML = D.medidores.map((m, i) => `<option value="${i}">${esc(m.nome)}</option>`).join('');
  const calcCons = () => {
    const m = D.medidores[+cMed.value], lim = +cLim.value;
    fillRange(cLim);
    $id('c-lim-o').textContent = '+' + lim + '%';
    $id('c-cap').textContent = `Consumo mensal em ${m.unidade} · ano corrente × ano anterior`;
    const flags = [];
    const items = D.MESES.map((n, i) => {
      const r = m.anterior[i], v = m.atual[i];
      if (v == null) return { n, r, v: null, tip: `<b>${n}</b><span>Ano anterior: ${int.format(r)} ${m.unidade}</span><em>sem leitura no ano corrente</em>` };
      const varp = (v - r) / r * 100;
      let cls = 'bar--cur';
      if (varp > lim) { cls = 'bar--warn'; flags.push(`${n} (+${int.format(varp)}%)`); }
      else if (v < r / 2) { cls = 'bar--bad'; flags.push(`${n} (${int.format(varp)}%)`); }
      return { n, r, v, cls, tip: `<b>${n}</b><span>Atual: ${int.format(v)} ${m.unidade}</span><span>Anterior: ${int.format(r)} ${m.unidade}</span><em>${varp > 0 ? '+' : ''}${int.format(varp)}%</em>` };
    });
    columns($id('c-chart'), items, { label: `Consumo mensal do medidor ${m.nome}, fictício`, h: 220, fmt: v => int.format(v) });
    const cv = $id('c-verdict');
    if (flags.length) setVerdict(cv, 'warn', 'i-alert', `${flags.length} mês(es) para verificar: ${flags.join(', ')}. Um alerta indica onde conferir a leitura ou o lançamento; não conclui irregularidade.`);
    else setVerdict(cv, 'ok', 'i-check', 'Nenhuma variação fora das regras de acompanhamento com este limite.');
  };
  cMed.addEventListener('change', calcCons);
  cLim.addEventListener('input', calcCons);
  draw(calcCons);

  /* Q4 · aditivos */
  const statusAd = a => {
    const temReg = a.registro != null && a.registro !== '' && !isNaN(a.registro);
    const temProt = !!(a.protocolo && String(a.protocolo).trim());
    if (!temReg && temProt) return ['bad', 'Sem registro'];
    if (temReg && !temProt) return ['warn', 'Valor sem protocolo'];
    if (!temReg && !temProt) return ['bad', 'Sem registro'];
    if (a.protocoloEsperado && String(a.protocolo).trim().toUpperCase() !== String(a.protocoloEsperado).trim().toUpperCase()) return ['bad', 'Protocolo divergente'];
    if (a.valorProtocolo != null && Number(a.valorProtocolo) !== Number(a.registro)) return ['bad', 'Valor divergente'];
    return a.pago ? ['ok', 'Concluído'] : ['info', 'Em processamento'];
  };
  $id('ad-body').innerHTML = D.aditivos.map(a => {
    const [c, t] = statusAd(a);
    return `<tr><td class="mono">${a.contrato}</td><td>${a.termo}</td><td class="mono r">${a.registro != null ? money(a.registro) : '<span class="muted">vazio</span>'}</td><td class="mono">${a.protocolo || '<span class="muted">vazio</span>'}${a.protocoloEsperado && a.protocolo !== a.protocoloEsperado ? `<small class="bad-t"> esp. ${a.protocoloEsperado}</small>` : ''}</td><td class="mono r">${a.valorProtocolo != null ? money(a.valorProtocolo) : '—'}</td><td>${chip(c, t)}</td></tr>`;
  }).join('');
  const trial = () => {
    const reg = $id('t-reg').value, vp = $id('t-vp').value;
    const [c, t] = statusAd({ registro: reg === '' ? null : +reg, valorProtocolo: vp === '' ? null : +vp, protocolo: $id('t-p').value, protocoloEsperado: $id('t-pe').value, pago: $id('t-pago').checked });
    const out = $id('t-out'); out.className = 'chip ' + c; out.textContent = t;
  };
  ['t-reg', 't-vp', 't-p', 't-pe', 't-pago'].forEach(id => $id(id).addEventListener('input', trial));
  trial();

  /* Q5 · prioridades */
  const prio = $id('prio');
  const calcPrio = () => {
    const on = new Set($$('#crit input:checked').map(i => i.value));
    const scored = D.contratos.map(c => {
      const parts = [];
      if (on.has('risco') && c.projetado < 0) parts.push([4, 'risco de insuficiência']);
      if (on.has('venc') && c.diasFim <= 120) parts.push([3 * (1 - Math.max(c.diasFim, 0) / 120) + 1, `vigência em ${c.diasFim} d`]);
      if (on.has('pend') && c.pendencias) parts.push([Math.min(c.pendencias, 3) * 0.7, `${c.pendencias} pendência(s)`]);
      if (on.has('atraso') && c.atrasos) parts.push([c.atrasos, `${c.atrasos} atraso(s)`]);
      return { c, score: parts.reduce((s, p) => s + p[0], 0), why: parts.map(p => p[1]) };
    }).sort((a, b) => b.score - a.score);
    // anima a troca de posição (FLIP)
    const before = new Map($$('li', prio).map(li => [li.dataset.id, li.getBoundingClientRect().top]));
    prio.innerHTML = scored.map((s, i) => `<li data-id="${s.c.id}" class="${s.score >= 4 ? 'p-hi' : s.score > 0 ? 'p-md' : 'p-lo'}">
      <span class="pos mono">${String(i + 1).padStart(2, '0')}</span>
      <div><b class="mono">${s.c.id}</b> <span>${esc(s.c.objeto)}</span><small>${s.why.length ? esc(s.why.join(' · ')) : 'sem critérios ativos'}</small></div>
      <span class="score mono" aria-label="Pontuação">${num.format(s.score)}</span></li>`).join('');
    if (!reduce) $$('li', prio).forEach(li => {
      const b = before.get(li.dataset.id);
      if (b == null) return;
      const dy = b - li.getBoundingClientRect().top;
      if (!dy) return;
      li.style.transform = `translateY(${dy}px)`; li.style.transition = 'none';
      requestAnimationFrame(() => { li.style.transition = ''; li.style.transform = ''; });
    });
  };
  $$('#crit input').forEach(i => i.addEventListener('change', calcPrio));
  calcPrio();

  /* =========================================================
     OUTROS SISTEMAS
     ========================================================= */
  tabs($('.ptabs'));

  // Obras: serviço × material
  const ob = { serv: { emp: 210000, adit: 20000, exec: 160000, media: 12800 }, mat: { emp: 70000, adit: 10000, exec: 68000, media: 5800 } };
  const obMeses = 4;
  const calcOb = p => {
    $$('.fbtn3').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.p === p)));
    const parts = p === 'tot' ? ['serv', 'mat'] : [p];
    const items = parts.map(k => { const o = ob[k]; const atual = o.emp + o.adit - o.exec; return { k, atual, proj: atual - o.media * obMeses }; });
    if (p === 'tot') items.push({ k: 'tot', atual: items[0].atual + items[1].atual, proj: items[0].proj + items[1].proj });
    const nm = { serv: 'Serviço', mat: 'Material', tot: 'Somado' };
    hbars($id('ob-chart'), items.flatMap(it => [
      { n: `${nm[it.k]} atual`, v: it.atual, cls: 'muted' },
      { n: `${nm[it.k]} projetado`, v: it.proj }
    ]), { label: 'Saldo atual e projetado por parcela do contrato fictício' });
    const v = $id('ob-verdict');
    if (p === 'tot') setVerdict(v, 'warn', 'i-info', `Somados, os saldos parecem cobrir os ${obMeses} meses restantes. Separados, o material fica negativo: é por isso que o sistema não mistura as duas parcelas.`);
    else if (items[0].proj < 0) setVerdict(v, 'bad', 'i-alert', `${nm[p]}: saldo projetado de ${money(items[0].proj)} até o fim da vigência. Sinalizar reforço desta parcela.`);
    else setVerdict(v, 'ok', 'i-check', `${nm[p]}: saldo cobre os ${obMeses} meses restantes, sobrando ${money(items[0].proj)}. Vigência dentro da janela de renovação de 120 dias.`);
  };
  $$('.fbtn3').forEach(b => b.addEventListener('click', () => calcOb(b.dataset.p)));
  calcOb('serv');

  // Imóveis
  const cell = v => v == null ? '<span class="muted">sem info.</span>' : v === 0 ? '<span class="muted">n/a</span>' : brl.format(v);
  const imSt = { ok: ['ok', 'Em dia'], dados: ['warn', 'Pendência de dados'], lancamento: ['bad', 'Pendência de lançamento'] };
  $id('im-body').innerHTML = D.imoveis.map(i => `<tr><td>${esc(i.nome)}<small class="muted"> ${i.regime}</small></td><td class="mono r">${cell(i.aluguel)}</td><td class="mono r">${cell(i.condominio)}</td><td class="mono r">${cell(i.iptu)}</td><td class="mono r">${cell(i.taxas)}</td><td>${chip(...imSt[i.status])}</td></tr>`).join('');

  // Frota
  const ultimo = {};
  const vistos = new Set();
  $id('fr-body').innerHTML = [...D.abastecimentos].sort((a, b) => a.placa.localeCompare(b.placa) || a.data.localeCompare(b.data)).map(a => {
    const key = [a.placa, a.data, a.litros, a.valor].join('|');
    const prev = ultimo[a.placa];
    let st = ['ok', 'Conferido'], kml = '—';
    if (vistos.has(key)) st = ['bad', 'Possível duplicidade'];
    else if (prev && a.hodometro < prev.hodometro) st = ['warn', 'Hodômetro regressivo'];
    else if (prev) {
      const k = (a.hodometro - prev.hodometro) / a.litros;
      kml = num.format(k);
      if (k < 7 || k > 16) st = ['warn', 'Consumo fora do padrão'];
    }
    vistos.add(key);
    if (st[1] !== 'Possível duplicidade' && st[1] !== 'Hodômetro regressivo') ultimo[a.placa] = a;
    const d = new Date(a.data + 'T00:00:00');
    return `<tr><td class="mono">${a.placa}</td><td class="mono">${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</td><td class="mono r">${num.format(a.litros)}</td><td class="mono r">${int.format(a.hodometro)}</td><td class="mono r">${kml}</td><td>${chip(...st)}</td></tr>`;
  }).join('');

  // Estacionamento
  $id('es-body').innerHTML = D.estacionamentos.map(e => {
    const conf = e.periodicidade === 'mensal' && e.meses;
    return `<tr><td>${esc(e.nome)}</td><td class="mono r">${e.vagas}</td><td class="mono r">${brl.format(e.valorGlobal)}</td><td>${e.periodicidade ? esc(e.periodicidade) : '<span class="warn-t">não confirmada</span>'}</td><td class="mono r">${conf ? brl.format(e.valorGlobal / e.meses) : '—'}</td></tr>`;
  }).join('');

  // Mapa de preços
  const prList = $id('pr-list');
  prList.innerHTML = D.propostas.map((p, i) => `<label class="field price"><span>${esc(p.fonte)}</span><input type="number" min="0" step="1" inputmode="decimal" data-pr="${i}" value="${p.valor ?? ''}" placeholder="incompleta" aria-label="Valor de ${esc(p.fonte)}"></label>`).join('');
  const calcPr = () => {
    const vals = $$('[data-pr]', prList).map(i => i.value.trim() === '' ? null : +i.value).filter(v => v != null && !isNaN(v) && v > 0).sort((a, b) => a - b);
    $$('[data-pr]', prList).forEach(i => i.closest('.price').classList.toggle('is-empty', i.value.trim() === ''));
    const n = vals.length, media = n ? vals.reduce((a, b) => a + b, 0) / n : null;
    const med = n ? (n % 2 ? vals[(n - 1) / 2] : (vals[n / 2 - 1] + vals[n / 2]) / 2) : null;
    const f2 = v => v == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
    $id('pr-media').textContent = f2(media); $id('pr-mediana').textContent = f2(med);
    $id('pr-n').textContent = `${n} de ${D.propostas.length}`;
  };
  prList.addEventListener('input', calcPr);
  calcPr();
})();
