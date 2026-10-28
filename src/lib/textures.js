// Texture pixel-art 16x16 generate a build-time come SVG data-URI: nessun file immagine da mantenere.

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

export function texture(seed, palette, size = 16) {
  const r = rng(seed);
  let rects = '';
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const c = palette[Math.floor(r() * palette.length)];
      rects += `<rect x='${x}' y='${y}' width='1' height='1' fill='${c}'/>`;
    }
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${size} ${size}' shape-rendering='crispEdges'>${rects}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export const textures = {
  dirt: texture(7, ['#866043', '#79553a', '#6b4a32', '#8f6a4b', '#5e412b']),
  stone: texture(13, ['#7d7d7d', '#8b8b8b', '#707070', '#969696', '#656565']),
  grass: texture(21, ['#5d9b3a', '#55912f', '#68a844', '#4c8329', '#73b34c']),
  planks: texture(5, ['#a07a47', '#9a7340', '#ab834e', '#8f6a39', '#b58b55']),
  obsidian: texture(31, ['#150d23', '#1c1230', '#0f0919', '#241740', '#120b1f']),
};
