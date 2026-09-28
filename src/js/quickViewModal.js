import { PRODUCTS } from '../data/products.js';
import { store } from './state.js';

export class QuickViewModal {
  constructor(openCartCallback) {
    this.openCart = openCartCallback;
    this.modalEl = document.getElementById('quickview-modal');
    this.closeBtn = document.getElementById('quickview-close-btn');
    this.contentWrap = document.getElementById('quickview-body');
    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.close();
      });
    }
  }

  open(productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product || !this.contentWrap) return;

    let selectedVariantId = product.variants?.[0]?.id || null;
    let currentPrice = product.variants?.[0]?.price || product.price;

    this.contentWrap.innerHTML = `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2.5rem; align-items: start;">
        <div style="position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--color-border-gold);">
          <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover; aspect-ratio: 1/1;">
          ${product.badge ? `<span class="badge badge-gold" style="position: absolute; top: 1rem; left: 1rem;">${product.badge}</span>` : ''}
        </div>
        <div>
          <span class="eyebrow" style="margin-bottom: 0.25rem;">${product.categoryLabel}</span>
          <h2 style="font-family: var(--font-serif-display); font-size: 1.6rem; color: var(--color-beige-light); margin-bottom: 0.5rem; line-height: 1.25;">
            ${product.name}
          </h2>
          <p class="font-editorial" style="font-size: 1.1rem; color: var(--color-gold-light); margin-bottom: 1.25rem;">
            “${product.tagline}”
          </p>

          <div style="font-size: 1.5rem; font-weight: 600; color: var(--color-gold); margin-bottom: 1.5rem;" id="qv-price-display">
            $${currentPrice.toLocaleString('es-MX')} MXN
          </div>

          <p style="font-size: 0.9rem; color: var(--color-text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
            ${product.description}
          </p>

          ${product.aroma ? `
            <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--color-border); border-radius: var(--radius-sm); padding: 1.25rem; margin-bottom: 1.5rem;">
              <div style="font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.18em; color: var(--color-gold); margin-bottom: 0.6rem; font-weight: 600;">
                Perfil Sensorial & Pirámide Olfativa
              </div>
              <div style="font-size: 0.82rem; color: var(--color-beige); display: flex; flex-direction: column; gap: 0.35rem;">
                <div><strong style="color: var(--color-gold-light);">Salida:</strong> ${product.aroma.salida}</div>
                <div><strong style="color: var(--color-gold-light);">Corazón:</strong> ${product.aroma.corazon}</div>
                <div><strong style="color: var(--color-gold-light);">Fondo:</strong> ${product.aroma.fondo}</div>
              </div>
            </div>
          ` : ''}

          ${product.variants && product.variants.length > 1 ? `
            <div class="form-group" style="margin-bottom: 1.5rem;">
              <label class="form-label">Seleccionar Presentación:</label>
              <select id="qv-variant-select" class="form-control">
                ${product.variants.map(v => `<option value="${v.id}" data-price="${v.price}">${v.label} — $${v.price.toLocaleString('es-MX')} MXN</option>`).join('')}
              </select>
            </div>
          ` : ''}

          <div style="display: flex; gap: 1rem; align-items: center; margin-top: 2rem;">
            <button id="qv-add-cart-btn" class="btn btn-primary btn-gold-shimmer" style="flex-grow: 1;">
              AGREGAR AL CARRITO
            </button>
            <button id="qv-wishlist-toggle" class="btn-icon ${store.isInWishlist(product.id) ? 'active' : ''}" title="Guardar en favoritos">
              ♥
            </button>
          </div>
        </div>
      </div>
    `;

    // Interacción de variante
    const variantSelect = document.getElementById('qv-variant-select');
    if (variantSelect) {
      variantSelect.addEventListener('change', (e) => {
        selectedVariantId = e.target.value;
        const opt = e.target.options[e.target.selectedIndex];
        currentPrice = parseInt(opt.dataset.price, 10);
        const priceDisp = document.getElementById('qv-price-display');
        if (priceDisp) priceDisp.textContent = `$${currentPrice.toLocaleString('es-MX')} MXN`;
      });
    }

    // Agregar al carrito
    const addCartBtn = document.getElementById('qv-add-cart-btn');
    if (addCartBtn) {
      addCartBtn.addEventListener('click', () => {
        store.addToCart(product, selectedVariantId, 1);
        this.close();
        if (this.openCart) this.openCart();
      });
    }

    // Wishlist
    const wishBtn = document.getElementById('qv-wishlist-toggle');
    if (wishBtn) {
      wishBtn.addEventListener('click', () => {
        const active = store.toggleWishlist(product.id);
        wishBtn.classList.toggle('active', active);
      });
    }

    if (this.modalEl) this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }
}
