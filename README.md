# 🌀 Oltre il Portale — Minecraft Fantasy Realm & Sottomondo

Landing page e vetrina web ad alto impatto visivo containerizzata con **Docker** per il server Minecraft italiano **Oltre il Portale**.

* **Indirizzo Server (IP):** `minecraft.guidelli.net`
* **Porta:** `25565`
* **Repository Git:** [https://github.com/shadowkrad/oltre_il_portale.git](https://github.com/shadowkrad/oltre_il_portale.git)

---

## 🌟 Caratteristiche Principali

1. **Monitoraggio Server in Tempo Reale**:
   - Query automatica live a `minecraft.guidelli.net:25565` (stato Online/Offline, giocatori connessi, ping in millisecondi, versione Minecraft).
   - Lettura e formattazione del **Messaggio del Giorno (MOTD)** con supporto ai codici colore ufficiali di Minecraft.
   - Auto-refresh programmato (ogni 60s) con conto alla rovescia e pulsante di aggiornamento manuale immediato.
   - Pulsanti di copia rapida dell'IP negli appunti con feedback visivo e notifica toast.

2. **Cosmologia Fantasy & I Due Regni**:
   - Selettore interattivo tra **Le Terre Emerse (Superficie)** e il letale **Sottomondo (Abisso)**.
   - Livelli di pericolo, biomi, risorse arcaniche e dinamiche ambientali esclusive.

3. **Evoluzione del Gameplay Dinamico**:
   - Vetrina strutturata sui 6 pilastri del gameplay evoluto:
     - 🌀 *Faglie dimensionali cicliche (dungeon a tempo)*
     - ⚔️ *Combattimento d'azione & abilità esecutive*
     - 📜 *Mestieri e specializzazioni*
     - 🌑 *Eventi dinamici server-wide (eclissi, invasioni abissali)*
     - ⚖️ *100% Fair Play (No Pay-to-Win)*
     - ⚡ *Hardware dedicato e performance a 20 TPS stabili*

4. **Vetrina Video & Teaser Trailer**:
   - Frame arcanico cinematografico predisposto per riprodurre il video del server (YouTube, Vimeo, Shorts o video diretto MP4).
   - Inserimento rapido del link tramite `CONFIG.VIDEO_URL` in `public/js/main.js` o parametro URL `?video=...`.

5. **Esperienza Immersiva**:
   - Canvas animato 2D con particelle dimensionali e vortice del Portale.
   - Sintetizzatore Web Audio API integrato per atmosfera sonora mistica (senza dipendenze esterne o file pesanti).
   - Design completamente responsive (Desktop, Tablet, Mobile) con menu a cassetto touch-friendly.

---

## 🚀 Avvio Rapido con Docker

### Prerequisiti
- [Docker](https://www.docker.com/) e Docker Compose installati.

### 1. Avviare il contenitore in background
```bash
docker compose up -d --build
```

Il sito sarà immediatamente accessibile su:
👉 **[http://localhost:8080](http://localhost:8080)**

### 2. Fermare il contenitore
```bash
docker compose down
```

### 3. Personalizzare la porta
Puoi modificare la porta esposta creando o modificando il file `.env`:
```env
PORT=80
```
oppure eseguendo:
```bash
PORT=80 docker compose up -d
```

---

## 🛠️ Avvio Locale senza Docker (Sviluppo Rapido)

Dato che il frontend è composto da standard HTML5, CSS3 moderno e JavaScript modulare puro, puoi avviarlo con qualsiasi server HTTP statico:

### Con Python:
```bash
cd public
python -m http.server 8080
```

### Con Node.js (npx):
```bash
npx serve public -p 8080
```

---

## ⚙️ Configurazione & Personalizzazione

### 1. Inserire il Link del Video Trailer
Nel file [`public/js/main.js`](file:///c:/Users/Administrator/Google/oltre_il_portale/public/js/main.js#L7-L12):
```javascript
window.PORTAL_CONFIG = {
  VIDEO_URL: "https://www.youtube.com/watch?v=TUO_VIDEO_ID",
  SERVER_IP: "minecraft.guidelli.net:25565"
};
```
> Puoi anche testare al volo un video semplicemente aprendo il browser con:
> `http://localhost:8080/?video=https://www.youtube.com/watch?v=TUO_VIDEO_ID`

### 2. Modificare l'Indirizzo o la Porta del Server Minecraft
Nel file [`public/js/server-status.js`](file:///c:/Users/Administrator/Google/oltre_il_portale/public/js/server-status.js#L6-L12):
```javascript
const SERVER_CONFIG = {
  host: 'minecraft.guidelli.net',
  port: 25565,
  refreshIntervalSeconds: 60,
  ...
};
```

---

## 📁 Struttura del Progetto

```
oltre_il_portale/
├── public/
│   ├── index.html                 # Pagina principale completa
│   ├── css/
│   │   └── style.css              # Foglio di stile Cinematic Fantasy
│   ├── js/
│   │   ├── main.js                # Controller UI, selettore Regni, video trailer, audio
│   │   ├── server-status.js       # Query status live, ping, MOTD, copia IP
│   │   └── portal-canvas.js       # Animazione canvas particellare del Portale
│   └── assets/
│       └── images/
│           └── og-preview.svg     # Grafica OpenGraph social preview
├── docker/
│   └── nginx.conf                 # Configurazione Nginx ottimizzata con gzip e caching
├── Dockerfile                     # Immagine Alpine Nginx ultra-leggera (~25MB)
├── docker-compose.yml             # Orchestrazione container Docker
├── .dockerignore
├── .gitignore
└── README.md
```

---

## 📦 Push su GitHub

Per sincronizzare il codice con il repository remoto:

```bash
git add .
git commit -m "feat: Inizializzazione vetrina web Docker Oltre il Portale con live status e tema Sottomondo"
git branch -M main
git push -u origin main
```
