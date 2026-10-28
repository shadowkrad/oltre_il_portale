// Paesaggio pixel-art animato (giorno/notte) disegnato su un canvas a bassa risoluzione.
const PX = 5; // dimensione di un "pixel" sullo schermo
const B = 5; // dimensione di un blocco del portale, in pixel del canvas

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, t) => a.map((v, i) => Math.round(v + (b[i] - v) * t));
const css = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function noise1d(len, spacing, seed) {
  const r = rng(seed);
  const pts = Array.from({ length: Math.ceil(len / spacing) + 2 }, () => r());
  return Array.from({ length: len }, (_, x) => {
    const i = Math.floor(x / spacing);
    const f = (x / spacing) % 1;
    const s = f * f * (3 - 2 * f);
    return pts[i] * (1 - s) + pts[i + 1] * s;
  });
}

const SKY = {
  day: [hex('#1d1822'), hex('#3a2733'), hex('#6b3a3c')],
  night: [hex('#030106'), hex('#0e0510'), hex('#2a0812')],
};

export function initLandscape(canvas) {
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cols, rows, layers, groundY, portal, trees;
  let night = 0;
  let target = 0;
  const clouds = [];
  const sparks = [];
  const spores = [];
  let flash = 0;

  function build() {
    cols = Math.ceil(innerWidth / PX);
    rows = Math.ceil(innerHeight / PX);
    if (cols < 1 || rows < 1) return;
    canvas.width = cols;
    canvas.height = rows;

    const r = rng(1337);
    const far = noise1d(cols, 34, 11).map((v) => Math.round(rows * (0.5 + v * 0.2)));
    const mid = noise1d(cols, 22, 29).map((v) => Math.round(rows * (0.62 + v * 0.12)));
    groundY = noise1d(cols, 18, 53).map((v) => Math.round(rows * (0.8 + v * 0.05)));

    const px = Math.floor(cols * (cols > 120 ? 0.78 : 0.5));
    const pw = 4 * B;
    const flat = groundY[px];
    for (let x = px - 8; x < px + 8 + pw; x++) if (x >= 0 && x < cols) groundY[x] = flat;
    portal = { x: px, y: flat - 5 * B, w: pw, h: 5 * B };

    trees = [];
    for (let x = 6; x < cols - 6; x += 12 + Math.floor(r() * 20)) {
      if (x > px - 12 && x < px + pw + 12) continue;
      trees.push({ x, h: 5 + Math.floor(r() * 3), seed: Math.floor(r() * 1e6) });
    }

    clouds.length = 0;
    for (let i = 0; i < Math.max(4, cols / 70); i++) {
      clouds.push({ x: r() * cols, y: 6 + r() * rows * 0.25, w: 18 + Math.floor(r() * 24), speed: 0.012 + r() * 0.02, seed: i * 7 });
    }

    spores.length = 0;
    for (let i = 0; i < cols / 2; i++) {
      spores.push({ x: r() * cols, y: r() * rows, vy: 0.012 + r() * 0.05, ph: r() * 6, big: r() < 0.15 });
    }

    layers = [false, true].map((isNight) => ({
      far: paintLand(far, [hex('#3b2c3f'), hex('#33263a')], isNight, 3),
      mid: paintLand(mid, [hex('#2c2a2c'), hex('#262428')], isNight, 5),
      near: paintNear(isNight),
    }));
  }

  function offscreen() {
    const c = document.createElement('canvas');
    c.width = cols;
    c.height = rows;
    return c;
  }

  function tint(color, isNight, amount = 0.62) {
    return isNight ? mix(color, [10, 3, 14], amount) : mix(color, [30, 22, 34], 0.45);
  }

  function paintLand(heights, palette, isNight, seed) {
    const c = offscreen();
    const g = c.getContext('2d');
    const r = rng(seed);
    for (let x = 0; x < cols; x++) {
      for (let y = heights[x]; y < rows; y++) {
        const shade = palette[(x + y + Math.floor(r() * 2)) % palette.length];
        g.fillStyle = css(tint(shade, isNight));
        g.fillRect(x, y, 1, 1);
      }
    }
    return c;
  }

  function paintNear(isNight) {
    const c = offscreen();
    const g = c.getContext('2d');
    const r = rng(77);
    const grass = [hex('#4b5a30'), hex('#424f2a'), hex('#566338')];
    const dirt = [hex('#5a4236'), hex('#4e382e'), hex('#46332b')];
    const stone = [hex('#55555b'), hex('#4b4b51'), hex('#5f5f66')];
    for (let x = 0; x < cols; x++) {
      const top = groundY[x];
      for (let y = top; y < rows; y++) {
        const d = y - top;
        let pal = d < 2 ? grass : d < 9 ? dirt : stone;
        let col = pal[Math.floor(r() * pal.length)];
        if (d === 0) col = mix(col, [255, 255, 255], 0.08);
        g.fillStyle = css(tint(col, isNight, 0.55));
        g.fillRect(x, y, 1, 1);
      }
    }
    // alberi secchi e spogli
    for (const t of trees) {
      const tr = rng(t.seed);
      const base = groundY[t.x];
      g.fillStyle = css(tint(hex('#3b2a26'), isNight, 0.5));
      g.fillRect(t.x, base - t.h - 3, 2, t.h + 3);
      for (const dir of [-1, 1]) {
        let bx = t.x + (dir < 0 ? 0 : 1);
        let by = base - t.h - 1 - Math.floor(tr() * 3);
        const len = 3 + Math.floor(tr() * 4);
        for (let i = 0; i < len; i++) {
          bx += dir;
          if (i % 2 === 0) by -= 1;
          g.fillRect(bx, by, 1, 1);
          if (i === len - 1 && tr() > 0.4) g.fillRect(bx, by - 1, 1, 1);
        }
      }
    }
    // cornice di ossidiana
    const ob = tint(hex('#14090f'), isNight, 0.2);
    const ob2 = tint(hex('#241018'), isNight, 0.2);
    g.fillStyle = css(ob);
    const { x, y, w, h } = portal;
    const blocks = [];
    for (let i = 0; i < 4; i++) {
      blocks.push([i, 0], [i, 4]);
    }
    for (let j = 1; j < 4; j++) blocks.push([0, j], [3, j]);
    for (const [bx, by] of blocks) {
      g.fillStyle = css((bx + by) % 2 ? ob : ob2);
      g.fillRect(x + bx * B, y + by * B, B, B);
      g.fillStyle = css(tint(hex('#7a1a1a'), isNight, 0.2));
      g.fillRect(x + bx * B + 1, y + by * B + 1, 1, 1);
    }
    return c;
  }

  function drawSky() {
    const bands = rows;
    for (let y = 0; y < bands; y++) {
      const f = y / (rows * 0.85);
      const d = f < 0.5 ? mix(SKY.day[0], SKY.day[1], f * 2) : mix(SKY.day[1], SKY.day[2], Math.min(1, (f - 0.5) * 2));
      const n = f < 0.5 ? mix(SKY.night[0], SKY.night[1], f * 2) : mix(SKY.night[1], SKY.night[2], Math.min(1, (f - 0.5) * 2));
      // bande a gradini, come il cielo di Minecraft
      ctx.fillStyle = css(mix(d, n, night));
      ctx.fillRect(0, y, cols, 1);
    }
    if (flash > 0.02) {
      ctx.fillStyle = `rgba(255,70,60,${flash * 0.28})`;
      ctx.fillRect(0, 0, cols, rows);
    }
  }

  function drawStars(t) {
    if (night < 0.05) return;
    const r = rng(999);
    for (let i = 0; i < cols / 3; i++) {
      const x = Math.floor(r() * cols);
      const y = Math.floor(r() * rows * 0.55);
      const tw = 0.5 + 0.5 * Math.sin(t / 700 + i);
      ctx.fillStyle = `rgba(255,255,255,${night * (0.4 + 0.6 * tw)})`;
      ctx.fillRect(x, y, 1, 1);
    }
  }

  function drawCelestial() {
    const x = Math.floor(cols * 0.18);
    const y = Math.floor(rows * 0.16);
    // sole malato e velato di giorno, luna rossa di notte
    ctx.globalAlpha = (1 - night) * 0.55;
    ctx.fillStyle = '#b98a6a';
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = '#d9a984';
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.globalAlpha = night;
    ctx.fillStyle = '#6e1216';
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = '#a8231f';
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = '#5a0d12';
    ctx.fillRect(x - 2, y - 3, 2, 2);
    ctx.fillRect(x + 1, y + 1, 2, 2);
    ctx.globalAlpha = 1;
  }

  function drawFog(t) {
    const col = mix([140, 100, 115], [70, 14, 30], night);
    const base = Math.floor(rows * 0.7);
    const step = Math.max(2, Math.floor(rows * 0.035));
    for (let i = 0; i < 8; i++) {
      const off = reduce ? 0 : Math.sin(t / 4200 + i * 1.3) * 8;
      ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${0.05 + i * 0.012})`;
      ctx.fillRect(off - 12, base + i * step, cols + 24, step);
    }
  }

  function drawSpores(t) {
    ctx.fillStyle = `rgba(255,${170 - night * 60},${150 - night * 70},${0.28 + night * 0.25})`;
    for (const sp of spores) {
      if (!reduce) {
        sp.y -= sp.vy;
        sp.x += Math.sin(t / 1600 + sp.ph) * 0.06;
        if (sp.y < -2) {
          sp.y = rows + 2;
          sp.x = Math.random() * cols;
        }
      }
      const sz = sp.big ? 2 : 1;
      ctx.fillRect(Math.floor(sp.x), Math.floor(sp.y), sz, sz);
    }
  }

  function drawClouds(t) {
    for (const c of clouds) {
      const x = ((c.x + (reduce ? 0 : t * c.speed)) % (cols + c.w * 2)) - c.w;
      const r = rng(c.seed);
      ctx.fillStyle = css(mix([95, 70, 85], [28, 12, 30], night));
      ctx.globalAlpha = 0.9;
      for (let i = 0; i < c.w; i += 4) {
        const hh = 2 + Math.floor(r() * 3);
        ctx.fillRect(Math.floor(x + i), Math.floor(c.y - hh), 4, hh + 2);
      }
      ctx.globalAlpha = 1;
    }
  }

  function drawLayer(key) {
    ctx.drawImage(layers[0][key], 0, 0);
    if (night > 0.01) {
      ctx.globalAlpha = night;
      ctx.drawImage(layers[1][key], 0, 0);
      ctx.globalAlpha = 1;
    }
  }

  function drawPortal(t) {
    const { x, y } = portal;
    const ix = x + B;
    const iy = y + B;
    // alone pixelato
    for (let k = 3; k >= 1; k--) {
      ctx.fillStyle = `rgba(255,40,40,${0.05 + night * 0.05 + flash * 0.05})`;
      ctx.fillRect(x - k * 2, y - k * 2, portal.w + k * 4, portal.h + k * 4);
    }
    for (let py = 0; py < 3 * B; py++) {
      for (let pxl = 0; pxl < 2 * B; pxl++) {
        const v = 0.5 + 0.5 * Math.sin((pxl * 0.9 + py * 0.55) + t / 380) * Math.cos(py * 0.4 - t / 520);
        const c = mix(hex('#4a0610'), hex('#ff3b3b'), v);
        ctx.fillStyle = css(c);
        ctx.fillRect(ix + pxl, iy + py, 1, 1);
      }
    }
    if (!reduce && Math.random() < 0.25) {
      sparks.push({ x: ix + Math.random() * 2 * B, y: iy + 3 * B, vy: 0.15 + Math.random() * 0.25, life: 1 });
    }
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.y -= s.vy;
      s.life -= 0.012;
      if (s.life <= 0) {
        sparks.splice(i, 1);
        continue;
      }
      ctx.fillStyle = `rgba(255,140,120,${s.life})`;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
    }
  }

  function frame(t) {
    if (!layers || cols < 1 || rows < 1) return;
    if (!reduce && Math.random() < 0.004) flash = 1;
    flash *= 0.86;
    night += (target - night) * 0.06;
    if (Math.abs(target - night) < 0.003) night = target;
    drawSky();
    drawStars(t);
    drawCelestial();
    drawLayer('far');
    drawClouds(t);
    drawLayer('mid');
    drawFog(t);
    drawLayer('near');
    drawPortal(t);
    drawSpores(t);
  }

  let last = 0;
  function loop(t) {
    if (t - last > 50) {
      last = t;
      frame(t);
    }
    requestAnimationFrame(loop);
  }

  build();
  addEventListener('resize', () => {
    build();
    frame(performance.now());
  });

  const stored = (() => {
    try {
      return localStorage.getItem('opi-theme');
    } catch {
      return null;
    }
  })();
  target = night = stored ? (stored === 'night' ? 1 : 0) : 1;
  document.documentElement.dataset.theme = target ? 'night' : 'day';

  document.querySelectorAll('[data-daynight]').forEach((btn) =>
    btn.addEventListener('click', () => {
      target = target ? 0 : 1;
      document.documentElement.dataset.theme = target ? 'night' : 'day';
      try {
        localStorage.setItem('opi-theme', target ? 'night' : 'day');
      } catch {}
      if (reduce) {
        night = target;
        frame(performance.now());
      }
    }),
  );

  frame(performance.now());
  if (!reduce) requestAnimationFrame(loop);
}
