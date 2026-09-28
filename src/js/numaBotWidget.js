import { processBotQuery } from './numaBotEngine.js';
import { triggerSacredFeedback, triggerHaptic } from './sensoryEngine.js';

import mascotNeutral from '../../assets/images/bot/toltec_bot_neutral.png';
import mascotThinking from '../../assets/images/bot/toltec_bot_thinking.png';
import mascotExplaining from '../../assets/images/bot/toltec_bot_explaining.png';
import mascotGreeting from '../../assets/images/bot/toltec_bot_greeting.png';
import mascotResting from '../../assets/images/bot/toltec_bot_resting.png';
import mascotConfirmation from '../../assets/images/bot/toltec_bot_confirmation.png';
import mascotConfused from '../../assets/images/bot/toltec_bot_confused.png';
import mascotGoodbye from '../../assets/images/bot/toltec_bot_goodbye.png';

// Los 4 Nahuales Guardianes Sagrados de CHANTICO
import nahualJaguar from '../../assets/images/nahuales/nahual_ocelotl_jaguar.png';
import nahualDragon from '../../assets/images/nahuales/nahual_xiuhcoatl_dragon.png';
import nahualGato from '../../assets/images/nahuales/nahual_miztli_gato.png';
import nahualQuetzal from '../../assets/images/nahuales/nahual_cuauhtli_quetzal.png';

export const AVAILABLE_NAHUAL_AVATARS = [
  {
    id: 'tolteca',
    name: 'Máscara Sagrada Tolteca',
    shortName: 'Máscara Tolteca',
    icon: '🎭',
    src: mascotGreeting,
    greeting: '¡Niltze! Soy el Guardián de la Máscara Tolteca de Jade y Turquesa. Custodio del fuego sagrado de Chantico y la sabiduría ancestral de Tula. 🎭✨'
  },
  {
    id: 'ocelotl',
    name: 'Ocelotl · Jaguar',
    shortName: 'Jaguar',
    icon: '🐆',
    src: nahualJaguar,
    greeting: '¡Niltze! Soy Ocelotl, el Jaguar Sagrado de fuego. Te acompaño con fuerza, valentía y liderazgo. 🐆'
  },
  {
    id: 'xiuhcoatl',
    name: 'Xiuhcóatl · Dragón',
    shortName: 'Dragón',
    icon: '🐉',
    src: nahualDragon,
    greeting: '¡Niltze! Soy Xiuhcóatl, el Dragón Esmeralda. Despierto en ti la visión profunda y la alquimia interior. 🐉'
  },
  {
    id: 'miztli',
    name: 'Miztli · Tonal Rosa',
    shortName: 'Gatito Rosa',
    icon: '🐱',
    src: nahualGato,
    greeting: '¡Niltze! Soy Miztli, el felino místico del tonal. Traigo armonía, amor incondicional y dulzura a tu ser. 🐱'
  },
  {
    id: 'cuauhtli',
    name: 'Cuauhtli · Quetzal',
    shortName: 'Quetzal',
    icon: '🪶',
    src: nahualQuetzal,
    greeting: '¡Niltze! Soy Cuauhtli Quetzal, espíritu alado de las alturas. Elevo tu mente hacia la libertad y la luz cósmica. 🪶'
  }
];

/**
 * Estados de la Mascota / Nahual Sagrado de CHANTICO (Edición Ultra HD 2026)
 * 8 poses sagradas extraídas en alta definición con transparencia alfa
 */
export const TOLTEC_MASCOT_STATES = {
  neutral: {
    src: mascotNeutral,
    badge: '🐾 Nahual Atento',
    status: 'Sintonizado en vivo'
  },
  thinking: {
    src: mascotThinking,
    badge: '🔮 Consultando Fuego...',
    status: 'Canalizando sabiduría ancestral...'
  },
  explaining: {
    src: mascotExplaining,
    badge: '📜 Revelación Tolteca',
    status: 'Compartiendo mensaje sagrado'
  },
  greeting: {
    src: mascotGreeting,
    badge: '✨ Saludo Sagrado',
    status: '¡Bienvenida a CHANTICO!'
  },
  resting: {
    src: mascotResting,
    badge: '🕊️ En Calma',
    status: 'Esperando tu consulta'
  },
  confirmation: {
    src: mascotConfirmation,
    badge: '👍 En Perfecta Sintonía',
    status: 'Resonancia confirmada'
  },
  confused: {
    src: mascotConfused,
    badge: '❓ Buscando Vibración',
    status: 'Sintiendo tu energía...'
  },
  goodbye: {
    src: mascotGoodbye,
    badge: '👋 Hasta Pronto',
    status: 'Que el fuego sagrado te acompañe'
  }
};

/**
 * Voces y palabras sagradas en lengua Tolteca / Náhuatl clásico que expresa el Nahual
 */
export const TOLTEC_VOICES = [
  { toltec: '«¡Niltze! Cualli tonalli»', trans: '¡Saludos! Que tu luz sea propicia ✨', badge: '🗣️ ¡Niltze!' },
  { toltec: '«¡Nican ca moyollo! ¿Tinechitta?»', trans: '¡Aquí está tu nahual! ¿Me ves? 👋', badge: '👀 ¿Tinechitta?' },
  { toltec: '«¡Xipantlaza moyolotl!»', trans: '¡Despierta el fuego en tu corazón! 🔥', badge: '🔥 Moyolotl' },
  { toltec: '«¡Toteotl mitzpalehuiltz!»', trans: '¡La energía sagrada te acompaña! 🔮', badge: '✨ Toteotl' },
  { toltec: '«¡Tlazohcamati, noikniuh!»', trans: '¡Gracias desde el corazón, hermane! 🙏', badge: '💛 Tlazohcamati' },
  { toltec: '«¡Chantico tlazotla!»', trans: '¡El fuego de Chantico protege tu hogar! 🕯️', badge: '🛡️ Chantico' },
  { toltec: '«¡Yolotl ihuan tlamatiliztli!»', trans: '¡Sabiduría y corazón ancestral! 📜', badge: '🦅 Tlamatiliztli' }
];

export class NumaBotWidget {
  constructor(options = {}) {
    this.onOpenProduct = options.onOpenProduct || (() => {});
    this.onAddToCart = options.onAddToCart || (() => {});
    this.isOpen = false;
    this.messages = [];
    this.currentState = 'greeting';
    this.idleTimer = null;
    this.launcherCycleTimer = null;
    this.calloutDismissTimer = null;
    this.toltecVoiceTimer = null;
    this.currentVoiceIdx = 0;
    this.activeNahualId = localStorage.getItem('chantico_active_nahual') || 'tolteca';

    this.initDOM();
    this.bindEvents();
    this.sendInitialGreeting();
    this.startLauncherCycle();

    // Aplicar nahual guardado si existe
    if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
      this.applyActiveNahualAvatar(this.activeNahualId, false);
    }

    // Saludo proactivo del Nahual hablando en lengua Tolteca
    setTimeout(() => {
      this.showProactiveGreeting();
    }, 3200);

    // Ciclo periódico de palabras sagradas en Tolteca
    this.startToltecVoiceCycle();
  }

  /**
   * Cambia el estado visual de la mascota en el header y launcher
   */
  setMascotState(stateKey) {
    // Si hay un nahual personalizado activo (Jaguar, Dragón, etc.), se preserva su avatar
    if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
      const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
      if (activeNahual) {
        const headerAvatar = document.getElementById('toltec-avatar-header');
        if (headerAvatar) headerAvatar.src = activeNahual.src;
        const launcherImg = document.getElementById('toltec-mascot-launcher');
        if (launcherImg && !this.isOpen) launcherImg.src = activeNahual.src;
        return;
      }
    }

    const state = TOLTEC_MASCOT_STATES[stateKey];
    if (!state) return;

    this.currentState = stateKey;

    // Actualizar avatar en el header del chat
    const headerAvatar = document.getElementById('toltec-avatar-header');
    if (headerAvatar) {
      headerAvatar.src = state.src;
      headerAvatar.classList.remove('toltec-mascot-pop');
      void headerAvatar.offsetWidth;
      headerAvatar.classList.add('toltec-mascot-pop');
    }

    // Actualizar texto de estado
    const statusText = document.getElementById('toltec-status-text');
    if (statusText) {
      statusText.textContent = state.status;
    }

    // Actualizar badge
    const badgeEl = document.getElementById('numa-bot-badge');
    if (badgeEl && !this.isOpen) {
      badgeEl.textContent = state.badge;
    }

    // Actualizar imagen en el launcher
    const launcherImg = document.getElementById('toltec-mascot-launcher');
    if (launcherImg) {
      launcherImg.src = state.src;
    }

    // Programar regreso a 'resting' si no es thinking o greeting inicial
    if (stateKey !== 'resting' && stateKey !== 'thinking') {
      clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => {
        if (this.isOpen) {
          this.setMascotState('resting');
        }
      }, 5000);
    }
  }

  /**
   * Cicla poses de la mascota en el launcher mientras el chat está cerrado
   */
  startLauncherCycle() {
    const cycleStates = ['greeting', 'neutral', 'confirmation', 'resting'];
    let idx = 0;

    this.launcherCycleTimer = setInterval(() => {
      if (this.isOpen) return; // No ciclar launcher si el chat está abierto

      // Si hay un nahual personalizado activo (Jaguar, Dragón, etc.), mantener su imagen y realizar micro-movimientos
      if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
        const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
        const launcherImg = document.getElementById('toltec-mascot-launcher');
        const badgeEl = document.getElementById('numa-bot-badge');

        if (launcherImg && activeNahual) {
          launcherImg.src = activeNahual.src;
          launcherImg.classList.remove('toltec-mascot-pop');
          void launcherImg.offsetWidth;
          launcherImg.classList.add('toltec-mascot-pop');
        }

        if (badgeEl && activeNahual) {
          const nahualBadges = [
            `${activeNahual.icon} ${activeNahual.shortName}`,
            '✨ En sintonía',
            '🔥 Nahual Guía',
            '🔮 Sabiduría Viva'
          ];
          idx = (idx + 1) % nahualBadges.length;
          badgeEl.textContent = nahualBadges[idx];
        }
        return;
      }

      idx = (idx + 1) % cycleStates.length;
      const nextState = cycleStates[idx];
      const launcherImg = document.getElementById('toltec-mascot-launcher');
      const badgeEl = document.getElementById('numa-bot-badge');

      if (launcherImg) {
        launcherImg.classList.remove('toltec-mascot-pop');
        void launcherImg.offsetWidth;
        launcherImg.src = TOLTEC_MASCOT_STATES[nextState].src;
        launcherImg.classList.add('toltec-mascot-pop');
      }

      if (badgeEl) {
        badgeEl.textContent = TOLTEC_MASCOT_STATES[nextState].badge;
      }
    }, 3200);
  }

  /**
   * Cicla dinámicamente las diferentes posiciones o movimientos del Nahual cuando el usuario pasa el mouse por encima (Hover interactivo)
   */
  startHoverMascotCycle() {
    if (this.isOpen) return;
    this.stopHoverMascotCycle();

    // Si tiene un Nahual personalizado activo (Jaguar, Dragón, Gatito, Quetzal)
    if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
      const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
      const launcherImg = document.getElementById('toltec-mascot-launcher');
      const badgeEl = document.getElementById('numa-bot-badge');

      if (launcherImg && activeNahual) {
        launcherImg.src = activeNahual.src;
        launcherImg.classList.add('toltec-mascot-waving');
      }
      if (badgeEl && activeNahual) {
        badgeEl.textContent = `👋 ¡Hola! Soy ${activeNahual.shortName}`;
      }
      return;
    }

    const hoverPoses = [
      'greeting',
      'explaining',
      'confirmation',
      'thinking',
      'goodbye',
      'neutral'
    ];
    let hoverIdx = 0;

    const launcherImg = document.getElementById('toltec-mascot-launcher');
    const badgeEl = document.getElementById('numa-bot-badge');

    const advanceFrame = () => {
      if (this.isOpen) {
        this.stopHoverMascotCycle();
        return;
      }
      hoverIdx = (hoverIdx + 1) % hoverPoses.length;
      const stateKey = hoverPoses[hoverIdx];
      const state = TOLTEC_MASCOT_STATES[stateKey];

      if (launcherImg && state) {
        launcherImg.src = state.src;
      }
      if (badgeEl && state) {
        badgeEl.textContent = state.badge;
      }
    };

    advanceFrame();
    this.hoverCycleTimer = setInterval(advanceFrame, 240);
  }

  stopHoverMascotCycle() {
    if (this.hoverCycleTimer) {
      clearInterval(this.hoverCycleTimer);
      this.hoverCycleTimer = null;
    }
    const launcherImg = document.getElementById('toltec-mascot-launcher');
    if (launcherImg) {
      launcherImg.classList.remove('toltec-mascot-waving');
      if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
        const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
        if (activeNahual) launcherImg.src = activeNahual.src;
      }
    }
  }

  /**
   * Cambia la voz y frase sagrada en lengua Tolteca que expresa el Nahual
   */
  setToltecVoice(index = 0) {
    this.currentVoiceIdx = index % TOLTEC_VOICES.length;
    const voice = TOLTEC_VOICES[this.currentVoiceIdx];
    const toltecEl = document.getElementById('numa-bot-callout-toltec');
    const transEl = document.getElementById('numa-bot-callout-trans');
    const badgeEl = document.getElementById('numa-bot-badge');

    if (toltecEl) toltecEl.textContent = voice.toltec;
    if (transEl) transEl.textContent = voice.trans;
    if (badgeEl && !this.isOpen) badgeEl.textContent = voice.badge;
  }

  /**
   * Cicla periódicamente las palabras sagradas en lengua Tolteca
   */
  startToltecVoiceCycle() {
    this.toltecVoiceTimer = setInterval(() => {
      if (this.isOpen) return;
      this.currentVoiceIdx = (this.currentVoiceIdx + 1) % TOLTEC_VOICES.length;
      this.setToltecVoice(this.currentVoiceIdx);
    }, 7000);
  }

  /**
   * Saludo proactivo animado: El Nahual saluda con su patita y habla en lengua Tolteca
   */
  showProactiveGreeting() {
    if (this.isOpen) return;
    const callout = document.getElementById('numa-bot-callout');
    const launcherImg = document.getElementById('toltec-mascot-launcher');

    this.setToltecVoice(0);

    if (launcherImg) {
      launcherImg.src = TOLTEC_MASCOT_STATES.greeting.src;
      launcherImg.classList.add('toltec-mascot-waving');
    }
    if (callout) {
      callout.classList.add('is-visible');
    }

    // Ocultar suavemente después de 9 segundos si no se interactúa
    this.calloutDismissTimer = setTimeout(() => {
      this.hideCallout();
    }, 9000);
  }

  hideCallout() {
    const callout = document.getElementById('numa-bot-callout');
    const launcherImg = document.getElementById('toltec-mascot-launcher');
    if (callout) {
      callout.classList.remove('is-visible');
    }
    if (launcherImg) {
      launcherImg.classList.remove('toltec-mascot-waving');
    }
    if (this.calloutDismissTimer) {
      clearTimeout(this.calloutDismissTimer);
      this.calloutDismissTimer = null;
    }
  }

  /**
   * Construye el DOM del launcher y la ventana flotante
   */
  initDOM() {
    if (document.getElementById('numa-bot-launcher')) return;

    const initialVoice = TOLTEC_VOICES[0];

    // 1. Launcher Flotante con Mascota Tolteca
    const launcher = document.createElement('div');
    launcher.id = 'numa-bot-launcher';
    launcher.className = 'numa-bot-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Abrir Nahual Guía CHANTICO');
    launcher.setAttribute('title', 'Nahual Guía CHANTICO · Tarot Tolteca & Fuego Sagrado');
    launcher.innerHTML = `
      <!-- Burbuja de voz en lengua Tolteca del Nahual -->
      <div class="numa-bot-callout is-visible" id="numa-bot-callout" role="tooltip" aria-label="El Nahual habla en lengua Tolteca">
        <div class="numa-bot-callout-bubble">
          <span class="numa-bot-callout-toltec" id="numa-bot-callout-toltec">${initialVoice.toltec}</span>
          <span class="numa-bot-callout-trans" id="numa-bot-callout-trans">${initialVoice.trans}</span>
        </div>
        <button type="button" class="numa-bot-callout-close" id="numa-bot-callout-close" aria-label="Cerrar saludo">&times;</button>
      </div>

      <div class="numa-bot-launcher-icon">
        <img
          id="toltec-mascot-launcher"
          src="${mascotGreeting}"
          alt="Nahual Guía CHANTICO"
          class="toltec-mascot-img toltec-mascot-pop"
        />
      </div>
      <div class="numa-bot-launcher-text">
        <span class="numa-bot-launcher-title">Nahual Guía CHANTICO</span>
        <span class="numa-bot-launcher-sub">Sabiduría Ancestral & Fuego</span>
      </div>
      <span class="numa-bot-badge" id="numa-bot-badge">✨ Saludo Sagrado</span>
    `;

    // 2. Ventana de Chat Flotante
    const chatWindow = document.createElement('div');
    chatWindow.id = 'numa-bot-window';
    chatWindow.className = 'numa-bot-window';
    chatWindow.setAttribute('aria-hidden', 'true');
    chatWindow.innerHTML = `
      <header class="numa-bot-header">
        <div class="numa-bot-header-info">
          <div class="numa-bot-avatar" title="Nahual Guía CHANTICO">
            <img
              id="toltec-avatar-header"
              src="${mascotGreeting}"
              alt="Nahual Guía CHANTICO"
              class="toltec-avatar-mascot toltec-mascot-pop"
            />
          </div>
          <div class="numa-bot-header-titles">
            <h4 class="numa-bot-title">Nahual Guía CHANTICO</h4>
            <div class="numa-bot-status">
              <span class="numa-bot-status-dot"></span>
              <span id="toltec-status-text">¡Bienvenida a CHANTICO!</span>
            </div>
          </div>
        </div>
        <div class="numa-bot-header-actions">
          <button class="numa-bot-btn-icon" id="numa-bot-nahual-picker-btn" title="Cambiar Nahual Guía (Jaguar, Dragón, Gatito, Quetzal)" aria-label="Cambiar Nahual Guía">
            <span id="numa-nahual-picker-icon" style="font-size: 1.15rem; line-height: 1;">🐾</span>
          </button>
          <button class="numa-bot-btn-icon" id="numa-bot-restart-btn" title="Reiniciar consulta ancestral">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
            </svg>
          </button>
          <button class="numa-bot-btn-icon" id="numa-bot-close-btn" title="Cerrar ventana">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </header>

      <!-- Selector Desplegable de Nahuales Guardianes -->
      <div class="numa-nahual-picker" id="numa-nahual-picker" style="display: none;">
        <div class="nahual-picker-header">
          <span>Elige tu Nahual Guía:</span>
          <button type="button" class="nahual-picker-close" id="numa-nahual-picker-close">&times;</button>
        </div>
        <div class="nahual-picker-grid" id="numa-nahual-picker-grid"></div>
      </div>

      <div class="numa-bot-messages" id="numa-bot-messages-list"></div>

      <div class="numa-bot-quick-replies" id="numa-bot-quick-replies"></div>

      <footer class="numa-bot-footer">
        <form class="numa-bot-form" id="numa-bot-form">
          <input
            type="text"
            id="numa-bot-input"
            class="numa-bot-input"
            placeholder="Pregunta a la Guía Tolteca sobre rituales, tarot o tu fecha natal..."
            autocomplete="off"
          />
          <button type="submit" class="numa-bot-send-btn" aria-label="Enviar mensaje a la Guía Tolteca">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </form>
      </footer>
    `;

    document.body.appendChild(launcher);
    document.body.appendChild(chatWindow);

    this.launcherEl = launcher;
    this.windowEl = chatWindow;
    this.messagesListEl = document.getElementById('numa-bot-messages-list');
    this.quickRepliesEl = document.getElementById('numa-bot-quick-replies');
    this.formEl = document.getElementById('numa-bot-form');
    this.inputEl = document.getElementById('numa-bot-input');

    this.renderNahualPicker();
  }

  /**
   * Renderiza el selector de los 5 Nahuales disponibles
   */
  renderNahualPicker() {
    const grid = document.getElementById('numa-nahual-picker-grid');
    if (!grid) return;

    grid.innerHTML = AVAILABLE_NAHUAL_AVATARS.map(n => `
      <div class="nahual-picker-option ${n.id === this.activeNahualId ? 'active' : ''}" data-nahual-id="${n.id}" title="${n.name}">
        <img src="${n.src}" alt="${n.name}" class="nahual-picker-img" />
        <span class="nahual-picker-name">${n.shortName}</span>
      </div>
    `).join('');

    grid.querySelectorAll('.nahual-picker-option').forEach(el => {
      el.addEventListener('click', () => {
        const id = el.getAttribute('data-nahual-id');
        this.selectNahualGuide(id);
      });
    });
  }

  /**
   * Cambia el Nahual Guía activo
   */
  selectNahualGuide(id) {
    const nahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === id) || AVAILABLE_NAHUAL_AVATARS[0];
    this.activeNahualId = nahual.id;
    localStorage.setItem('chantico_active_nahual', nahual.id);

    triggerSacredFeedback('resonance');
    this.applyActiveNahualAvatar(nahual.id, true);

    // Ocultar picker
    const picker = document.getElementById('numa-nahual-picker');
    if (picker) picker.style.display = 'none';

    this.renderNahualPicker();

    // Mensaje de saludo en el chat con la voz del Nahual elegido
    this.appendMessage('bot', `✨ **${nahual.name}** ha tomado la guía de tu consulta:\n\n${nahual.greeting}`);
  }

  applyActiveNahualAvatar(id, animate = true) {
    const nahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === id) || AVAILABLE_NAHUAL_AVATARS[0];
    this.activeNahualId = nahual.id;

    const pickerIcon = document.getElementById('numa-nahual-picker-icon');
    if (pickerIcon) pickerIcon.textContent = nahual.icon;

    const headerAvatar = document.getElementById('toltec-avatar-header');
    if (headerAvatar) {
      headerAvatar.src = nahual.src;
      if (animate) {
        headerAvatar.classList.remove('toltec-mascot-pop');
        void headerAvatar.offsetWidth;
        headerAvatar.classList.add('toltec-mascot-pop');
      }
    }

    const launcherImg = document.getElementById('toltec-mascot-launcher');
    if (launcherImg) {
      launcherImg.src = nahual.src;
      if (animate) {
        launcherImg.classList.remove('toltec-mascot-pop');
        void launcherImg.offsetWidth;
        launcherImg.classList.add('toltec-mascot-pop');
      }
    }

    const titleEl = document.querySelector('.numa-bot-title');
    if (titleEl) titleEl.textContent = `Nahual ${nahual.shortName}`;

    // Sincronizar botón del header de la página
    const headerThumb = document.getElementById('header-nahual-thumb');
    const headerTitle = document.getElementById('header-nahual-title');
    if (headerThumb) headerThumb.src = nahual.src;
    if (headerTitle) headerTitle.textContent = nahual.shortName;

    // Resplandor y borde del launcher según el elemento del Nahual
    const launcherIcon = document.querySelector('.numa-bot-launcher-icon');
    if (launcherIcon) {
      if (nahual.id === 'ocelotl') {
        launcherIcon.style.borderColor = '#FF9E00';
        launcherIcon.style.boxShadow = '0 0 20px rgba(255, 158, 0, 0.6), inset 0 0 10px rgba(255, 158, 0, 0.3)';
      } else if (nahual.id === 'xiuhcoatl') {
        launcherIcon.style.borderColor = '#00E676';
        launcherIcon.style.boxShadow = '0 0 20px rgba(0, 230, 118, 0.55), inset 0 0 10px rgba(0, 230, 118, 0.3)';
      } else if (nahual.id === 'miztli') {
        launcherIcon.style.borderColor = '#FF4081';
        launcherIcon.style.boxShadow = '0 0 20px rgba(255, 64, 129, 0.6), inset 0 0 10px rgba(255, 64, 129, 0.3)';
      } else if (nahual.id === 'cuauhtli') {
        launcherIcon.style.borderColor = '#7C4DFF';
        launcherIcon.style.boxShadow = '0 0 20px rgba(124, 77, 255, 0.6), inset 0 0 10px rgba(124, 77, 255, 0.3)';
      } else {
        launcherIcon.style.borderColor = 'var(--color-flame)';
        launcherIcon.style.boxShadow = '0 0 16px rgba(255, 183, 3, 0.4), inset 0 0 8px rgba(230, 38, 36, 0.35)';
      }
    }
  }

  /**
   * Vincula los escuchadores de eventos
   */
  bindEvents() {
    this.launcherEl.addEventListener('click', () => this.toggle());

    // Escuchar cambios de Nahual emitidos desde el modal o la cabecera
    window.addEventListener('chantico:nahualChanged', (e) => {
      const newNahualId = e.detail?.nahualId;
      if (newNahualId && newNahualId !== this.activeNahualId) {
        this.selectNahualGuide(newNahualId);
      }
    });

    // Botón para abrir / cerrar el selector de Nahuales
    const nahualPickerBtn = document.getElementById('numa-bot-nahual-picker-btn');
    const nahualPickerClose = document.getElementById('numa-nahual-picker-close');
    const nahualPicker = document.getElementById('numa-nahual-picker');

    if (nahualPickerBtn && nahualPicker) {
      nahualPickerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nahualPicker.style.display = (nahualPicker.style.display === 'none' || !nahualPicker.style.display) ? 'block' : 'none';
      });
    }

    if (nahualPickerClose && nahualPicker) {
      nahualPickerClose.addEventListener('click', (e) => {
        e.stopPropagation();
        nahualPicker.style.display = 'none';
      });
    }

    // Eventos para la burbuja proactiva de saludo
    const calloutEl = document.getElementById('numa-bot-callout');
    const calloutCloseBtn = document.getElementById('numa-bot-callout-close');

    if (calloutCloseBtn) {
      calloutCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideCallout();
      });
    }

    if (calloutEl) {
      calloutEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.hideCallout();
        this.open();
      });
    }

    // Al pasar el mouse en el launcher, cicla dinamicamente entre todas sus posiciones/poses
    this.launcherEl.addEventListener('mouseenter', () => {
      this.hideCallout();
      if (!this.isOpen) {
        this.startHoverMascotCycle();
      }
    });

    // Al retirar el mouse, detiene la animacion y vuelve a pose neutral o nahual activo
    this.launcherEl.addEventListener('mouseleave', () => {
      this.stopHoverMascotCycle();
      if (!this.isOpen) {
        const launcherImg = document.getElementById('toltec-mascot-launcher');
        const badgeEl = document.getElementById('numa-bot-badge');
        if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
          const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
          if (launcherImg && activeNahual) launcherImg.src = activeNahual.src;
          if (badgeEl && activeNahual) badgeEl.textContent = `${activeNahual.icon} ${activeNahual.shortName}`;
        } else {
          if (launcherImg) launcherImg.src = TOLTEC_MASCOT_STATES.neutral.src;
          if (badgeEl) badgeEl.textContent = TOLTEC_MASCOT_STATES.neutral.badge;
        }
      }
    });

    this.launcherEl.addEventListener('touchstart', () => {
      this.hideCallout();
      if (!this.isOpen) {
        const launcherImg = document.getElementById('toltec-mascot-launcher');
        if (this.activeNahualId && this.activeNahualId !== 'tolteca') {
          const activeNahual = AVAILABLE_NAHUAL_AVATARS.find(n => n.id === this.activeNahualId);
          if (launcherImg && activeNahual) launcherImg.src = activeNahual.src;
        } else {
          if (launcherImg) launcherImg.src = TOLTEC_MASCOT_STATES.greeting.src;
        }
      }
    }, { passive: true });

    document.getElementById('numa-bot-close-btn')?.addEventListener('click', () => {
      this.close();
    });

    document.getElementById('numa-bot-restart-btn')?.addEventListener('click', () => {
      this.messagesListEl.innerHTML = '';
      this.sendInitialGreeting();
    });

    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = this.inputEl.value.trim();
      if (!text) return;
      triggerHaptic('medium');
      this.inputEl.value = '';
      this.handleUserMessage(text);
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    this.isOpen = true;
    triggerSacredFeedback('bell');
    this.hideCallout();
    this.stopHoverMascotCycle();
    document.body.classList.add('numa-bot-active');
    this.windowEl.classList.add('is-open');
    this.windowEl.setAttribute('aria-hidden', 'false');
    if (this.launcherEl) this.launcherEl.classList.add('is-hidden');
    this.setMascotState('greeting');
    this.inputEl.focus();
    this.scrollToBottom();
  }

  close() {
    this.isOpen = false;
    triggerHaptic('soft');
    document.body.classList.remove('numa-bot-active');
    this.setMascotState('goodbye');
    this.windowEl.classList.remove('is-open');
    this.windowEl.setAttribute('aria-hidden', 'true');
    if (this.launcherEl) this.launcherEl.classList.remove('is-hidden');
    setTimeout(() => {
      if (!this.isOpen) this.setMascotState('resting');
    }, 2200);
  }

  sendInitialGreeting() {
    const greeting = processBotQuery('hola');
    this.setMascotState('greeting');
    this.appendMessage('bot', greeting.text, greeting.products);
    this.renderQuickReplies(greeting.quickReplies);
  }

  handleUserMessage(text) {
    // 1. Mensaje del usuario
    this.appendMessage('user', text);
    this.renderQuickReplies([]);

    // 2. Mascota pensando y mostrando animación
    this.setMascotState('thinking');
    this.showTypingIndicator();

    // 3. Procesar consulta
    setTimeout(() => {
      this.hideTypingIndicator();
      const result = processBotQuery(text);

      // Determinar la mejor pose de la mascota según la respuesta
      const lower = text.toLowerCase();
      if (lower.includes('hola') || lower.includes('inicio') || lower.includes('gracias')) {
        this.setMascotState('greeting');
      } else if (result.products && result.products.length > 0) {
        this.setMascotState('explaining');
      } else if (lower.includes('camino') || lower.includes('nahual') || /\d{1,2}[\/\-\.]\d{1,2}/.test(lower)) {
        this.setMascotState('confirmation');
      } else if (result.text.includes('Siento la resonancia') || result.text.includes('precisión')) {
        this.setMascotState('confused');
      } else {
        this.setMascotState('explaining');
      }

      this.appendMessage('bot', result.text, result.products);
      this.renderQuickReplies(result.quickReplies);
    }, 450);
  }

  showTypingIndicator() {
    const typing = document.createElement('div');
    typing.id = 'numa-bot-typing-indicator';
    typing.className = 'numa-bot-msg bot';
    typing.innerHTML = `
      <div class="numa-bot-typing">
        <img
          src="${mascotThinking}"
          alt="Nahual pensando..."
          class="numa-bot-typing-mascot"
        />
        <div class="numa-bot-typing-dots">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    this.messagesListEl.appendChild(typing);
    this.scrollToBottom();
  }

  hideTypingIndicator() {
    const typing = document.getElementById('numa-bot-typing-indicator');
    if (typing) typing.remove();
  }

  /**
   * Agrega un mensaje a la lista
   */
  appendMessage(role, rawText, products = []) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `numa-bot-msg ${role}`;

    const formattedHtml = this.formatMarkdown(rawText);

    let productsHtml = '';
    if (products && products.length > 0) {
      productsHtml = `
        <div class="numa-bot-products-wrap">
          ${products.map(p => `
            <div class="numa-bot-product-card" data-product-id="${p.id}">
              <img src="${p.image}" alt="${p.name}" class="numa-bot-prod-thumb" onerror="this.src='./assets/images/chantico_logo_oficial.jpg'" />
              <div class="numa-bot-prod-details">
                <div class="numa-bot-prod-name" title="${p.name}">${p.name}</div>
                <div class="numa-bot-prod-price">$${p.price} MXN</div>
              </div>
              <button class="numa-bot-prod-action" data-action="view" data-product-id="${p.id}">
                Ver
              </button>
            </div>
          `).join('')}
        </div>
      `;
    }

    msgDiv.innerHTML = `
      <div class="numa-bot-bubble">
        ${formattedHtml}
        ${productsHtml}
      </div>
    `;

    // Vincular clics en productos
    if (products && products.length > 0) {
      msgDiv.querySelectorAll('.numa-bot-prod-action').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          const prodId = btn.dataset.productId;
          if (prodId) {
            this.setMascotState('confirmation');
            this.onOpenProduct(prodId);
          }
        });
      });

      msgDiv.querySelectorAll('.numa-bot-product-card').forEach(card => {
        card.addEventListener('click', () => {
          const prodId = card.dataset.productId;
          if (prodId) {
            this.setMascotState('confirmation');
            this.onOpenProduct(prodId);
          }
        });
      });
    }

    this.messagesListEl.appendChild(msgDiv);
    this.scrollToBottom();
  }

  /**
   * Renderiza los botones de respuestas rápidas (Chips)
   */
  renderQuickReplies(replies = []) {
    this.quickRepliesEl.innerHTML = '';
    if (!replies || replies.length === 0) return;

    replies.forEach(replyText => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'numa-bot-chip';
      chip.textContent = replyText;
      chip.addEventListener('click', () => {
        this.handleUserMessage(replyText);
      });
      this.quickRepliesEl.appendChild(chip);
    });

    this.scrollToBottom();
  }

  /**
   * Formateador simple de Markdown para las burbujas
   */
  formatMarkdown(text = '') {
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Negritas
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Cursivas
    safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Listas con viñeta
    const lines = safe.split('\n');
    const processedLines = lines.map(line => {
      const trimmed = line.trim();
      if (trimmed.startsWith('• ')) {
        const itemContent = trimmed.substring(2);
        return `<div style="margin-left: 6px; margin-bottom: 3px;">• ${itemContent}</div>`;
      }
      return trimmed ? `<p>${trimmed}</p>` : '';
    });

    return processedLines.join('');
  }

  scrollToBottom() {
    requestAnimationFrame(() => {
      this.messagesListEl.scrollTop = this.messagesListEl.scrollHeight;
    });
  }
}
