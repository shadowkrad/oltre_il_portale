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

// Sottosopra: capovolge il paesaggio e intensifica l'atmosfera
const flashEl = document.getElementById('flash');
function setUpside(on) {
  document.documentElement.dataset.upside = on ? '1' : '0';
  try {
    localStorage.setItem('opi-upside', on ? '1' : '0');
  } catch {}
  document.querySelectorAll('[data-upside-toggle]').forEach((b) => b.setAttribute('aria-pressed', String(on)));
  if (flashEl) {
    flashEl.classList.remove('go');
    void flashEl.offsetWidth;
    flashEl.classList.add('go');
  }
}
document.querySelectorAll('[data-upside-toggle]').forEach((b) => {
  b.setAttribute('aria-pressed', String(document.documentElement.dataset.upside === '1'));
  b.addEventListener('click', () => setUpside(document.documentElement.dataset.upside !== '1'));
});
addEventListener('opi-upside', (e) => setUpside(e.detail));
