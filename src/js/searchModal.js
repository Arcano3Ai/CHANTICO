import { PRODUCTS } from '../data/products.js';
import { RITUALS } from '../data/rituals.js';
import { EXPERIENCES } from '../data/experiences.js';
import { JOURNAL_POSTS } from '../data/journal.js';

export class SearchModal {
  constructor(openQuickViewCallback, openJournalCallback, openBreathingCallback) {
    this.openQuickView = openQuickViewCallback;
    this.openJournal = openJournalCallback;
    this.openBreathing = openBreathingCallback;

    this.modalEl = document.getElementById('search-modal');
    this.closeBtn = document.getElementById('search-close-btn');
    this.input = document.getElementById('search-input');
    this.resultsContainer = document.getElementById('search-results-container');

    this.init();
  }

  init() {
    // Abrir búsqueda desde cualquier botón con [data-open-search]
    document.querySelectorAll('[data-open-search]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }

    // Atajo de teclado global Ctrl+K o Cmd+K
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape' && this.modalEl?.classList.contains('open')) {
        this.close();
      }
    });

    if (this.input) {
      this.input.addEventListener('input', (e) => {
        this.search(e.target.value.trim());
      });
    }
  }

  open() {
    if (this.modalEl) this.modalEl.classList.add('open');
    if (this.input) {
      this.input.value = '';
      this.input.focus();
    }
    this.search('');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  search(query) {
    if (!this.resultsContainer) return;
    const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const matchedProducts = PRODUCTS.filter(p => 
      !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.categoryLabel.toLowerCase().includes(q)
    );

    const matchedRituals = RITUALS.filter(r => 
      !q || r.title.toLowerCase().includes(q) || r.intention.toLowerCase().includes(q)
    );

    const matchedJournal = JOURNAL_POSTS.filter(j => 
      !q || j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q)
    );

    if (matchedProducts.length === 0 && matchedRituals.length === 0 && matchedJournal.length === 0) {
      this.resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2.5rem; color: var(--color-text-muted);">
          <p>No encontramos resultados para tu búsqueda.</p>
        </div>
      `;
      return;
    }

    let html = '';

    if (matchedProducts.length > 0) {
      html += `
        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gold); margin-bottom: 0.75rem;">
            Productos de la Tienda (${matchedProducts.length})
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${matchedProducts.slice(0, 4).map(p => `
              <div class="search-item-row" data-action="product" data-id="${p.id}" style="
                display: flex; align-items: center; justify-content: space-between; padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer; transition: all 0.2s;
              ">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                  <img src="${p.image}" style="width: 40px; height: 40px; border-radius: 4px; object-fit: cover;">
                  <div>
                    <div style="font-size: 0.9rem; color: var(--color-beige-light); font-family: var(--font-serif-display);">${p.name}</div>
                    <div style="font-size: 0.75rem; color: var(--color-text-muted);">${p.categoryLabel}</div>
                  </div>
                </div>
                <div style="color: var(--color-gold); font-size: 0.85rem; font-weight: 600;">$${p.price.toLocaleString('es-MX')} MXN</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (matchedRituals.length > 0) {
      html += `
        <div style="margin-bottom: 1.5rem;">
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gold); margin-bottom: 0.75rem;">
            Rituales CHANTICO (${matchedRituals.length})
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${matchedRituals.slice(0, 3).map(r => `
              <div class="search-item-row" data-action="ritual" data-id="${r.id}" style="
                padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;
              ">
                <div style="font-size: 0.9rem; color: var(--color-beige-light); font-family: var(--font-serif-display);">${r.title}</div>
                <div style="font-size: 0.78rem; color: var(--color-gold-light);">${r.subtitle}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (matchedJournal.length > 0) {
      html += `
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.15em; color: var(--color-gold); margin-bottom: 0.75rem;">
            Journal Editorial (${matchedJournal.length})
          </div>
          <div style="display: flex; flex-direction: column; gap: 0.6rem;">
            ${matchedJournal.slice(0, 3).map(j => `
              <div class="search-item-row" data-action="journal" data-id="${j.id}" style="
                padding: 0.75rem; background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: var(--radius-sm); cursor: pointer;
              ">
                <div style="font-size: 0.9rem; color: var(--color-beige-light);">${j.title}</div>
                <div style="font-size: 0.75rem; color: var(--color-text-muted);">${j.category} • ${j.readTime}</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    this.resultsContainer.innerHTML = html;

    // Vincular clicks
    this.resultsContainer.querySelectorAll('.search-item-row').forEach(row => {
      row.addEventListener('click', () => {
        const action = row.dataset.action;
        const id = row.dataset.id;
        this.close();

        if (action === 'product' && this.openQuickView) {
          this.openQuickView(id);
        } else if (action === 'journal' && this.openJournal) {
          this.openJournal(id);
        } else if (action === 'ritual') {
          const ritualEl = document.getElementById('rituales');
          const targetTab = document.querySelector(`.ritual-tab-btn[data-ritual-id="${id}"]`);
          if (targetTab) targetTab.click();
          if (ritualEl) ritualEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }
}
