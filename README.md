# Oltre il Portale

Sito del server Minecraft **minecraft.guidelli.net:25565**: home-vetrina dinamica, guida per entrare, i due regni, gameplay, mappa interattiva e regolamento. Astro (statico) + nginx in Docker.

## Struttura

```
src/
  config/site.js      IP, porta, Discord, trailer, URL mappa live, menu
  config/content.js   testi: pilastri, regni, passi, FAQ, regole, luoghi della mappa
  pages/              una pagina per file (index, istruzioni, mondi, gameplay, mappa, regolamento)
  components/         Header, Footer, ServerStatus, RealmCard
  layouts/Base.astro  scheletro comune + sfondo
  scripts/            landscape (sfondo), status (live), ui, mapart (mappa)
  styles/global.css   stile Minecraft
docker/nginx.conf, Dockerfile, docker-compose.yml
```

## Comandi

```bash
npm install
npm run dev      # sviluppo su http://localhost:4321
npm run build    # output in dist/
docker compose up -d --build   # produzione su http://localhost:3010 (PORT per cambiare)
```

## Personalizzazione

- Cambia IP, Discord, trailer: `src/config/site.js`.
- Mappa: modifica `places` in `src/config/content.js`. Se il server ha BlueMap/Dynmap, metti il suo URL in `liveMapUrl` e la pagina Mappa la incorpora.

## Accesso Bedrock

Geyser (2.12) non usa la porta 25565: i giocatori Bedrock entrano dal servizio di signaling. L'indirizzo è in `src/config/site.js` (`bedrock.host`, `port`, `joinUrl`). Dopo un riavvio del server controlla nel log la riga `Players can join at https://....wdn.gg`: se l'indirizzo è cambiato, aggiornalo lì, `npm run build` e `docker compose up -d --build`.

## «Il muro scrive»: dal sito alla chat di gioco

Il muro di lucine nella pagina Sottosopra manda il messaggio (solo lettere A-Z, max 24, un messaggio ogni 30 s per persona, 12 al minuto in totale, filtro parole) al servizio `api/`, che lo ripete in gioco con `tellraw` via **RCON**.

1. In `server.properties` del server Minecraft (poi riavvia):
   ```
   enable-rcon=true
   rcon.port=25575
   rcon.password=UNA_PASSWORD_LUNGA
   ```
   **Non aprire mai la porta 25575 su internet o sul router**: deve restare raggiungibile solo dalla rete interna.
2. Sul server del sito crea un file `.env` accanto a `docker-compose.yml` (vedi `.env.example`):
   ```
   RCON_HOST=10.10.1.248
   RCON_PORT=25575
   RCON_PASSWORD=la_stessa_password
   ```
3. `docker compose up -d --build`. Senza `RCON_PASSWORD` il servizio risponde «non configurato» e il sito resta in piedi.

In sviluppo: `RCON_PASSWORD=... node api/server.js` (porta 3055); Astro inoltra `/api` a quella porta.
