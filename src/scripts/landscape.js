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
  day: [hex('#5aa0ff'), hex('#8ec1ff'), hex('#cfe6ff')],
  night: [hex('#05071c'), hex('#0e1440'), hex('#1d2a5e')],
};

export function initLandscape(canvas) {
  const ctx = canvas.getContext('2d');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let cols, rows, layers, groundY, portal, trees;
  let night = 0;
  let target = 0;
  const clouds = [];
  const sparks = [];

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

    layers = [false, true].map((isNight) => ({
      far: paintLand(far, [hex('#7d93ad'), hex('#6d849f')], isNight, 3),
      mid: paintLand(mid, [hex('#5f7f6a'), hex('#547560')], isNight, 5),
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
    return isNight ? mix(color, [8, 10, 40], amount) : color;
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
    const grass = [hex('#5d9b3a'), hex('#55912f'), hex('#68a844')];
    const dirt = [hex('#866043'), hex('#79553a'), hex('#6b4a32')];
    const stone = [hex('#7d7d7d'), hex('#707070'), hex('#8b8b8b')];
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
    // alberi di quercia
    for (const t of trees) {
      const tr = rng(t.seed);
      const base = groundY[t.x];
      const log = tint(hex('#6b4f2a'), isNight, 0.55);
      g.fillStyle = css(log);
      g.fillRect(t.x, base - t.h, 2, t.h);
      const leaves = [hex('#2f7a2a'), hex('#3a8c32'), hex('#276b23')];
      const top = base - t.h;
      for (let ly = -3; ly <= 1; ly++) {
        const half = ly < 0 ? 3 : 2;
        for (let lx = -half; lx <= half + 1; lx++) {
          if (Math.abs(lx) === half && ly === -3 && tr() > 0.5) continue;
          g.fillStyle = css(tint(leaves[Math.floor(tr() * 3)], isNight, 0.55));
          g.fillRect(t.x + lx, top + ly - 1, 1, 1);
        }
      }
    }
    // cornice di ossidiana
    const ob = tint(hex('#1a1030'), isNight, 0.2);
    const ob2 = tint(hex('#2a1850'), isNight, 0.2);
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
      g.fillStyle = css(tint(hex('#3b2470'), isNight, 0.2));
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
    const y = Math.floor(rows * 0.14);
    ctx.globalAlpha = 1 - night;
    ctx.fillStyle = '#fff6b0';
    ctx.fillRect(x - 5, y - 5, 10, 10);
    ctx.fillStyle = '#ffe14d';
    ctx.fillRect(x - 3, y - 3, 6, 6);
    ctx.globalAlpha = night;
    ctx.fillStyle = '#e6ecff';
    ctx.fillRect(x - 4, y - 4, 8, 8);
    ctx.fillStyle = '#bfc8ee';
    ctx.fillRect(x - 2, y - 3, 2, 2);
    ctx.fillRect(x + 1, y + 1, 2, 2);
    ctx.globalAlpha = 1;
  }

  function drawClouds(t) {
    for (const c of clouds) {
      const x = ((c.x + (reduce ? 0 : t * c.speed)) % (cols + c.w * 2)) - c.w;
      const r = rng(c.seed);
      ctx.fillStyle = css(mix([255, 255, 255], [70, 80, 130], night));
      ctx.globalAlpha = 0.85 - night * 0.35;
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
      ctx.fillStyle = `rgba(160,70,255,${0.05 + night * 0.04})`;
      ctx.fillRect(x - k * 2, y - k * 2, portal.w + k * 4, portal.h + k * 4);
    }
    for (let py = 0; py < 3 * B; py++) {
      for (let pxl = 0; pxl < 2 * B; pxl++) {
        const v = 0.5 + 0.5 * Math.sin((pxl * 0.9 + py * 0.55) + t / 380) * Math.cos(py * 0.4 - t / 520);
        const c = mix(hex('#5b1ea8'), hex('#c77dff'), v);
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
      ctx.fillStyle = `rgba(222,170,255,${s.life})`;
      ctx.fillRect(Math.floor(s.x), Math.floor(s.y), 1, 1);
    }
  }

  function frame(t) {
    if (!layers || cols < 1 || rows < 1) return;
    night += (target - night) * 0.06;
    if (Math.abs(target - night) < 0.003) night = target;
    drawSky();
    drawStars(t);
    drawCelestial();
    drawLayer('far');
    drawClouds(t);
    drawLayer('mid');
    drawLayer('near');
    drawPortal(t);
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
  const h = new Date().getHours();
  target = night = stored ? (stored === 'night' ? 1 : 0) : h >= 19 || h < 6 ? 1 : 0;
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
