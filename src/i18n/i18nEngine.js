import { TRANSLATIONS } from './translations.js';

class I18nEngine {
  constructor() {
    this.currentLang = localStorage.getItem('numa_lang') || 'es';
    this.listeners = [];
  }

  init() {
    this.applyLanguage(this.currentLang);
  }

  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang] || TRANSLATIONS.es;
    return dict[key] || TRANSLATIONS.es[key] || fallback || key;
  }

  setLanguage(lang) {
    if (lang !== 'es' && lang !== 'en') return;
    this.currentLang = lang;
    localStorage.setItem('numa_lang', lang);
    this.applyLanguage(lang);
    this.notify();
  }

  getLanguage() {
    return this.currentLang;
  }

  applyLanguage(lang) {
    document.documentElement.lang = lang;
    const dict = TRANSLATIONS[lang] || TRANSLATIONS.es;

    // Actualizar elementos con data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.textContent = dict[key];
      }
    });

    // Actualizar placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Actualizar títulos o aria-labels
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key]) {
        el.setAttribute('title', dict[key]);
      }
    });

    // Actualizar botones de idioma activos
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
  }

  onLanguageChange(callback) {
    if (typeof callback === 'function') {
      this.listeners.push(callback);
    }
  }

  notify() {
    this.listeners.forEach(fn => fn(this.currentLang));
  }
}

export const i18n = new I18nEngine();
