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
  dirt: texture(7, ['#4a3a33', '#41322c', '#38302b', '#54423a', '#2f2824']),
  stone: texture(13, ['#5a5a60', '#66666d', '#4e4e54', '#707078', '#45454b']),
  grass: texture(21, ['#5a1414', '#4a1010', '#6a1a1a', '#3d0d0d', '#781e1e']),
  planks: texture(5, ['#4a3426', '#44301f', '#52392a', '#3b2a1e', '#5a4130']),
  obsidian: texture(31, ['#150d23', '#1c1230', '#0f0919', '#241740', '#120b1f']),
};
