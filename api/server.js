// Servizio «Il muro scrive»: riceve un messaggio dal sito e lo ripete nella chat di gioco via RCON.
// Nessuna dipendenza esterna. Il messaggio e' ridotto a lettere A-Z e spazi (max 24): niente link, niente comandi.
import http from 'node:http';
import net from 'node:net';

const PORT = Number(process.env.PORT || 3000);
const RCON_HOST = process.env.RCON_HOST || '127.0.0.1';
const RCON_PORT = Number(process.env.RCON_PORT || 25575);
const RCON_PASSWORD = process.env.RCON_PASSWORD || '';
const MAX_LEN = 24;
const PER_IP_MS = 30_000; // un messaggio ogni 30 s per persona
const GLOBAL_MAX = 12; // al massimo 12 messaggi al minuto in totale
const GLOBAL_WINDOW_MS = 60_000;

// Filtro minimo. Le radici lunghe e inequivocabili si cercano anche dentro parole spezzate ("m e r d a");
// quelle corte solo come parola intera, per non bloccare "radio", "studio", "nazione".
const BANNED_ROOTS = [
  'MERDA', 'CAZZO', 'PUTTANA', 'VAFFANCULO', 'STRONZ', 'COGLION', 'MINCHIA', 'FROCIO', 'ZOCCOLA',
  'FUCK', 'SHIT', 'BITCH', 'NIGGER', 'FAGGOT', 'CUNT', 'WHORE', 'PUSSY', 'HITLER', 'SUICID', 'STUPR',
];
const BANNED_WORDS = new Set([
  'DIO', 'PORCO', 'MADONNA', 'NAZI', 'NAZISTA', 'NEGRO', 'FIGA', 'CULO', 'TROIA', 'TROIE', 'DICK', 'RAPE', 'BASTARDO', 'BASTARDA',
]);

const fold = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/[^A-Z ]/g, '').replace(/\s+/g, ' ').trim();
const isBanned = (msg) => msg.split(' ').some((w) => BANNED_WORDS.has(w)) || BANNED_ROOTS.some((r) => msg.replace(/ /g, '').includes(r));

const perIp = new Map();
let recent = [];
const clientIp = (req) =>
  req.headers['cf-connecting-ip'] || String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.headers['x-real-ip'] || req.socket.remoteAddress;

// --- Client RCON (protocollo Source) ---
function rcon(command) {
  return new Promise((resolve, reject) => {
    const sock = net.createConnection({ host: RCON_HOST, port: RCON_PORT });
    let buf = Buffer.alloc(0);
    let stage = 'auth';
    const timer = setTimeout(() => done(new Error('timeout')), 5000);
    const send = (id, type, body) => {
      const b = Buffer.from(body, 'utf8');
      const p = Buffer.alloc(14 + b.length);
      p.writeInt32LE(10 + b.length, 0);
      p.writeInt32LE(id, 4);
      p.writeInt32LE(type, 8);
      b.copy(p, 12);
      sock.write(p);
    };
    function done(err, val) {
      clearTimeout(timer);
      sock.destroy();
      err ? reject(err) : resolve(val);
    }
    sock.on('error', done);
    sock.on('connect', () => send(1, 3, RCON_PASSWORD));
    sock.on('data', (d) => {
      buf = Buffer.concat([buf, d]);
      while (buf.length >= 4 && buf.length >= buf.readInt32LE(0) + 4) {
        const len = buf.readInt32LE(0);
        const id = buf.readInt32LE(4);
        const type = buf.readInt32LE(8);
        buf = buf.subarray(len + 4);
        if (stage === 'auth' && type === 2) {
          if (id === -1) return done(new Error('auth'));
          stage = 'cmd';
          send(2, 2, command);
        } else if (stage === 'cmd' && type === 0) {
          return done(null, true);
        }
      }
    });
  });
}

function whisper(msg) {
  // msg contiene solo A-Z e spazi: sicuro da inserire nel JSON.
  const json = JSON.stringify([
    { text: '\u{1F441} ', color: 'dark_red' },
    { text: 'Le luci sul muro scrivono: ', color: 'gray', italic: true },
    { text: msg, color: 'red', bold: true },
  ]);
  return rcon(`tellraw @a ${json}`).then(() => rcon('playsound minecraft:entity.warden.heartbeat master @a'));
}

const send = (res, code, obj) => {
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(obj));
};

http
  .createServer((req, res) => {
    if (req.method === 'GET' && req.url === '/api/health') return send(res, 200, { ok: true });
    if (req.method !== 'POST' || req.url !== '/api/sussurro') return send(res, 404, { error: 'non trovato' });
    if (!RCON_PASSWORD) return send(res, 503, { error: 'servizio non configurato' });

    let body = '';
    req.on('data', (c) => {
      body += c;
      if (body.length > 512) req.destroy();
    });
    req.on('end', async () => {
      let msg;
      try {
        msg = fold(JSON.parse(body).msg ?? '').slice(0, MAX_LEN).trim();
      } catch {
        return send(res, 400, { error: 'richiesta non valida' });
      }
      if (!msg) return send(res, 400, { error: 'scrivi almeno una lettera' });
      if (isBanned(msg)) return send(res, 422, { error: 'queste parole non passano il muro' });

      const now = Date.now();
      const ip = clientIp(req);
      if (now - (perIp.get(ip) || 0) < PER_IP_MS) return send(res, 429, { error: 'troppo presto, aspetta qualche secondo' });
      recent = recent.filter((t) => now - t < GLOBAL_WINDOW_MS);
      if (recent.length >= GLOBAL_MAX) return send(res, 429, { error: 'il muro è affollato, riprova fra poco' });

      try {
        await whisper(msg);
        perIp.set(ip, now);
        recent.push(now);
        console.log(`[sussurro] ${msg}`);
        send(res, 200, { ok: true, msg });
      } catch (e) {
        console.error('[sussurro] RCON non raggiungibile:', e.message);
        send(res, 502, { error: 'il gioco non risponde in questo momento' });
      }
    });
  })
  .listen(PORT, () => console.log(`api in ascolto su :${PORT}`));

// pulizia periodica della mappa degli IP
setInterval(() => {
  const now = Date.now();
  for (const [ip, t] of perIp) if (now - t > PER_IP_MS * 4) perIp.delete(ip);
}, 60_000).unref();
