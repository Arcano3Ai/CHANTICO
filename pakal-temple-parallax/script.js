/**
 * ============================================================================
 * PAKAL TUN — MOTOR PARALLAX TEMPLO MAYA (60 FPS PRODUCTION ENGINE)
 * Arquitectura modular: Smooth Lerp, Canvas Solar, Web Audio API & Storytelling
 * ============================================================================
 */

(function () {
  'use strict';

  // Configuración y estado global del motor
  const CONFIG = {
    ease: 0.085, // Factor de suavizado de inercia (0.05 a 0.12)
    maxAltitudeMeters: 54, // Altura del templo maya de Pakal en metros
    mobileBreakpoint: 768,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
  };

  const STATE = {
    scrollY: 0,
    targetScrollY: 0,
    maxScroll: 1,
    progress: 0,
    isAudioPlaying: false,
    audioContext: null,
    audioNodes: {},
    isTicking: false
  };

  // Referencias a elementos del DOM
  const DOM = {
    scrollContainer: document.querySelector('.scroll-container'),
    layerSky: document.querySelector('.layer-sky'),
    layerSunFlare: document.querySelector('.layer-sun-flare'),
    layerTemple: document.querySelector('.layer-temple'),
    layerExplorer: document.querySelector('.layer-explorer'),
    layerShrine: document.querySelector('.layer-shrine'),
    layerForeground: document.querySelector('.layer-foreground'),
    layerMist: document.querySelector('.layer-mist'),
    particlesCanvas: document.getElementById('sun-particles-canvas'),
    altimeterFill: document.querySelector('.altimeter-fill'),
    altimeterValue: document.querySelector('.altimeter-value'),
    altimeterGlyph: document.querySelector('.altimeter-glyph'),
    btnSoundToggle: document.getElementById('btn-sound-toggle'),
    scrollCue: document.querySelector('.scroll-indicator-cue'),
    storyCards: document.querySelectorAll('.story-card'),
    storySections: document.querySelectorAll('.story-section')
  };

  /**
   * 1. INICIALIZACIÓN PRINCIPAL
   */
  function init() {
    try {
      updateDimensions();
      window.addEventListener('resize', onResize, { passive: true });
      window.addEventListener('scroll', onNativeScroll, { passive: true });

      // Iniciar el Canvas de Partículas Solares
      initSunParticles();

      // Observador de visibilidad de historias (Fallback o scroll trigger)
      initStoryCardsObserver();

      // Configurar controles interactivos de audio y navegación
      initAudioControls();
      initKeyboardNavigation();

      // Iniciar el bucle de animación de 60 FPS con Lerp
      requestAnimationFrame(renderLoop);

      console.info('🏛️ PAKAL TUN Parallax Engine initialised successfully at 60 FPS.');
    } catch (err) {
      console.error('Error al inicializar PAKAL TUN Parallax Engine:', err);
    }
  }

  /**
   * 2. GESTIÓN DE DIMENSIONES Y SCROLL
   */
  function updateDimensions() {
    const docHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    const winHeight = window.innerHeight;
    STATE.maxScroll = Math.max(1, docHeight - winHeight);
  }

  function onResize() {
    updateDimensions();
    if (particlesInstance && particlesInstance.resize) {
      particlesInstance.resize();
    }
  }

  function onNativeScroll() {
    STATE.targetScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  }

  /**
   * 3. BUCLE DE RENDERIZADO 60 FPS (LERP INTERPOLATION)
   */
  function renderLoop() {
    try {
      if (CONFIG.reducedMotion) {
        // En modo accesible sin movimiento brusco, usamos scroll nativo directo
        STATE.scrollY = STATE.targetScrollY;
      } else {
        // Interpolación lineal suave para efecto cámara de cine
        STATE.scrollY += (STATE.targetScrollY - STATE.scrollY) * CONFIG.ease;
      }

      // Cálculo del progreso normalizado [0.0 -> 1.0]
      const rawProgress = STATE.scrollY / STATE.maxScroll;
      STATE.progress = Math.min(1, Math.max(0, rawProgress));

      // Actualizar capas visuales del templo
      updateParallaxLayers(STATE.progress);

      // Actualizar el HUD del Altímetro Maya
      updateAltimeterHUD(STATE.progress);

      // Ocultar cue inicial de scroll tras interactuar
      if (STATE.progress > 0.05 && DOM.scrollCue) {
        DOM.scrollCue.style.opacity = '0';
        DOM.scrollCue.style.pointerEvents = 'none';
      } else if (DOM.scrollCue) {
        DOM.scrollCue.style.opacity = '1';
      }

    } catch (loopErr) {
      console.warn('Advertencia en ciclo de animación parallax:', loopErr);
    }

    requestAnimationFrame(renderLoop);
  }

  /**
   * 4. TRANSFORMACIONES CINEMATOGRÁFICAS 3D POR CAPA
   * Simula el ascenso por la montaña hacia el santuario cúspide
   */
  function updateParallaxLayers(p) {
    if (CONFIG.reducedMotion) return;

    // --- Capa 0: Cielo y Amanecer ---
    // Se desplaza lentamente hacia arriba con sutil zoom out
    if (DOM.layerSky) {
      const skyY = -p * 90; // px
      const skyScale = 1.04 - (p * 0.03);
      DOM.layerSky.style.transform = `translate3d(0, ${skyY.toFixed(2)}px, 0) scale(${skyScale.toFixed(3)})`;
    }

    // --- Sol y God Rays ---
    // Se expanden y rotan sutilmente
    if (DOM.layerSunFlare) {
      const flareY = -p * 140;
      const flareRotate = p * 8; // grados
      const flareScale = 1.0 + (p * 0.18);
      const flareOpacity = 0.85 + Math.sin(p * Math.PI) * 0.2;
      DOM.layerSunFlare.style.transform = `translate3d(0, ${flareY.toFixed(2)}px, 0) rotate(${flareRotate.toFixed(1)}deg) scale(${flareScale.toFixed(2)})`;
      DOM.layerSunFlare.style.opacity = flareOpacity.toFixed(2);
    }

    // --- Capa 1: Templo Principal y Selva ---
    // Efecto Dolly-in: el templo se acerca mientras subes
    if (DOM.layerTemple) {
      const templeY = -p * 110;
      const templeScale = 1.0 + (p * 0.16);
      DOM.layerTemple.style.transform = `translate3d(0, ${templeY.toFixed(2)}px, 0) scale(${templeScale.toFixed(3)})`;
    }

    // --- Niebla volumétrica ---
    if (DOM.layerMist) {
      const mistY = -p * 60;
      DOM.layerMist.style.transform = `translate3d(0, ${mistY.toFixed(2)}px, 0)`;
    }

    // --- Capa 2: Explorador Ascendiendo por la Escalinata ---
    // Sube activamente por los peldaños hacia el templo
    if (DOM.layerExplorer) {
      // El explorador avanza verticalmente más rápido que la estructura
      const explorerY = -p * 270;
      // En perspectiva se empequeñece sutilmente al adentrarse hacia la cima
      const explorerScale = 1.0 - (p * 0.09);
      DOM.layerExplorer.style.transform = `translate3d(0, ${explorerY.toFixed(2)}px, 0) scale(${explorerScale.toFixed(3)})`;
    }

    // --- Capa 2B: Santuario Cúspide de Pakal ---
    // Al alcanzar el final, el rostro tallado brilla y se hace nítido
    if (DOM.layerShrine) {
      const shrineY = -p * 120;
      const shrineScale = 1.0 + (p * 0.22);
      const shrineOpacity = 0.45 + (p * 0.55);
      DOM.layerShrine.style.transform = `translate3d(0, ${shrineY.toFixed(2)}px, 0) scale(${shrineScale.toFixed(3)})`;
      DOM.layerShrine.style.opacity = shrineOpacity.toFixed(2);
    }

    // --- Capa 3: Primer Plano (Hojas Gigantes y Mascarón) ---
    // Se desplaza rápidamente hacia abajo y se abre a los lados
    if (DOM.layerForeground) {
      const fgY = p * 320;
      const fgScale = 1.0 + (p * 0.18);
      DOM.layerForeground.style.transform = `translate3d(0, ${fgY.toFixed(2)}px, 0) scale(${fgScale.toFixed(3)})`;
    }
  }

  /**
   * 5. HUD: ALTÍMETRO MAYA Y CÁLCULO DE ALTITUD
   */
  function updateAltimeterHUD(p) {
    if (!DOM.altimeterFill || !DOM.altimeterValue) return;

    // Porcentaje de la barra (horizontal en móvil, vertical en desktop)
    const pct = `${(p * 100).toFixed(1)}%`;
    if (window.innerWidth <= 768) {
      DOM.altimeterFill.style.width = pct;
      DOM.altimeterFill.style.height = '100%';
    } else {
      DOM.altimeterFill.style.height = pct;
      DOM.altimeterFill.style.width = '100%';
    }

    // Metros actuales de ascensión (0m a 54m)
    const currentMeters = Math.round(p * CONFIG.maxAltitudeMeters);
    DOM.altimeterValue.textContent = `${currentMeters}m`;

    // Glifos ceremoniales según la altitud
    if (DOM.altimeterGlyph) {
      if (p < 0.25) {
        DOM.altimeterGlyph.textContent = '🌱'; // Base de la selva
      } else if (p < 0.55) {
        DOM.altimeterGlyph.textContent = '🗿'; // Escalinata de piedra
      } else if (p < 0.82) {
        DOM.altimeterGlyph.textContent = '💎'; // Umbral de jade
      } else {
        DOM.altimeterGlyph.textContent = '☀️'; // Santuario solar de Pakal
      }
    }
  }

  /**
   * 6. INTERSECTION OBSERVER PARA STORY CARDS
   */
  function initStoryCardsObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback para navegadores antiguos: hacerlas visibles
      DOM.storyCards.forEach(card => card.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target.querySelector('.story-card');
          if (card) card.classList.add('visible');
        } else {
          // Opcional: fade-out al salir para sensación etérea continua
          const card = entry.target.querySelector('.story-card');
          if (card && entry.boundingClientRect.top > window.innerHeight * 0.8) {
            card.classList.remove('visible');
          }
        }
      });
    }, {
      threshold: 0.35
    });

    DOM.storySections.forEach(section => observer.observe(section));
  }

  /**
   * 7. CANVAS DE PARTÍCULAS SOLARES Y POLVO DE JADE
   */
  let particlesInstance = null;

  function initSunParticles() {
    const canvas = DOM.particlesCanvas;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width, height;
    let particles = [];
    const count = window.innerWidth < CONFIG.mobileBreakpoint ? 22 : 45;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      create();
    }

    function create() {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2.2 + 0.6,
          speedX: (Math.random() - 0.3) * 0.45,
          speedY: -Math.random() * 0.4 - 0.15, // Ascenso suave como vapor
          alpha: Math.random() * 0.65 + 0.2,
          pulse: Math.random() * Math.PI,
          pulseSpeed: Math.random() * 0.03 + 0.01,
          isJade: Math.random() > 0.65 // Mezcla de oro solar y jadeíta
        });
      }
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // Reacción de viento al scroll
      const scrollWind = (STATE.targetScrollY - STATE.scrollY) * 0.04;

      particles.forEach(p => {
        p.x += p.speedX + scrollWind;
        p.y += p.speedY;
        p.pulse += p.pulseSpeed;

        // Wrap around cíclico
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.max(0.08, Math.min(0.9, p.alpha + Math.sin(p.pulse) * 0.2));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isJade) {
          ctx.fillStyle = `rgba(61, 170, 110, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(61, 170, 110, 0.4)';
        } else {
          ctx.fillStyle = `rgba(255, 183, 3, ${currentAlpha})`;
          ctx.shadowColor = 'rgba(255, 183, 3, 0.45)';
        }
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      requestAnimationFrame(render);
    }

    resize();
    render();

    particlesInstance = { resize };
  }

  /**
   * 8. MOTOR DE AUDIO MÍSTICO AMBIENTAL (WEB AUDIO API PROCEDURAL)
   * Sintetizador sonoro sin dependencias externas: brisa selvática y campanas de jade
   */
  function initAudioControls() {
    if (!DOM.btnSoundToggle) return;

    DOM.btnSoundToggle.addEventListener('click', () => {
      toggleMysticAudio();
    });
  }

  function toggleMysticAudio() {
    if (!STATE.isAudioPlaying) {
      startMysticAudio();
    } else {
      stopMysticAudio();
    }
  }

  function startMysticAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        console.warn('Web Audio API no compatible.');
        return;
      }

      if (!STATE.audioContext) {
        STATE.audioContext = new AudioCtx();
      }

      if (STATE.audioContext.state === 'suspended') {
        STATE.audioContext.resume();
      }

      const ctx = STATE.audioContext;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.01, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + 3);
      masterGain.connect(ctx.destination);

      // Generador de viento selvático (Ruido rosa filtrado con paso bajo oscilante)
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2) * 0.11;
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const windFilter = ctx.createBiquadFilter();
      windFilter.type = 'lowpass';
      windFilter.frequency.setValueAtTime(320, ctx.currentTime);

      // LFO para oscilar la brisa
      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // Ciclo lento de respiración
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(lfoGain);
      lfoGain.connect(windFilter.frequency);

      whiteNoise.connect(windFilter);
      windFilter.connect(masterGain);

      whiteNoise.start();
      lfo.start();

      // Guardar nodos activos
      STATE.audioNodes = {
        masterGain,
        whiteNoise,
        lfo
      };

      // Intervalo de campanas de jade pentatónicas aleatorias
      const mayaNotes = [220.00, 261.63, 293.66, 329.63, 392.00]; // A3, C4, D4, E4, G4
      STATE.chimeInterval = setInterval(() => {
        if (!STATE.isAudioPlaying) return;
        const note = mayaNotes[Math.floor(Math.random() * mayaNotes.length)];
        playJadeChime(note, masterGain);
      }, 4200);

      STATE.isAudioPlaying = true;
      DOM.btnSoundToggle.classList.remove('sound-muted');
      const soundText = DOM.btnSoundToggle.querySelector('.sound-label');
      if (soundText) soundText.textContent = 'SILENCIAR';

    } catch (e) {
      console.error('Error al iniciar audio místico:', e);
    }
  }

  function playJadeChime(freq, destination) {
    if (!STATE.audioContext) return;
    const ctx = STATE.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.2);

    osc.connect(gain);
    gain.connect(destination);

    osc.start();
    osc.stop(ctx.currentTime + 3.3);
  }

  function stopMysticAudio() {
    if (STATE.audioNodes.masterGain && STATE.audioContext) {
      const ctx = STATE.audioContext;
      STATE.audioNodes.masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
      setTimeout(() => {
        if (STATE.audioNodes.whiteNoise) STATE.audioNodes.whiteNoise.stop();
        if (STATE.audioNodes.lfo) STATE.audioNodes.lfo.stop();
        if (STATE.chimeInterval) clearInterval(STATE.chimeInterval);
      }, 1000);
    }
    STATE.isAudioPlaying = false;
    DOM.btnSoundToggle.classList.add('sound-muted');
    const soundText = DOM.btnSoundToggle.querySelector('.sound-label');
    if (soundText) soundText.textContent = 'SONIDO';
  }

  /**
   * 9. NAVEGACIÓN POR TECLADO Y ACCESIBILIDAD
   */
  function initKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      const step = window.innerHeight * 0.7;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        window.scrollBy({ top: step, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        window.scrollBy({ top: -step, behavior: 'smooth' });
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMysticAudio();
      }
    });
  }

  // Ejecución segura al cargar el DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
