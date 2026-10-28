// Interazioni condivise: menu mobile, copia IP, rivelazione allo scroll, macchina da scrivere, vetrina, tab.

// Menu mobile
const menuBtn = document.querySelector('[data-menu-toggle]');
const header = document.querySelector('.site-header');
menuBtn?.addEventListener('click', () => {
  const open = header.classList.toggle('menu-open');
  menuBtn.setAttribute('aria-expanded', String(open));
});

// Copia IP + toast
const toast = document.getElementById('toast');
let toastTimer;
function showToast(msg) {
  if (!toast) return;
  toast.querySelector('[data-toast-text]').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
async function copy(text) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
    } catch {}
    ta.remove();
  }
  showToast(`${text} copiato!`);
}
document.querySelectorAll('[data-copy]').forEach((b) =>
  b.addEventListener('click', (e) => {
    e.preventDefault();
    copy(b.dataset.copy);
  }),
);

// Rivelazione allo scroll
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      }),
    { threshold: 0.12 },
  );
  reveals.forEach((el) => io.observe(el));
} else reveals.forEach((el) => el.classList.add('in'));

// Macchina da scrivere
document.querySelectorAll('[data-typewriter]').forEach((el) => {
  const lines = JSON.parse(el.dataset.typewriter);
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = lines[0];
    return;
  }
  let li = 0;
  let ci = 0;
  let del = false;
  (function tick() {
    const line = lines[li];
    el.textContent = line.slice(0, ci);
    if (!del && ci === line.length) {
      del = true;
      return setTimeout(tick, 1800);
    }
    if (del && ci === 0) {
      del = false;
      li = (li + 1) % lines.length;
    }
    ci += del ? -1 : 1;
    setTimeout(tick, del ? 25 : 55);
  })();
});

// Vetrina a slide
document.querySelectorAll('[data-showcase]').forEach((root) => {
  const slides = [...root.querySelectorAll('[data-slide]')];
  const dots = root.querySelector('[data-dots]');
  let i = 0;
  let timer;
  slides.forEach((_, n) => {
    const d = document.createElement('button');
    d.className = 'dot';
    d.setAttribute('aria-label', `Slide ${n + 1}`);
    d.addEventListener('click', () => go(n, true));
    dots.appendChild(d);
  });
  function go(n, user) {
    i = (n + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    [...dots.children].forEach((d, k) => d.classList.toggle('active', k === i));
    if (user) restart();
  }
  function restart() {
    clearInterval(timer);
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(i + 1), 5500);
  }
  root.querySelector('[data-prev]')?.addEventListener('click', () => go(i - 1, true));
  root.querySelector('[data-next]')?.addEventListener('click', () => go(i + 1, true));
  root.addEventListener('mouseenter', () => clearInterval(timer));
  root.addEventListener('mouseleave', restart);
  go(0);
  restart();
});

// Tab (le dimensioni)
document.querySelectorAll('[data-tabs]').forEach((root) => {
  const btns = [...root.querySelectorAll('[data-tab]')];
  const panes = [...root.querySelectorAll('[data-pane]')];
  const select = (id) => {
    btns.forEach((b) => b.setAttribute('aria-selected', String(b.dataset.tab === id)));
    panes.forEach((p) => p.classList.toggle('active', p.dataset.pane === id));
    document.documentElement.dataset.realm = id;
  };
  btns.forEach((b) => b.addEventListener('click', () => select(b.dataset.tab)));
  const h = location.hash.slice(1);
  select(btns.some((b) => b.dataset.tab === h) ? h : btns[0].dataset.tab);
});

// Conta numeri (statistiche)
document.querySelectorAll('[data-count]').forEach((el) => {
  const end = Number(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const io = new IntersectionObserver((es) => {
    if (!es[0].isIntersecting) return;
    io.disconnect();
    const t0 = performance.now();
    (function step(t) {
      const p = Math.min(1, (t - t0) / 1200);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suffix;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  });
  io.observe(el);
});
