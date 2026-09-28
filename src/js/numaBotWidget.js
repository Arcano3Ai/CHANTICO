import { processBotQuery } from './numaBotEngine.js';

import mascotNeutral from '../../assets/images/bot/toltec_bot_neutral.png';
import mascotThinking from '../../assets/images/bot/toltec_bot_thinking.png';
import mascotExplaining from '../../assets/images/bot/toltec_bot_explaining.png';
import mascotGreeting from '../../assets/images/bot/toltec_bot_greeting.png';
import mascotResting from '../../assets/images/bot/toltec_bot_resting.png';
import mascotConfirmation from '../../assets/images/bot/toltec_bot_confirmation.png';
import mascotConfused from '../../assets/images/bot/toltec_bot_confused.png';
import mascotGoodbye from '../../assets/images/bot/toltec_bot_goodbye.png';

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

export class NumaBotWidget {
  constructor(options = {}) {
    this.onOpenProduct = options.onOpenProduct || (() => {});
    this.onAddToCart = options.onAddToCart || (() => {});
    this.isOpen = false;
    this.messages = [];
    this.currentState = 'greeting';
    this.idleTimer = null;
    this.launcherCycleTimer = null;

    this.initDOM();
    this.bindEvents();
    this.sendInitialGreeting();
    this.startLauncherCycle();
  }

  /**
   * Cambia el estado visual de la mascota en el header y launcher
   */
  setMascotState(stateKey) {
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
   * Construye el DOM del launcher y la ventana flotante
   */
  initDOM() {
    if (document.getElementById('numa-bot-launcher')) return;

    // 1. Launcher Flotante con Mascota Tolteca
    const launcher = document.createElement('div');
    launcher.id = 'numa-bot-launcher';
    launcher.className = 'numa-bot-launcher';
    launcher.setAttribute('role', 'button');
    launcher.setAttribute('aria-label', 'Abrir Nahual Guía CHANTICO');
    launcher.setAttribute('title', 'Nahual Guía CHANTICO · Tarot Tolteca & Fuego Sagrado');
    launcher.innerHTML = `
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
  }

  /**
   * Vincula los escuchadores de eventos
   */
  bindEvents() {
    this.launcherEl.addEventListener('click', () => this.toggle());

    // Al pasar el mouse en el launcher, saludar alegremente
    this.launcherEl.addEventListener('mouseenter', () => {
      if (!this.isOpen) {
        const launcherImg = document.getElementById('toltec-mascot-launcher');
        if (launcherImg) launcherImg.src = TOLTEC_MASCOT_STATES.greeting.src;
      }
    });

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
