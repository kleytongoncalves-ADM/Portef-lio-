function reduceMotion() {
  try { return matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

export function revealElements(elements, { stagger = 70 } = {}) {
  const list = Array.from(elements);
  if (!list.length) return;
  if (reduceMotion() || !('IntersectionObserver' in window)) {
    list.forEach(el => el.classList.add('reveal', 'is-visible'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  list.forEach((el, i) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(i % 6) * stagger}ms`;
    io.observe(el);
  });
}

export function animateMetricValues(container, { duration = 550 } = {}) {
  if (reduceMotion()) return;
  const lang = document.documentElement.lang.startsWith('pt') ? 'pt-BR' : 'en-US';
  const groupChar = lang === 'pt-BR' ? '.' : ',';
  const decChar = lang === 'pt-BR' ? ',' : '.';
  container.querySelectorAll('.metric strong, .metric b').forEach(el => {
    const text = el.textContent;
    const match = text.match(/-?\d[\d.,]*/);
    if (!match) return;
    const numStr = match[0];
    const prefix = text.slice(0, match.index);
    const suffix = text.slice(match.index + numStr.length);
    const normalized = numStr.split(groupChar).join('').replace(decChar, '.');
    const target = parseFloat(normalized);
    if (!Number.isFinite(target)) return;
    const decimals = normalized.includes('.') ? normalized.split('.')[1].length : 0;
    const start = performance.now();
    function tick(now) {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      const current = target * eased;
      el.textContent = prefix + current.toLocaleString(lang, { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = text;
    }
    requestAnimationFrame(tick);
  });
}
