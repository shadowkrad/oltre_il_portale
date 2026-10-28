// Unica fonte di verità per i dati del server: modifica qui, non nelle pagine.
export const site = {
  name: 'Oltre il Portale',
  tagline: 'Server Minecraft Fantasy',
  host: 'minecraft.guidelli.net',
  port: 25565,
  version: '1.20+',
  edition: 'Java Edition',
  discord: 'https://discord.gg',
  // Link YouTube (embed) / Vimeo / MP4 del trailer. Vuoto = sezione nascosta.
  videoUrl: '',
  // URL di BlueMap/Dynmap se il server ne espone una: la pagina Mappa la incorpora al posto della mappa illustrata.
  liveMapUrl: 'http://10.10.1.248:8123',
  refreshSeconds: 60,
};

export const address = `${site.host}:${site.port}`;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/istruzioni/', label: 'Come Entrare' },
  { href: '/mondi/', label: 'I Due Regni' },
  { href: '/gameplay/', label: 'Gameplay' },
  { href: '/mappa/', label: 'Mappa' },
  { href: '/regolamento/', label: 'Regolamento' },
];
