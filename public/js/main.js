/**
 * Oltre il Portale - Main Application Controller
 * Handles UI interactions, Realm Switching, Video Modal, Sound Generator & Mobile Nav
 */

// Global Configuration
window.PORTAL_CONFIG = {
  // If you have a YouTube / Vimeo / MP4 link, paste it here!
  // Example: "https://www.youtube.com/embed/dQw4w9WgXcQ" or "https://youtu.be/..."
  // You can also pass ?video=https://... in the browser URL!
  VIDEO_URL: "",
  SERVER_IP: "minecraft.guidelli.net:25565"
};

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initRealmSwitcher();
  initVideoPlayer();
  initModals();
  initAmbientSound();
});

/* =====================================================================
   1. MOBILE MENU DRAWER
   ===================================================================== */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-toggle');
  const drawer = document.getElementById('mobile-drawer');
  const closeBtn = document.getElementById('drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* =====================================================================
   2. REALM SWITCHER (OVERWORLD VS SOTTOMONDO)
   ===================================================================== */
function initRealmSwitcher() {
  const tabs = document.querySelectorAll('.realm-tab-btn');
  const overworldCard = document.getElementById('realm-overworld');
  const underworldCard = document.getElementById('realm-underworld');

  if (!tabs.length || !overworldCard || !underworldCard) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const realm = tab.getAttribute('data-realm');

      // Update tab active state
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Update views
      if (realm === 'overworld') {
        overworldCard.classList.add('active');
        underworldCard.classList.remove('active');
      } else {
        underworldCard.classList.add('active');
        overworldCard.classList.remove('active');
      }
    });
  });
}

/* =====================================================================
   3. VIDEO TRAILER PLAYER
   ===================================================================== */
function initVideoPlayer() {
  const placeholder = document.getElementById('video-placeholder');
  const iframe = document.getElementById('video-iframe');
  const triggerBtn = document.getElementById('play-trigger-btn');

  // Check URL query parameters for video (?video=...)
  const urlParams = new URLSearchParams(window.location.search);
  const paramVideo = urlParams.get('video');
  if (paramVideo) {
    window.PORTAL_CONFIG.VIDEO_URL = paramVideo;
  }

  function formatEmbedUrl(url) {
    if (!url) return '';
    // YouTube standard or short link converter
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    if (url.includes('youtube.com/shorts/')) {
      const id = url.split('youtube.com/shorts/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
    }
    return url;
  }

  function launchVideo() {
    const rawUrl = window.PORTAL_CONFIG.VIDEO_URL;

    if (rawUrl && rawUrl.trim() !== '') {
      const embedUrl = formatEmbedUrl(rawUrl);
      if (iframe) {
        iframe.src = embedUrl;
        iframe.classList.remove('hidden');
        if (placeholder) placeholder.style.display = 'none';
      }
    } else {
      // Prompt user or display informative note that link will be added
      const userLink = prompt(
        "Inserisci qui il link del video / trailer di Oltre il Portale:\n(Es. link YouTube, Vimeo o video diretto MP4)",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
      );

      if (userLink && userLink.trim() !== '') {
        window.PORTAL_CONFIG.VIDEO_URL = userLink.trim();
        const embedUrl = formatEmbedUrl(userLink.trim());
        if (iframe) {
          iframe.src = embedUrl;
          iframe.classList.remove('hidden');
          if (placeholder) placeholder.style.display = 'none';
        }
      }
    }
  }

  if (placeholder) placeholder.addEventListener('click', launchVideo);
  if (triggerBtn) triggerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    launchVideo();
  });
}

/* =====================================================================
   4. MODALS (RULES & FAQ)
   ===================================================================== */
function initModals() {
  const openRulesBtn = document.getElementById('open-rules-modal');
  const rulesModal = document.getElementById('rules-modal');
  const closeRulesBtn = document.getElementById('rules-modal-close');
  const ackRulesBtn = document.getElementById('rules-modal-ack');

  if (!rulesModal) return;

  function openModal() {
    rulesModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    rulesModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (openRulesBtn) openRulesBtn.addEventListener('click', openModal);
  if (closeRulesBtn) closeRulesBtn.addEventListener('click', closeModal);
  if (ackRulesBtn) ackRulesBtn.addEventListener('click', closeModal);

  rulesModal.addEventListener('click', (e) => {
    if (e.target === rulesModal) closeModal();
  });

  // ESC key listener
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rulesModal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* =====================================================================
   5. AMBIENT PORTAL SOUND GENERATOR (Web Audio API Synthesizer)
   Creates an ethereal mystic drone without needing external mp3 files!
   ===================================================================== */
function initAmbientSound() {
  const soundBtn = document.getElementById('sound-toggle');
  const soundIconOff = document.getElementById('sound-icon-off');
  const soundIconOn = document.getElementById('sound-icon-on');
  if (!soundBtn) return;

  let audioCtx = null;
  let isPlaying = false;
  let masterGain = null;
  let osc1, osc2, oscSub, filter;

  function startSoundscape() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      // Master Gain
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.07, audioCtx.currentTime + 3);

      // Low pass filter to give mystical deep atmosphere
      filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, audioCtx.currentTime);
      filter.Q.setValueAtTime(4, audioCtx.currentTime);

      // Oscillator 1: Root Drone (D2 ~ 73.42 Hz)
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(73.42, audioCtx.currentTime);

      // Oscillator 2: Fifth Drone (A2 ~ 110 Hz with subtle detune)
      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(110.0, audioCtx.currentTime);
      osc2.detune.setValueAtTime(6, audioCtx.currentTime);

      // Sub Bass Oscillator (D1 ~ 36.71 Hz)
      oscSub = audioCtx.createOscillator();
      oscSub.type = 'triangle';
      oscSub.frequency.setValueAtTime(36.71, audioCtx.currentTime);

      // LFO for gentle breathing filter modulation
      const lfo = audioCtx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, audioCtx.currentTime); // very slow cycle
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.setValueAtTime(80, audioCtx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();

      // Connect graph
      osc1.connect(filter);
      osc2.connect(filter);
      oscSub.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(audioCtx.destination);

      osc1.start();
      osc2.start();
      oscSub.start();

      isPlaying = true;
      soundBtn.classList.add('playing');
      if (soundIconOff) soundIconOff.classList.add('hidden');
      if (soundIconOn) soundIconOn.classList.remove('hidden');
    } catch (e) {
      console.warn('Web Audio Ambient error:', e);
    }
  }

  function stopSoundscape() {
    if (audioCtx && masterGain) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);
      setTimeout(() => {
        try {
          if (audioCtx) audioCtx.close();
        } catch (e) {}
        audioCtx = null;
      }, 1300);
    }
    isPlaying = false;
    soundBtn.classList.remove('playing');
    if (soundIconOff) soundIconOff.classList.remove('hidden');
    if (soundIconOn) soundIconOn.classList.add('hidden');
  }

  soundBtn.addEventListener('click', () => {
    if (!isPlaying) {
      startSoundscape();
    } else {
      stopSoundscape();
    }
  });
}
