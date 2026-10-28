// Contenuti allineati a quanto GenWorld genera davvero nel mondo di gioco.
export const pillars = [
  {
    id: 'citta', icon: '🏰', title: 'Città vive',
    text: 'Città con mura, torri e mercato: botteghe con gli artigiani dentro, abitanti con un mestiere, campi, vigneti e uliveti tutto attorno.',
    bullets: ['Pianta organica con isolati, piazze, fontane e lampioni', 'Botteghe per mestiere con forzieri e bottino dedicati', 'Strade, ponti di pietra ad archi, pietre miliari, santelle e carovane di mercanti'],
  },
  {
    id: 'incarichi', icon: '📜', title: 'Incarichi e indizi',
    text: 'In ogni città vive un committente: per uno smeraldo ti vende un libro con la missione. Consegna l\'oggetto giusto e vieni pagato in smeraldi o diamanti.',
    bullets: ['Uccidi il capo di una torre e riporta il sigillo', 'Recupera la reliquia dal tesoro di una cripta', 'Salva la lettera di un prigioniero nelle celle di un castello', 'Una catena di libri e mappe del tesoro ti porta di luogo in luogo'],
  },
  {
    id: 'avventura', icon: '⚔️', title: 'Torri, fortezze e cripte',
    text: 'Fuori dalle mura il mondo è pieno di luoghi da affrontare, ognuno con un nome, un capo e un bottino.',
    bullets: ['Torri del Mago con streghe di guardia, alchimia e libri incantati', 'Fortezze e castelli in rovina con fili d\'inciampo, nascondigli e il trono del capo', 'Cripte con trappole (dardi, fosse, magma, TNT) e spawner', 'Miniere con gallerie, sale di sosta, binari e filoni'],
  },
  {
    id: 'sottosopra', icon: '🌑', title: 'Il Sottosopra',
    text: 'Il Nether è lo specchio del mondo: dove sopra c\'è una città, un fiume o una miniera, sotto c\'è la stessa cosa, alle stesse coordinate, ma corrotta.',
    bullets: ['Pietra in netherrack, legno in funghi cremisi, acqua in lava', 'Costruzioni in decadimento, ricoperte di liane', 'Atmosfera di cenere, mostri e spawner del Nether', 'Scala 1:1: le coordinate coincidono con la superficie'],
  },
  {
    id: 'dimensione-x', icon: '🕰️', title: 'Dimensione X',
    text: 'L\'End è un arcipelago di isole sospese nel vuoto, con al centro la Cittadella di Vecna: un\'isola di ardesia e ossidiana piangente.',
    bullets: ['La Camera del Grande Pendolo, con l\'orologio fermo', 'Ponti tentacolari di sculk che si arcuano nel vuoto', 'Bozzoli di sculk, obelischi d\'ombra e cittadelle di purpur con shulker', 'In cima a una torre, un paio di ali per tornare giù'],
  },
  {
    id: 'ferrovie', icon: '🚂', title: 'Ferrovie a vapore',
    text: 'Le città più importanti sono collegate da linee ferroviarie, con stazioni di legno e locomotive a vapore. Nel Sottosopra corre il treno fantasma.',
    bullets: ['Tracciato dedicato, con rilevato di ghiaia, salite e curve', 'Passaggi a livello dove i binari incrociano le strade', 'Una stazione in ogni città collegata'],
  },
  {
    id: 'scoperta', icon: '🧭', title: 'Un mondo da scoprire',
    text: 'Il territorio nasce da una vera mappa e si lascia esplorare: la geografia racconta la storia prima di qualsiasi cartello.',
    bullets: ['Vulcani con crateri, laghi di lava e colate', 'Fiumi, cascate, grotte lussureggianti e fondali marini', 'Isole del tesoro con croce di sabbia rossa e forziere sepolto', 'Megaliti, rovine sommerse, labirinti, arene e capanne di streghe'],
  },
  {
    id: 'fairplay', icon: '⚖️', title: 'Zero Pay-to-Win',
    text: 'Ogni oggetto, potere o rango si conquista solo giocando, esplorando e combattendo con i propri compagni.',
    bullets: [],
  },
];

export const realms = [
  {
    id: 'overworld', name: 'Le Terre Emerse', short: 'Superficie', danger: 2,
    desc: 'Il mondo di superficie: montagne, fiumi, vulcani e coste, con città murate, villaggi e campi coltivati. Fra una città e l\'altra, strade, ponti e ferrovie; fuori, torri, fortezze e cripte.',
    points: ['Città con mura, mercato e botteghe', 'Torri del Mago, fortezze e castelli in rovina', 'Vulcani, cascate e isole del tesoro'],
  },
  {
    id: 'sottosopra', name: 'Il Sottosopra', short: 'Specchio', danger: 4,
    desc: 'Il Nether come specchio del mondo: ogni città, fiume e miniera ha il suo gemello corrotto, alle stesse coordinate. L\'acqua è lava, il legno è fungo e tutto cade lentamente in rovina.',
    points: ['Costruzioni in decadimento, coperte di liane', 'Lava al posto dell\'acqua, cenere nell\'aria', 'Il treno fantasma sulle linee dei vivi'],
  },
  {
    id: 'dimensione-x', name: 'Dimensione X', short: 'Il Vuoto', danger: 5,
    desc: 'Isole sospese nel vuoto dell\'End, unite da ponti tentacolari di sculk. Al centro, la Cittadella di Vecna con la Camera del Grande Pendolo.',
    points: ['Cittadella di Vecna e Grande Pendolo', 'Bozzoli di sculk e obelischi d\'ombra', 'Cittadelle di purpur con shulker ed enderman'],
  },
];

export const steps = [
  { title: 'Avvia Minecraft Java', text: 'Apri il launcher ufficiale e scegli la versione indicata nella pagina (<strong>26.3</strong>).' },
  { title: 'Vai su Multigiocatore', text: 'Dal menu principale scegli <strong>Multigiocatore</strong> e poi <strong>Aggiungi server</strong>.' },
  { title: 'Inserisci l\'indirizzo', text: 'Nel campo «Indirizzo del server» scrivi l\'IP qui sotto. La porta 25565 è già quella predefinita.', ip: true },
  { title: 'Varca il Portale!', text: 'Premi <strong>Fatto</strong>, seleziona il server dalla lista ed entra. Cerca un committente in città: è da lì che parte l\'avventura.' },
];

export const bedrockSteps = [
  { title: 'Apri Minecraft Bedrock', text: 'Funziona su Windows, Android, iOS, Xbox, PlayStation e Switch. Se non riesci a entrare, aggiorna il gioco all’ultima versione disponibile.' },
  { title: 'Il modo più rapido: la pagina di accesso', text: 'Dal dispositivo su cui giochi premi il pulsante qui sotto: la pagina ti propone <strong>Entra subito</strong> oppure <strong>Aggiungi alla lista server</strong>.', joinLink: true },
  { title: 'Oppure aggiungi il server a mano', text: 'Gioca → Server → Aggiungi server, poi inserisci indirizzo e porta qui sotto. <strong>Attenzione:</strong> per Bedrock sono diversi da quelli Java.', bedrock: true },
  { title: 'Entra nel mondo', text: 'Seleziona il server dalla lista e premi <strong>Entra</strong>. Il tuo nome sarà quello del tuo account Microsoft/Xbox.' },
];

export const faq = [
  { q: 'Serve Minecraft originale?', a: 'Sì. Puoi giocare con Minecraft Java Edition (PC) oppure con Bedrock (Windows, mobile e console): il server è multipiattaforma.' },
  { q: 'Da console non trovo il pulsante per aggiungere un server', a: 'Su Xbox, PlayStation e Switch il gioco non permette di inserire un indirizzo a mano. Serve un servizio ponte come BedrockConnect, che si imposta cambiando i DNS della console: se ti serve aiuto scrivici su Discord.' },
  { q: 'Giocatori Java e Bedrock giocano insieme?', a: 'Sì, nello stesso mondo, con le stesse città, incarichi e ferrovie. Alcune cose possono comportarsi in modo leggermente diverso su Bedrock.' },
  { q: 'Come funzionano gli incarichi?', a: 'In ogni città c\'è un abitante con un nome sopra la testa. Per 1 smeraldo vende un libro con la missione. Porta l\'oggetto richiesto (sigillo, reliquia o lettera) e ricevi smeraldi o diamanti.' },
  { q: 'Come si va nel Sottosopra?', a: 'Attraverso un portale del Nether, come in Minecraft. Le coordinate coincidono con la superficie: se sopra c\'è una città, sotto c\'è la sua versione corrotta.' },
  { q: 'Come si usa il treno?', a: 'Le città collegate hanno una stazione di legno. Cerca i binari fuori dall\'abitato e seguili: li percorrono le locomotive a vapore.' },
  { q: 'Posso usare mod?', a: 'Solo mod grafiche o prestazionali come Sodium, OptiFine o Iris. Qualunque mod che dia vantaggi è vietata.' },
  { q: 'Da Bedrock non riesco a entrare', a: 'Non usare l\'indirizzo Java (minecraft.guidelli.net:25565): per Bedrock vale solo quello indicato nella scheda Bedrock di questa pagina, che passa dalla pagina di accesso. Controlla anche che lo stato in alto sia ONLINE e che il gioco sia aggiornato. Se persiste, scrivici su Discord.' },
  { q: 'Non riesco a connettermi, cosa faccio?', a: 'Controlla che lo stato in alto sia ONLINE, che la versione del client sia quella indicata e che l\'indirizzo non contenga spazi. Se persiste, scrivici su Discord.' },
  { q: 'È gratis?', a: 'Sì. Nessun contenuto a pagamento che dia vantaggi: il server è 100% fair play.' },
];

export const rules = [
  ['Rispetto reciproco', 'Vietato qualsiasi insulto, discriminazione o comportamento tossico in chat globale o nei canali vocali.'],
  ['No cheating o hack client', 'Vietate le mod che danno vantaggi sleali (X-Ray, KillAura, Fly, Speed…). Consentite solo mod grafiche/prestazionali come Sodium, OptiFine o Iris.'],
  ['Griefing & furti', 'Rispetta i claim e le proprietà altrui, in superficie come nel Sottosopra.'],
  ['Bug abusing', 'Ogni exploit, duplicazione o glitch va segnalato subito allo Staff.'],
  ['Divertiti e coopera', 'Esplora, forgiati un nome e difendi il tuo gruppo nelle profondità.'],
];

// Coordinate della mappa illustrata (usata solo se non c'è una mappa live): griglia 1000x1000, (0,0) in alto a sinistra.
export const places = [
  { id: 'spawn', name: 'Il Portale (Spawn)', type: 'portal', x: 500, y: 520, text: 'Punto di arrivo di ogni viaggiatore. Zona sicura, mercato e bacheca delle missioni.' },
  { id: 'porto', name: 'Porto Alba', type: 'city', x: 270, y: 640, text: 'Città commerciale sulla costa occidentale: rotte carovaniere, stazione e committente di incarichi.' },
  { id: 'rocca', name: 'Rocca di Brina', type: 'city', x: 720, y: 300, text: 'Città fortificata di montagna.' },
  { id: 'faglia1', name: 'Torre del Mago', type: 'rift', x: 190, y: 330, text: 'Torre con un mago evocatore, streghe di guardia e un laboratorio di alchimia.' },
  { id: 'faglia2', name: 'Cripta dell\'Osso', type: 'rift', x: 820, y: 700, text: 'Cripta con trappole, spawner e una reliquia nel forziere del tesoro.' },
  { id: 'rovine', name: 'Rovine dei Primi', type: 'ruin', x: 560, y: 150, text: 'Megaliti e templi in rovina per le spedizioni archeologiche.' },
  { id: 'abisso', name: 'Cratere dell\'Abisso', type: 'abyss', x: 400, y: 860, text: 'Un cratere vulcanico: da qui si scende verso il Sottosopra.' },
];
