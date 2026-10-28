/**
 * Oltre il Portale - Minecraft Server Status & Ping Engine
 * Target: minecraft.guidelli.net:25565
 */

const SERVER_CONFIG = {
  host: 'minecraft.guidelli.net',
  port: 25565,
  refreshIntervalSeconds: 60,
  apiPrimary: 'https://api.mcstatus.io/v2/status/java/',
  apiFallback: 'https://api.mcsrvstat.us/3/'
};

class ServerMonitor {
  constructor() {
    this.countdown = SERVER_CONFIG.refreshIntervalSeconds;
    this.timerInterval = null;
    this.isQuerying = false;
    this.lastData = null;

    this.initElements();
    this.bindEvents();
    this.startAutoRefresh();
    this.fetchServerStatus();
  }

  initElements() {
    // Navbar mini pill
    this.navStatusPill = document.getElementById('nav-mini-status');
    this.navStatusText = document.getElementById('nav-status-text');
    this.navPlayersCount = document.getElementById('nav-players-count');

    // Hero elements
    this.heroStatusBadge = document.getElementById('hero-status-badge');
    this.heroPingBadge = document.getElementById('hero-ping-badge');
    this.quickPlayers = document.getElementById('quick-players');
    this.quickVersion = document.getElementById('quick-version');

    // Dashboard elements
    this.dashStatusBadge = document.getElementById('dashboard-status-badge');
    this.dashPlayersCount = document.getElementById('dashboard-players-count');
    this.dashPlayersMax = document.getElementById('dashboard-players-max');
    this.dashPlayersBar = document.getElementById('dashboard-players-bar');
    this.dashPingVal = document.getElementById('dashboard-ping-val');
    this.dashVersionVal = document.getElementById('dashboard-version-val');
    this.dashMotdDisplay = document.getElementById('dashboard-motd-display');
    this.dashUptimeNote = document.getElementById('dashboard-uptime-note');
    this.refreshTimerDisplay = document.getElementById('refresh-timer');
    this.manualRefreshBtn = document.getElementById('manual-refresh-btn');

    // Copy IP buttons & Toast
    this.copyButtons = document.querySelectorAll('.copy-ip-btn');
    this.copyToast = document.getElementById('copy-toast');
  }

  bindEvents() {
    if (this.manualRefreshBtn) {
      this.manualRefreshBtn.addEventListener('click', () => {
        if (!this.isQuerying) {
          this.countdown = SERVER_CONFIG.refreshIntervalSeconds;
          this.fetchServerStatus();
        }
      });
    }

    // IP Copy triggers
    this.copyButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const ip = btn.getAttribute('data-ip') || `${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
        this.copyToClipboard(ip);
      });
    });
  }

  startAutoRefresh() {
    if (this.timerInterval) clearInterval(this.timerInterval);

    this.timerInterval = setInterval(() => {
      this.countdown--;
      if (this.refreshTimerDisplay) {
        this.refreshTimerDisplay.innerHTML = `Auto-refresh: <strong>${this.countdown}s</strong>`;
      }

      if (this.countdown <= 0) {
        this.countdown = SERVER_CONFIG.refreshIntervalSeconds;
        this.fetchServerStatus();
      }
    }, 1000);
  }

  async fetchServerStatus() {
    if (this.isQuerying) return;
    this.isQuerying = true;
    const startTime = performance.now();

    if (this.dashStatusBadge) {
      this.dashStatusBadge.className = 'status-badge-lg';
      this.dashStatusBadge.textContent = 'Verifica in corso...';
    }

    try {
      // Primary attempt: mcstatus.io
      const url = `${SERVER_CONFIG.apiPrimary}${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
      const response = await fetch(url, { cache: 'no-store' });
      
      if (!response.ok) {
        throw new Error('Primary API error');
      }

      const data = await response.json();
      const elapsedPing = Math.round(performance.now() - startTime);
      this.applyStatusData(data, elapsedPing, 'primary');
    } catch (err) {
      console.warn('Primary status check failed, attempting fallback API...', err);
      // Fallback attempt: mcsrvstat.us
      try {
        const fallbackUrl = `${SERVER_CONFIG.apiFallback}${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`;
        const response = await fetch(fallbackUrl, { cache: 'no-store' });
        const fallbackData = await response.json();
        const elapsedPing = Math.round(performance.now() - startTime);
        this.applyFallbackData(fallbackData, elapsedPing);
      } catch (fallbackErr) {
        console.error('All Minecraft status APIs failed:', fallbackErr);
        this.applyOfflineState();
      }
    } finally {
      this.isQuerying = false;
    }
  }

  applyStatusData(data, calculatedPing, source) {
    this.lastData = data;
    const isOnline = Boolean(data.online);

    if (isOnline) {
      const playersOnline = data.players ? data.players.online : 0;
      const playersMax = data.players ? data.players.max : 100;
      const versionName = data.version ? (data.version.name_clean || data.version.name_raw || '1.20+') : '1.20+';
      const motdHtml = data.motd ? (data.motd.html || this.formatMotdText(data.motd.clean)) : 'Benvenuto in Oltre il Portale!';

      // Update UI elements
      this.setOnlineUI(playersOnline, playersMax, versionName, calculatedPing, motdHtml);
    } else {
      this.applyOfflineState();
    }
  }

  applyFallbackData(data, calculatedPing) {
    const isOnline = Boolean(data.online);

    if (isOnline) {
      const playersOnline = data.players ? data.players.online : 0;
      const playersMax = data.players ? data.players.max : 100;
      const versionName = data.version || '1.20+';
      let motdHtml = 'Benvenuto in Oltre il Portale!';
      if (data.motd && data.motd.html) {
        motdHtml = Array.isArray(data.motd.html) ? data.motd.html.join('<br>') : data.motd.html;
      } else if (data.motd && data.motd.clean) {
        motdHtml = Array.isArray(data.motd.clean) ? data.motd.clean.join('<br>') : data.motd.clean;
      }

      this.setOnlineUI(playersOnline, playersMax, versionName, calculatedPing, motdHtml);
    } else {
      this.applyOfflineState();
    }
  }

  setOnlineUI(playersOnline, playersMax, version, ping, motdHtml) {
    // Navbar
    if (this.navStatusPill) {
      const dot = this.navStatusPill.querySelector('.status-dot');
      if (dot) dot.className = 'status-dot online pulsing';
    }
    if (this.navStatusText) this.navStatusText.textContent = 'ONLINE';
    if (this.navPlayersCount) this.navPlayersCount.textContent = `${playersOnline}/${playersMax}`;

    // Hero
    if (this.heroStatusBadge) {
      this.heroStatusBadge.innerHTML = `<span class="status-indicator-dot" style="background:#10b981;box-shadow:0 0 10px #10b981"></span><span style="color:#34d399">SERVER ONLINE</span>`;
    }
    if (this.heroPingBadge) {
      this.heroPingBadge.textContent = `${ping} ms`;
    }
    if (this.quickPlayers) this.quickPlayers.textContent = playersOnline;
    if (this.quickVersion) this.quickVersion.textContent = version.replace(/Minecraft /i, '');

    // Dashboard
    if (this.dashStatusBadge) {
      this.dashStatusBadge.className = 'status-badge-lg online';
      this.dashStatusBadge.textContent = '● ONLINE';
    }
    if (this.dashPlayersCount) this.dashPlayersCount.textContent = playersOnline;
    if (this.dashPlayersMax) this.dashPlayersMax.textContent = `/ ${playersMax}`;
    if (this.dashPlayersBar) {
      const pct = Math.min(100, Math.round((playersOnline / (playersMax || 100)) * 100));
      this.dashPlayersBar.style.width = `${pct}%`;
    }
    if (this.dashPingVal) this.dashPingVal.textContent = ping;
    if (this.dashVersionVal) this.dashVersionVal.textContent = version;
    if (this.dashMotdDisplay) this.dashMotdDisplay.innerHTML = motdHtml;
    if (this.dashUptimeNote) this.dashUptimeNote.textContent = 'Pronto per la connessione';
  }

  applyOfflineState() {
    // Server is currently unreachable or offline
    // Navbar
    if (this.navStatusPill) {
      const dot = this.navStatusPill.querySelector('.status-dot');
      if (dot) dot.className = 'status-dot offline';
    }
    if (this.navStatusText) this.navStatusText.textContent = 'OFFLINE / STANDBY';
    if (this.navPlayersCount) this.navPlayersCount.textContent = '0/100';

    // Hero
    if (this.heroStatusBadge) {
      this.heroStatusBadge.innerHTML = `<span class="status-indicator-dot" style="background:#ef4444;box-shadow:0 0 8px #ef4444"></span><span style="color:#f87171">STANDBY / MANUTENZIONE</span>`;
    }
    if (this.heroPingBadge) this.heroPingBadge.textContent = '-- ms';
    if (this.quickPlayers) this.quickPlayers.textContent = '0';

    // Dashboard
    if (this.dashStatusBadge) {
      this.dashStatusBadge.className = 'status-badge-lg offline';
      this.dashStatusBadge.textContent = '○ IN ATTESA / STANDBY';
    }
    if (this.dashPlayersCount) this.dashPlayersCount.textContent = '0';
    if (this.dashPlayersBar) this.dashPlayersBar.style.width = '0%';
    if (this.dashPingVal) this.dashPingVal.textContent = '--';
    if (this.dashVersionVal) this.dashVersionVal.textContent = 'Java 1.20+';
    if (this.dashMotdDisplay) {
      this.dashMotdDisplay.innerHTML = `<span style="color:#94a3b8">Il server <strong style="color:#00f0ff">${SERVER_CONFIG.host}</strong> è attualmente in attesa o in fase di avvio. Puoi comunque inserire l'IP nel tuo client per connetterti appena attivo!</span>`;
    }
    if (this.dashUptimeNote) this.dashUptimeNote.textContent = 'In attesa del bootstrap di rete';
  }

  formatMotdText(rawText) {
    if (!rawText) return 'Oltre il Portale • Minecraft Fantasy Server';
    return rawText
      .replace(/§0/g, '<span style="color:#000000">')
      .replace(/§1/g, '<span style="color:#0000aa">')
      .replace(/§2/g, '<span style="color:#00aa00">')
      .replace(/§3/g, '<span style="color:#00aaaa">')
      .replace(/§4/g, '<span style="color:#aa0000">')
      .replace(/§5/g, '<span style="color:#aa00aa">')
      .replace(/§6/g, '<span style="color:#ffaa00">')
      .replace(/§7/g, '<span style="color:#aaaaaa">')
      .replace(/§8/g, '<span style="color:#555555">')
      .replace(/§9/g, '<span style="color:#5555ff">')
      .replace(/§a/g, '<span style="color:#55ff55">')
      .replace(/§b/g, '<span style="color:#55ffff">')
      .replace(/§c/g, '<span style="color:#ff5555">')
      .replace(/§d/g, '<span style="color:#ff55ff">')
      .replace(/§e/g, '<span style="color:#ffff55">')
      .replace(/§f/g, '<span style="color:#ffffff">')
      .replace(/§l/g, '<span style="font-weight:bold">')
      .replace(/§r/g, '</span>');
  }

  copyToClipboard(text) {
    // Only copy host or host:port cleanly
    const cleanText = text.replace(/^IP:\s*/i, '').trim();

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(cleanText).then(() => {
        this.showToast(`IP ${cleanText} copiato con successo!`);
      }).catch(() => {
        this.fallbackCopy(cleanText);
      });
    } else {
      this.fallbackCopy(cleanText);
    }
  }

  fallbackCopy(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      this.showToast(`IP ${text} copiato con successo!`);
    } catch (err) {
      prompt('Copia manualmente l\'indirizzo del server:', text);
    } finally {
      document.body.removeChild(textArea);
    }
  }

  showToast(message) {
    if (!this.copyToast) return;
    const descEl = this.copyToast.querySelector('.toast-desc');
    if (descEl) descEl.textContent = message;

    this.copyToast.classList.add('show');
    clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => {
      this.copyToast.classList.remove('show');
    }, 3500);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.serverMonitor = new ServerMonitor();
});
