// Genera la mappa illustrata del reame (pixel-art in stile mappa di Minecraft) in modo procedurale.
const N = 250; // risoluzione in "blocchi"; le coordinate dei luoghi sono su una griglia 1000x1000

function hash(x, y, s) {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function vnoise(x, y, s) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y, s) {
  let t = 0, amp = 0.5, f = 1;
  for (let o = 0; o < 4; o++) {
    t += vnoise(x * f, y * f, s + o) * amp;
    amp /= 2;
    f *= 2;
  }
  return t;
}

const PAL = {
  deep: [28, 62, 130], water: [40, 90, 170], shallow: [64, 130, 200], sand: [222, 205, 150],
  grass: [100, 160, 60], forest: [58, 120, 44], hill: [128, 128, 120], rock: [160, 160, 156], snow: [240, 244, 250],
  pit: [20, 10, 36], rift: [160, 70, 230],
};

export function drawRealmMap(canvas, places) {
  canvas.width = N;
  canvas.height = N;
  const ctx = canvas.getContext('2d');
  const img = ctx.createImageData(N, N);
  const h = new Float32Array(N * N);
  const bumps = places.map((p) => ({ x: (p.x / 1000) * N, y: (p.y / 1000) * N, type: p.type }));

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const nx = x / N - 0.5, ny = y / N - 0.5;
      const falloff = 1 - Math.min(1, Math.sqrt(nx * nx + ny * ny) * 2.1);
      let v = fbm(x / 38, y / 38, 3) * 0.75 + falloff * 0.55 - 0.12;
      for (const b of bumps) {
        const d2 = (x - b.x) ** 2 + (y - b.y) ** 2;
        v += 0.3 * Math.exp(-d2 / 260);
      }
      h[y * N + x] = v;
    }
  }

  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const v = h[y * N + x];
      let c;
      if (v < 0.3) c = PAL.deep;
      else if (v < 0.38) c = PAL.water;
      else if (v < 0.43) c = PAL.shallow;
      else if (v < 0.47) c = PAL.sand;
      else if (v < 0.7) c = fbm(x / 9, y / 9, 91) > 0.55 ? PAL.forest : PAL.grass;
      else if (v < 0.82) c = PAL.hill;
      else if (v < 0.9) c = PAL.rock;
      else c = PAL.snow;

      // ombreggiatura direzionale, come le mappe vanilla
      const slope = v - (h[Math.max(0, y - 1) * N + Math.max(0, x - 1)] ?? v);
      const k = v > 0.43 ? Math.max(-14, Math.min(14, slope * 240)) : 0;
      const i = (y * N + x) * 4;
      img.data[i] = c[0] + k;
      img.data[i + 1] = c[1] + k;
      img.data[i + 2] = c[2] + k;
      img.data[i + 3] = 255;
    }
  }

  for (const b of bumps) {
    if (b.type !== 'abyss' && b.type !== 'rift') continue;
    const r = b.type === 'abyss' ? 11 : 5;
    for (let y = -r - 2; y <= r + 2; y++) {
      for (let x = -r - 2; x <= r + 2; x++) {
        const d = Math.sqrt(x * x + y * y) + (hash(x, y, 5) - 0.5) * 2.5;
        if (d > r) continue;
        const px = Math.round(b.x) + x, py = Math.round(b.y) + y;
        if (px < 0 || py < 0 || px >= N || py >= N) continue;
        const c = b.type === 'rift' || d > r - 2.2 ? (b.type === 'rift' ? PAL.rift : [70, 30, 120]) : PAL.pit;
        const i = (py * N + px) * 4;
        img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2];
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  return canvas;
}
