import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { RITUALS } from '../data/rituals.js';
import { EXPERIENCES, UPCOMING_EXPERIENCES } from '../data/experiences.js';
import { JOURNAL_POSTS } from '../data/journal.js';
import { store } from './state.js';
import { initParticles } from './particles.js';
import { initSoundPlayer } from './soundPlayer.js';
import { BreathingRitualModal } from './breathingRitual.js';
import { CartDrawer } from './cartDrawer.js';
import { CheckoutModal } from './checkoutModal.js';
import { BookingSystem } from './bookingSystem.js';
import { QuickViewModal } from './quickViewModal.js';
import { JournalModal } from './journalModal.js';
import { SearchModal } from './searchModal.js';
import { getFullNumerologyReading } from './numerologyEngine.js';
import { themeEngine } from './themeEngine.js';
import { i18n } from '../i18n/i18nEngine.js';
import { NumaBotWidget } from './numaBotWidget.js';
import { initNumerologyCursor } from './numerologyCursor.js';
import { initMeditacionGuiada } from './meditacionGuiada.js';

document.addEventListener('DOMContentLoaded', () => {
  // 0. Inicializar Motor de Tema (Claro/Oscuro) y Sistema i18n
  themeEngine.init();
  i18n.init();

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetLang = btn.dataset.lang;
      if (targetLang) i18n.setLanguage(targetLang);
    });
  });

  // 1. Inicializar Canvas de Partículas & Estela de Números Sagrados en el Cursor
  initParticles('particles-canvas');
  initNumerologyCursor();

  // 2. Inicializar Audio de Cuencos, Canción Frecuencia del Ser & Meditaciones Guiadas
  initSoundPlayer();
  initMeditacionGuiada();


  // 3. Inicializar Modales
  const breathingModal = new BreathingRitualModal();
  let checkoutModal;
  const cartDrawer = new CartDrawer(() => {
    if (checkoutModal) checkoutModal.open();
  });
  checkoutModal = new CheckoutModal();
  const bookingSystem = new BookingSystem();
  const quickViewModal = new QuickViewModal(() => cartDrawer.open());
  const journalModal = new JournalModal();
  const searchModal = new SearchModal(
    (prodId) => quickViewModal.open(prodId),
    (postId) => journalModal.open(postId),
    (ritual) => breathingModal.start(ritual)
  );

  // Inicializar Guía Tolteca CHANTICO (Bot Autónomo de Tarot, Nahuales y Catálogo)
  const numaBot = new NumaBotWidget({
    onOpenProduct: (prodId) => quickViewModal.open(prodId),
    onAddToCart: (prodId) => {
      store.addToCart(prodId);
      cartDrawer.open();
    }
  });

  // Permitir abrir el bot desde cualquier botón con atributo data-open-bot
  document.querySelectorAll('[data-open-bot]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      numaBot.open();
    });
  });

  // 4. Header Scroll Detection
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // 5. Menú Móvil
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const mobileClose = document.getElementById('mobile-nav-close');

  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // 6. Renderizado de la Tienda & Filtros
  const productsContainer = document.getElementById('products-grid');
  const filterButtons = document.querySelectorAll('.category-filter-btn');
  let currentCategory = 'all';

  function renderProducts() {
    if (!productsContainer) return;

    const filtered = currentCategory === 'all'
      ? PRODUCTS
      : PRODUCTS.filter(p => p.category === currentCategory);

    productsContainer.innerHTML = filtered.map(p => `
      <div class="product-card" data-product-id="${p.id}">
        <div class="product-image-box">
          <img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.onerror=null; this.src='./assets/images/chantico_tarot_tolteca_cartas.png';">
          ${p.badge ? `<span class="badge badge-gold product-badge-pos">${p.badge}</span>` : ''}
          <button class="product-wishlist-btn ${store.isInWishlist(p.id) ? 'active' : ''}" data-wish-id="${p.id}" title="Favorito">
            ♥
          </button>
          <div class="product-quickview-overlay">
            <button class="btn btn-secondary btn-sm btn-quickview-trigger" data-id="${p.id}">
              ${i18n.t('btn_quick_view', 'VISTA RÁPIDA')}
            </button>
          </div>
        </div>
        <div class="product-content">
          <span class="product-category-label">${p.categoryLabel}</span>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-notes">${p.tagline}</p>
          <div class="product-bottom-row">
            <div class="product-price-box">
              <span class="product-price">$${p.price.toLocaleString('es-MX')} MXN</span>
              ${p.originalPrice ? `<span class="product-price-old">$${p.originalPrice.toLocaleString('es-MX')}</span>` : ''}
            </div>
            <button class="btn btn-primary btn-sm btn-add-cart" data-id="${p.id}">
              ${i18n.t('btn_add_cart', 'AGREGAR')}
            </button>
          </div>
        </div>
      </div>
    `).join('');

    // Eventos de botones
    productsContainer.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prod = PRODUCTS.find(p => p.id === btn.dataset.id);
        if (prod) {
          store.addToCart(prod);
          cartDrawer.open();
        }
      });
    });

    productsContainer.querySelectorAll('.btn-quickview-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        quickViewModal.open(btn.dataset.id);
      });
    });

    productsContainer.querySelectorAll('.product-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const active = store.toggleWishlist(btn.dataset.wishId);
        btn.classList.toggle('active', active);
      });
    });
  }

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderProducts();
    });
  });

  renderProducts();

  // Re-render dinámico de productos y componentes dependientes al cambiar idioma
  i18n.onLanguageChange(() => {
    renderProducts();
  });

  // 7. Sección de Rituales Interactivos
  const ritualTabs = document.querySelectorAll('.ritual-tab-btn');
  const ritualTitle = document.getElementById('ritual-display-title');
  const ritualSubtitle = document.getElementById('ritual-display-subtitle');
  const ritualIntention = document.getElementById('ritual-display-intention');
  const ritualSituationBadge = document.getElementById('ritual-display-situation-badge');
  const ritualSituation = document.getElementById('ritual-display-situation');
  const ritualMoment = document.getElementById('ritual-display-moment');
  const ritualDuration = document.getElementById('ritual-display-duration');
  const ritualFrequency = document.getElementById('ritual-display-frequency');
  const ritualCandle = document.getElementById('ritual-element-candle');
  const ritualAroma = document.getElementById('ritual-element-aroma');
  const ritualSoap = document.getElementById('ritual-element-soap');
  const ritualSound = document.getElementById('ritual-element-sound');
  const ritualSteps = document.getElementById('ritual-display-steps');
  const ritualQuote = document.getElementById('ritual-display-quote');
  const ritualIgTag = document.getElementById('ritual-display-ig-tag');
  const ritualStartBtn = document.getElementById('ritual-start-guide-btn');
  let currentRitual = RITUALS[0];

  function selectRitual(ritual) {
    currentRitual = ritual;
    if (ritualTitle) ritualTitle.textContent = ritual.title;
    if (ritualSubtitle) ritualSubtitle.textContent = ritual.subtitle;
    if (ritualIntention) ritualIntention.textContent = ritual.intention;
    if (ritualSituationBadge) ritualSituationBadge.textContent = ritual.situationBadge || 'Situación Específica';
    if (ritualSituation) ritualSituation.textContent = ritual.situation || '';
    if (ritualMoment) ritualMoment.textContent = ritual.idealMoment || '';
    if (ritualDuration) ritualDuration.textContent = ritual.duration || '';
    if (ritualFrequency) ritualFrequency.textContent = ritual.frequency || '';
    if (ritualCandle) ritualCandle.textContent = ritual.elements.candle;
    if (ritualAroma) ritualAroma.textContent = ritual.elements.aroma;
    if (ritualSoap) ritualSoap.textContent = ritual.elements.soap;
    if (ritualSound) ritualSound.textContent = ritual.elements.sound;
    if (ritualQuote) ritualQuote.textContent = ritual.quote;
    if (ritualIgTag) ritualIgTag.textContent = ritual.instagramTag || '#FrecuenciaDelSer';

    if (ritualSteps && Array.isArray(ritual.steps)) {
      ritualSteps.innerHTML = ritual.steps.map(step => `<li>${step}</li>`).join('');
    }
  }

  ritualTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ritualTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const ritual = RITUALS.find(r => r.id === tab.dataset.ritualId);
      if (ritual) selectRitual(ritual);
    });
  });

  if (ritualStartBtn) {
    ritualStartBtn.addEventListener('click', () => {
      if (currentRitual) breathingModal.start(currentRitual);
    });
  }

  // 8. Calculadora Interactiva de Numerología
  const numCalcForm = document.getElementById('numerology-calc-form');
  const numResultArea = document.getElementById('numerology-result-card');
  const numLifePathDisplay = document.getElementById('num-res-lifepath');
  const numTitleDisplay = document.getElementById('num-res-title');
  const numEssenceDisplay = document.getElementById('num-res-essence');
  const numFrequencyDisplay = document.getElementById('num-res-frequency');
  const numMantraDisplay = document.getElementById('num-res-mantra');
  const numDescDisplay = document.getElementById('num-res-desc');
  const numProductDisplay = document.getElementById('num-res-product');
  const numRitualDisplay = document.getElementById('num-res-ritual');
  const numYearDisplay = document.getElementById('num-res-year');
  const numSoulDisplay = document.getElementById('num-res-soul');

  if (numCalcForm) {
    numCalcForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const dateVal = document.getElementById('num-input-date')?.value;
      const nameVal = document.getElementById('num-input-name')?.value;

      if (!dateVal) {
        alert('Por favor introduce tu fecha de nacimiento.');
        return;
      }

      const reading = getFullNumerologyReading(dateVal, nameVal);
      if (!reading) return;

      if (numLifePathDisplay) numLifePathDisplay.textContent = reading.lifePathNumber;
      if (numTitleDisplay) numTitleDisplay.textContent = reading.archetype.title;
      if (numEssenceDisplay) numEssenceDisplay.textContent = reading.archetype.essence;
      if (numFrequencyDisplay) numFrequencyDisplay.textContent = reading.archetype.frequency;
      if (numMantraDisplay) numMantraDisplay.textContent = reading.archetype.mantra;
      if (numDescDisplay) numDescDisplay.textContent = reading.archetype.description;
      if (numProductDisplay) numProductDisplay.textContent = reading.archetype.recommendedProduct;
      if (numRitualDisplay) numRitualDisplay.textContent = reading.archetype.recommendedRitual;
      if (numYearDisplay) numYearDisplay.textContent = `Tu Año Personal actual es el ciclo ${reading.personalYear}`;
      if (numSoulDisplay && reading.soulNumber) {
        numSoulDisplay.textContent = `Tu Número del Alma es el ${reading.soulNumber}`;
        numSoulDisplay.style.display = 'inline-block';
      }

      if (numResultArea) {
        numResultArea.classList.add('active');
        numResultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // 9. Renderizado del Journal NÜMA
  const journalGrid = document.getElementById('journal-posts-grid');
  if (journalGrid) {
    journalGrid.innerHTML = JOURNAL_POSTS.map(post => `
      <article class="journal-card" data-post-id="${post.id}">
        <img src="${post.image}" alt="${post.title}" class="journal-thumb" loading="lazy">
        <div class="journal-body">
          <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--color-gold); text-transform: uppercase; letter-spacing: 0.14em; margin-bottom: 0.6rem;">
            <span>${post.category}</span>
            <span>${post.readTime}</span>
          </div>
          <h3 style="font-family: var(--font-serif-display); font-size: 1.2rem; color: var(--color-beige-light); margin-bottom: 0.75rem; line-height: 1.35;">
            ${post.title}
          </h3>
          <p style="font-size: 0.88rem; color: var(--color-text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
            ${post.excerpt}
          </p>
          <span style="font-size: 0.76rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gold); margin-top: auto;">
            LEER REFLEXIÓN →
          </span>
        </div>
      </article>
    `).join('');

    journalGrid.querySelectorAll('.journal-card').forEach(card => {
      card.addEventListener('click', () => {
        journalModal.open(card.dataset.postId);
      });
    });
  }

  // 10. Wishlist Drawer / Modal Trigger
  const wishlistBtn = document.getElementById('header-wishlist-btn');
  if (wishlistBtn) {
    wishlistBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (store.wishlist.length === 0) {
        alert('Aún no tienes elementos en tu lista de deseos.');
      } else {
        alert(`Tienes ${store.wishlist.length} artículo(s) sagrado(s) guardado(s) en tu lista.`);
      }
    });
  }

  // 11. Formulario de Contacto Directo hacia WhatsApp
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name')?.value.trim();
      const email = document.getElementById('contact-email')?.value.trim();
      const message = document.getElementById('contact-message')?.value.trim();

      const waMsg = `Hola CHANTICO 🔥 Mi nombre es ${name} (${email}).%0A%0AMensaje:%0A${message}`;
      window.open(`https://wa.me/5218441228140?text=${waMsg}`, '_blank');
      contactForm.reset();
      alert('¡Gracias por tu mensaje! Te hemos redirigido a WhatsApp para una atención personalizada.');
    });
  }

  // 12. Garantizar Reproducción Continua de Videos de Fondo (Hero y Footer)
  const bgVideos = document.querySelectorAll('.hero-video-bg, .footer-video-bg');
  bgVideos.forEach(v => {
    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute('playsinline', '');
    const tryPlay = () => {
      v.play().catch(() => {});
    };
    tryPlay();
    document.addEventListener('click', tryPlay, { once: true });
    document.addEventListener('touchstart', tryPlay, { once: true });
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tryPlay();
    });
  });
});
