// Unica fonte di verità per i dati del server: modifica qui, non nelle pagine.
export const site = {
  name: 'Oltre il Portale',
  tagline: 'Server Minecraft Fantasy',
  host: 'minecraft.guidelli.net',
  port: 25565,
  version: '26.3',
  edition: 'Java & Bedrock',
  discord: 'https://discord.gg',
  // Accesso da Bedrock. Geyser non usa la porta 25565: i giocatori Bedrock entrano dal servizio di signaling (Warden).
  // Se dopo un riavvio cambia, l'indirizzo giusto e' nel log del server: "Players can join at https://....wdn.gg".
  // Aggiorna qui host e joinUrl (la porta e' quella mostrata dalla pagina di accesso, finora 443).
  bedrock: { enabled: true, host: 'glowingcat.wdn.gg', port: 443, joinUrl: 'https://glowingcat.wdn.gg', versions: '26.40–26.60' },
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
  { href: '/mondi/', label: 'Le Dimensioni' },
  { href: '/gameplay/', label: 'Gameplay' },
  { href: '/mappa/', label: 'Mappa' },
  { href: '/regolamento/', label: 'Regolamento' },
];
