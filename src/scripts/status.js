// Stato live del server Minecraft: aggiorna ogni elemento con data-bind="..." in tutte le pagine.
const CFG = window.__SITE__;
const TARGET = `${CFG.host}:${CFG.port}`;
const API = [
  { url: `https://api.mcstatus.io/v2/status/java/${TARGET}`, parse: parseMcstatus },
  { url: `https://api.mcsrvstat.us/3/${TARGET}`, parse: parseMcsrvstat },
];
const CACHE_KEY = 'opi-status';

const COLORS = {
  0: '#000000', 1: '#0000aa', 2: '#00aa00', 3: '#00aaaa', 4: '#aa0000', 5: '#aa00aa', 6: '#ffaa00', 7: '#aaaaaa',
  8: '#555555', 9: '#5555ff', a: '#55ff55', b: '#55ffff', c: '#ff5555', d: '#ff55ff', e: '#ffff55', f: '#ffffff',
};

const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

// Converte i codici § del MOTD in span colorati, dopo aver neutralizzato l'HTML in ingresso.
export function motdToHtml(raw) {
  let open = false;
  let out = '';
  for (const part of esc(raw).split(/§([0-9a-fk-or])/i)) {
    if (/^[0-9a-fk-or]$/i.test(part)) {
      const k = part.toLowerCase();
      if (open && (k === 'r' || COLORS[k])) {
        out += '</span>';
        open = false;
      }
      if (COLORS[k]) {
        out += `<span style="color:${COLORS[k]}">`;
        open = true;
      } else if (k === 'l') {
        out += '<span style="font-weight:bold">';
        open = true;
      }
    } else {
      out += part.replace(/\n/g, '<br>');
    }
  }
  return out + (open ? '</span>' : '');
}

function parseMcstatus(d) {
  if (!d.online) return null;
  return {
    players: d.players?.online ?? 0,
    max: d.players?.max ?? 0,
    version: d.version?.name_clean || d.version?.name_raw || CFG.version,
    motd: d.motd?.raw || d.motd?.clean || '',
  };
}

function parseMcsrvstat(d) {
  if (!d.online) return null;
  const raw = d.motd?.raw;
  const clean = d.motd?.clean;
  return {
    players: d.players?.online ?? 0,
    max: d.players?.max ?? 0,
    version: d.version || CFG.version,
    motd: (Array.isArray(raw) ? raw.join('\n') : raw) || (Array.isArray(clean) ? clean.join('\n') : clean) || '',
  };
}

const $$ = (k) => document.querySelectorAll(`[data-bind="${k}"]`);
const setText = (k, v) => $$(k).forEach((el) => (el.textContent = v));

function render(s) {
  const root = document.documentElement;
  if (!s) {
    root.dataset.status = 'offline';
    setText('state', 'OFFLINE');
    setText('players', '0');
    setText('max', '—');
    setText('ping', '--');
    setText('version', `${CFG.edition} ${CFG.version}`);
    setText('note', 'Server in standby: puoi comunque aggiungere l\'IP e connetterti appena torna attivo.');
    $$('motd').forEach((el) => (el.textContent = 'Il portale è chiuso… per ora.'));
    $$('bar').forEach((el) => (el.style.width = '0%'));
    return;
  }
  root.dataset.status = 'online';
  setText('state', 'ONLINE');
  setText('players', s.players);
  setText('max', s.max);
  setText('ping', s.ping);
  setText('version', s.version.replace(/^Minecraft\s+/i, ''));
  setText('note', 'Pronto per la connessione');
  $$('motd').forEach((el) => (el.innerHTML = motdToHtml(s.motd) || 'Benvenuto in Oltre il Portale!'));
  $$('bar').forEach((el) => (el.style.width = `${s.max ? Math.min(100, Math.round((s.players / s.max) * 100)) : 0}%`));
}

let querying = false;
async function refresh() {
  if (querying) return;
  querying = true;
  document.documentElement.dataset.status = 'loading';
  setText('state', 'VERIFICA…');
  const t0 = performance.now();
  let result = null;
  for (const api of API) {
    try {
      const res = await fetch(api.url, { cache: 'no-store' });
      if (!res.ok) throw new Error(res.status);
      result = api.parse(await res.json());
      break;
    } catch (e) {
      console.warn('Status API non disponibile:', api.url, e);
    }
  }
  if (result) result.ping = Math.round(performance.now() - t0);
  render(result);
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), s: result }));
  } catch {}
  querying = false;
}

function init() {
  // Riusa l'ultimo risultato tra una pagina e l'altra per evitare lampeggi e richieste inutili.
  let remaining = CFG.refreshSeconds;
  try {
    const c = JSON.parse(sessionStorage.getItem(CACHE_KEY));
    const age = c ? (Date.now() - c.t) / 1000 : Infinity;
    if (c && age < CFG.refreshSeconds) {
      render(c.s);
      remaining = Math.ceil(CFG.refreshSeconds - age);
    } else refresh();
  } catch {
    refresh();
  }
  setInterval(() => {
    remaining--;
    setText('countdown', `${Math.max(remaining, 0)}s`);
    if (remaining <= 0) {
      remaining = CFG.refreshSeconds;
      refresh();
    }
  }, 1000);
  document.querySelectorAll('[data-refresh]').forEach((b) =>
    b.addEventListener('click', () => {
      remaining = CFG.refreshSeconds;
      refresh();
    }),
  );
}

init();
