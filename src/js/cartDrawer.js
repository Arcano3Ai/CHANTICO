import { store } from './state.js';

export class CartDrawer {
  constructor(openCheckoutCallback) {
    this.openCheckout = openCheckoutCallback;
    this.drawerEl = document.getElementById('cart-drawer');
    this.overlayEl = document.getElementById('cart-overlay');
    this.closeBtn = document.getElementById('cart-close-btn');
    this.itemsContainer = document.getElementById('cart-items-container');
    this.countBadges = document.querySelectorAll('.cart-count-badge');
    this.subtotalEl = document.getElementById('cart-subtotal-val');
    this.discountRow = document.getElementById('cart-discount-row');
    this.discountEl = document.getElementById('cart-discount-val');
    this.shippingEl = document.getElementById('cart-shipping-val');
    this.totalEl = document.getElementById('cart-total-val');
    this.shippingMsgEl = document.getElementById('cart-shipping-msg');
    this.shippingFillEl = document.getElementById('cart-shipping-fill');
    this.couponInput = document.getElementById('cart-coupon-input');
    this.couponBtn = document.getElementById('cart-coupon-btn');
    this.couponMsg = document.getElementById('cart-coupon-msg');
    this.checkoutBtn = document.getElementById('cart-checkout-btn');

    this.init();
  }

  init() {
    // Abrir carrito desde cualquier botón con atributo [data-open-cart]
    document.querySelectorAll('[data-open-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    });

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    if (this.couponBtn) {
      this.couponBtn.addEventListener('click', () => {
        const code = this.couponInput?.value;
        const res = store.applyCoupon(code);
        if (this.couponMsg) {
          this.couponMsg.textContent = res.message;
          this.couponMsg.style.color = res.success ? 'var(--color-gold)' : 'var(--color-error)';
          this.couponMsg.style.display = 'block';
        }
      });
    }

    if (this.checkoutBtn) {
      this.checkoutBtn.addEventListener('click', () => {
        if (store.cart.length === 0) return;
        this.close();
        if (this.openCheckout) this.openCheckout();
      });
    }

    store.subscribe(() => this.render());
    this.render();
  }

  open() {
    if (this.drawerEl) this.drawerEl.classList.add('open');
    if (this.overlayEl) this.overlayEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.drawerEl) this.drawerEl.classList.remove('open');
    if (this.overlayEl) this.overlayEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  render() {
    const count = store.getCartCount();
    this.countBadges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    if (!this.itemsContainer) return;

    if (store.cart.length === 0) {
      this.itemsContainer.innerHTML = `
        <div style="text-align: center; padding: 4rem 1rem; color: var(--color-text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 1rem; opacity: 0.6;">✦</div>
          <p style="font-family: var(--font-serif-display); font-size: 1.1rem; color: var(--color-beige); margin-bottom: 0.5rem;">Tu carrito está en quietud</p>
          <p style="font-size: 0.85rem; margin-bottom: 1.5rem;">Aún no has agregado herramientas o rituales para tu espacio.</p>
          <a href="#tienda" class="btn btn-secondary btn-sm" onclick="document.getElementById('cart-close-btn').click();">EXPLORAR TIENDA</a>
        </div>
      `;
      if (this.checkoutBtn) this.checkoutBtn.disabled = true;
    } else {
      if (this.checkoutBtn) this.checkoutBtn.disabled = false;
      this.itemsContainer.innerHTML = store.cart.map(item => `
        <div class="cart-item-row" data-cart-id="${item.cartItemId}">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-variant">${item.variantLabel}</div>
            <div style="color: var(--color-gold); font-size: 0.88rem; font-weight: 600;">
              $${(item.price * item.quantity).toLocaleString('es-MX')} MXN
            </div>
          </div>
          <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem;">
            <div class="cart-qty-control">
              <button class="cart-qty-btn btn-qty-minus" data-id="${item.cartItemId}">−</button>
              <span class="cart-qty-val">${item.quantity}</span>
              <button class="cart-qty-btn btn-qty-plus" data-id="${item.cartItemId}">+</button>
            </div>
            <button class="btn-remove-item" data-id="${item.cartItemId}" style="font-size: 0.72rem; color: var(--color-text-muted); text-decoration: underline; background: none; border: none; cursor: pointer;">
              Quitar
            </button>
          </div>
        </div>
      `).join('');

      // Event listeners para items
      this.itemsContainer.querySelectorAll('.btn-qty-minus').forEach(btn => {
        btn.addEventListener('click', () => {
          store.updateQuantity(btn.dataset.id, -1);
        });
      });

      this.itemsContainer.querySelectorAll('.btn-qty-plus').forEach(btn => {
        btn.addEventListener('click', () => {
          store.updateQuantity(btn.dataset.id, 1);
        });
      });

      this.itemsContainer.querySelectorAll('.btn-remove-item').forEach(btn => {
        btn.addEventListener('click', () => {
          store.removeFromCart(btn.dataset.id);
        });
      });
    }

    // Totales
    const subtotal = store.getCartSubtotal();
    const discount = store.getDiscountAmount();
    const shipping = store.getShippingCost();
    const total = store.getCartTotal();

    if (this.subtotalEl) this.subtotalEl.textContent = `$${subtotal.toLocaleString('es-MX')} MXN`;

    if (this.discountRow) {
      if (discount > 0) {
        this.discountRow.style.display = 'flex';
        if (this.discountEl) this.discountEl.textContent = `-$${discount.toLocaleString('es-MX')} MXN`;
      } else {
        this.discountRow.style.display = 'none';
      }
    }

    if (this.shippingEl) {
      this.shippingEl.textContent = shipping === 0 ? (subtotal > 0 ? 'GRATIS' : '$0 MXN') : `$${shipping} MXN`;
      if (shipping === 0 && subtotal > 0) this.shippingEl.style.color = 'var(--color-gold)';
    }

    if (this.totalEl) this.totalEl.textContent = `$${total.toLocaleString('es-MX')} MXN`;

    // Barra de envío gratis ($1,200 MXN)
    const freeShippingThreshold = 1200;
    const remaining = freeShippingThreshold - subtotal;
    const pct = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

    if (this.shippingFillEl) this.shippingFillEl.style.width = `${pct}%`;

    if (this.shippingMsgEl) {
      if (subtotal === 0) {
        this.shippingMsgEl.innerHTML = `Envío gratis en compras a partir de <strong>$1,200 MXN</strong>`;
      } else if (remaining > 0) {
        this.shippingMsgEl.innerHTML = `Te faltan <strong>$${remaining.toLocaleString('es-MX')} MXN</strong> para obtener <strong>Envío Gratis</strong>`;
      } else {
        this.shippingMsgEl.innerHTML = `✨ ¡Felicidades! Tienes <strong>Envío Gratis</strong> para tu pedido`;
      }
    }
  }
}
