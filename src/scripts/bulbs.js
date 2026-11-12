// Muro di lucine: scrive i messaggi accendendo le lettere una alla volta.
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const fold = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim();

async function play(wall, text) {
  const msg = fold(text);
  const caption = wall.querySelector('[data-caption]');
  const cells = new Map([...wall.querySelectorAll('.bw-cell')].map((c) => [c.dataset.ch, c]));
  caption.textContent = '';
  if (reduce) {
    caption.textContent = msg;
    return;
  }
  const gen = (wall._gen = (wall._gen || 0) + 1); // un nuovo messaggio interrompe quello in corso
  wall.dataset.busy = '1';
  for (const ch of msg) {
    if (wall._gen !== gen) return;
    if (ch === ' ') {
      caption.textContent += ' ';
      await sleep(520);
      continue;
    }
    const cell = cells.get(ch);
    if (!cell) continue;
    cell.classList.add('on');
    caption.textContent += ch;
    await sleep(Math.random() < 0.15 ? 260 : 520);
    cell.classList.remove('on');
    await sleep(120);
  }
  if (wall._gen === gen) delete wall.dataset.busy;
}

document.querySelectorAll('[data-bulbwall]').forEach((wall) => {
  const messages = JSON.parse(wall.dataset.messages || '[]');
  let visible = false;
  new IntersectionObserver((es) => (visible = es[0].isIntersecting), { threshold: 0.3 }).observe(wall);

  if (messages.length) {
    (async function loop(i = 0) {
      while (!visible || wall.dataset.busy) await sleep(400);
      await play(wall, messages[i % messages.length]);
      await sleep(2600);
      loop(i + 1);
    })();
  }

  const form = wall.querySelector('[data-bulbform]');
  const status = wall.querySelector('[data-say]');
  const say = (t, ok = true) => {
    if (status) {
      status.textContent = t;
      status.dataset.ok = ok ? '1' : '0';
    }
  };
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = form.elements.msg;
    const text = input.value;
    input.value = '';
    if (!fold(text)) return;
    wall.querySelectorAll('.bw-cell.on').forEach((c) => c.classList.remove('on'));

    // il messaggio viaggia fino alla chat del gioco; se il servizio rifiuta (4xx) il muro non si accende
    say('Il muro ascolta…');
    let res = null;
    try {
      res = await fetch('/api/sussurro', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ msg: text }) });
    } catch {}
    if (res && res.status >= 400 && res.status < 500) {
      const d = await res.json().catch(() => ({}));
      say(d.error ? d.error.charAt(0).toUpperCase() + d.error.slice(1) + '.' : 'Messaggio non accettato.', false);
      return;
    }
    say(res && res.ok ? 'Il messaggio è arrivato nel gioco. 👁' : 'Il gioco non risponde: il messaggio resta solo sul muro.', !!(res && res.ok));

    // un messaggio segreto capovolge il sito
    if (['RUN', 'CORRI', 'SOTTOSOPRA'].includes(fold(text))) {
      setTimeout(() => dispatchEvent(new CustomEvent('opi-upside', { detail: true })), 700);
    }
    await play(wall, text);
  });
});
