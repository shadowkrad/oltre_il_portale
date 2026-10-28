export const pillars = [
  { icon: '🌀', title: 'Faglie Dimensionali', text: 'Varchi instabili tra i due mondi si aprono a intervalli regolari: dungeon a tempo, rischio alto e ricompense uniche.', href: '/gameplay/#faglie' },
  { icon: '⚔️', title: 'Combattimento d\'Azione', text: 'Schivate, parate tempestive, combo e abilità ad albero: ogni boss è una sfida tecnica.', href: '/gameplay/#combattimento' },
  { icon: '📜', title: 'Mestieri', text: 'Forgia, Alchimia del Vuoto, Esplorazione Abissale, Ingegneria Arcana: un\'economia cooperativa.', href: '/gameplay/#mestieri' },
  { icon: '🌑', title: 'Eventi Planetari', text: 'Eclissi di sangue, meteoriti abissali e invasioni: il mondo non dorme mai.', href: '/gameplay/#eventi' },
  { icon: '⚖️', title: 'Zero Pay-to-Win', text: 'Ogni oggetto, potere o rango si conquista solo giocando.', href: '/gameplay/#fairplay' },
  { icon: '⚡', title: '20 TPS Stabili', text: 'Hardware dedicato e ottimizzazioni per restare fluidi anche nelle battaglie più concitate.', href: '/gameplay/#performance' },
];

export const realms = [
  {
    id: 'overworld', name: 'Le Terre Emerse', short: 'Superficie', danger: 2,
    desc: 'Una terra maestosa di catene montuose, biomi rinnovati e antiche rovine. Qui i viaggiatori fondano civiltà, tracciano rotte carovaniere e costruiscono fortezze di gilda.',
    points: ['Claim & Fazioni Protette', 'Agricoltura & Economia Commerciale', 'Spedizioni Archeologiche'],
  },
  {
    id: 'underworld', name: 'Il Sottomondo', short: 'Abisso', danger: 5,
    desc: 'Oltre il varco delle profondità si estende un mondo alieno e spietato: caverne titaniche illuminate da spore, fiumi di plasma corrosivo e mostruosità che cacciano nel buio.',
    points: ['Minerali Arcanici & Forgia del Vuoto', 'Orrori dell\'Abisso & Boss a Fasi', 'Gravità Instabile & Nebbia Tossica'],
  },
];

export const steps = [
  { title: 'Avvia Minecraft Java', text: 'Apri il launcher ufficiale. Consigliamo la versione <strong>1.20 o superiore</strong>.' },
  { title: 'Vai su Multigiocatore', text: 'Dal menu principale scegli <strong>Multigiocatore</strong> e poi <strong>Aggiungi server</strong>.' },
  { title: 'Inserisci l\'indirizzo', text: 'Nel campo «Indirizzo del server» scrivi l\'IP qui sotto. La porta 25565 è già quella predefinita.', ip: true },
  { title: 'Varca il Portale!', text: 'Premi <strong>Fatto</strong>, seleziona il server dalla lista ed entra per forgiare la tua leggenda.' },
];

export const faq = [
  { q: 'Serve Minecraft originale?', a: 'Sì, serve Minecraft Java Edition acquistato. Bedrock (console e mobile) non è supportato.' },
  { q: 'Posso usare mod?', a: 'Solo mod grafiche o prestazionali come Sodium, OptiFine o Iris. Qualunque mod che dia vantaggi è vietata.' },
  { q: 'Non riesco a connettermi, cosa faccio?', a: 'Controlla che lo stato in alto sia ONLINE, che la versione del client sia 1.20 o superiore e che l\'indirizzo non contenga spazi. Se persiste, scrivici su Discord.' },
  { q: 'È gratis?', a: 'Sì. Nessun contenuto a pagamento che dia vantaggi: il server è 100% fair play.' },
];

export const rules = [
  ['Rispetto reciproco', 'Vietato qualsiasi insulto, discriminazione o comportamento tossico in chat globale o nei canali vocali.'],
  ['No cheating o hack client', 'Vietate le mod che danno vantaggi sleali (X-Ray, KillAura, Fly, Speed…). Consentite solo mod grafiche/prestazionali come Sodium, OptiFine o Iris.'],
  ['Griefing & furti', 'Nelle Terre Emerse rispetta i claim e le proprietà altrui. Nel Sottomondo valgono regole di sopravvivenza avanzate.'],
  ['Bug abusing', 'Ogni exploit, duplicazione o glitch va segnalato subito allo Staff.'],
  ['Divertiti e coopera', 'Esplora, forgiati un nome e difendi il tuo gruppo nelle profondità dell\'Abisso.'],
];

// Coordinate della mappa illustrata: x,y in una griglia 1000x1000 (0,0 in alto a sinistra).
export const places = [
  { id: 'spawn', name: 'Il Portale (Spawn)', type: 'portal', x: 500, y: 520, text: 'Punto di arrivo di ogni viaggiatore. Zona sicura, mercato e bacheca delle missioni.' },
  { id: 'porto', name: 'Porto Alba', type: 'city', x: 270, y: 640, text: 'Città commerciale sulla costa occidentale: rotte carovaniere e gilde dei mercanti.' },
  { id: 'rocca', name: 'Rocca di Brina', type: 'city', x: 720, y: 300, text: 'Fortezza di montagna, base delle fazioni più antiche.' },
  { id: 'faglia1', name: 'Faglia dei Sussurri', type: 'rift', x: 190, y: 330, text: 'Varco dimensionale ciclico. Si apre a tempo: dungeon ad alto rischio.' },
  { id: 'faglia2', name: 'Faglia Cremisi', type: 'rift', x: 820, y: 700, text: 'Seconda faglia, collegata al Sottomondo orientale.' },
  { id: 'rovine', name: 'Rovine dei Primi', type: 'ruin', x: 560, y: 150, text: 'Antiche rovine per le spedizioni archeologiche.' },
  { id: 'abisso', name: 'Cratere dell\'Abisso', type: 'abyss', x: 400, y: 860, text: 'Ingresso maggiore al Sottomondo. Porta torce e fegato.' },
];
