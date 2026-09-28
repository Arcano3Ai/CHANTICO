import { store } from './state.js';

export class CheckoutModal {
  constructor() {
    this.modalEl = document.getElementById('checkout-modal');
    this.closeBtn = document.getElementById('checkout-close-btn');
    this.form = document.getElementById('checkout-form');
    this.step1 = document.getElementById('checkout-step-1');
    this.step2 = document.getElementById('checkout-step-2');
    this.step3 = document.getElementById('checkout-step-3');
    this.nextToPaymentBtn = document.getElementById('checkout-next-btn');
    this.backToShippingBtn = document.getElementById('checkout-back-btn');
    this.submitOrderBtn = document.getElementById('checkout-submit-btn');
    this.summaryItemsEl = document.getElementById('checkout-summary-items');
    this.summaryTotalEl = document.getElementById('checkout-summary-total');
    this.confirmationFolioEl = document.getElementById('checkout-confirmed-folio');
    this.confirmationWaBtn = document.getElementById('checkout-wa-confirm-btn');

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

    if (this.nextToPaymentBtn) {
      this.nextToPaymentBtn.addEventListener('click', () => {
        // Validar campos de envío
        const name = document.getElementById('checkout-name')?.value.trim();
        const email = document.getElementById('checkout-email')?.value.trim();
        const phone = document.getElementById('checkout-phone')?.value.trim();
        const address = document.getElementById('checkout-address')?.value.trim();
        const city = document.getElementById('checkout-city')?.value.trim();

        if (!name || !email || !phone || !address || !city) {
          alert('Por favor completa todos los campos de envío para continuar con tu pedido.');
          return;
        }

        this.goToStep(2);
      });
    }

    if (this.backToShippingBtn) {
      this.backToShippingBtn.addEventListener('click', () => this.goToStep(1));
    }

    if (this.submitOrderBtn) {
      this.submitOrderBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processOrder();
      });
    }

    // Toggle de métodos de pago
    const paymentRadios = document.querySelectorAll('input[name="payment_method"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('.payment-detail-box').forEach(box => box.style.display = 'none');
        const targetBox = document.getElementById(`payment-detail-${e.target.value}`);
        if (targetBox) targetBox.style.display = 'block';
      });
    });
  }

  open() {
    if (store.cart.length === 0) return;
    this.goToStep(1);
    this.renderSummary();
    if (this.modalEl) this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  goToStep(stepNumber) {
    if (this.step1) this.step1.style.display = stepNumber === 1 ? 'block' : 'none';
    if (this.step2) this.step2.style.display = stepNumber === 2 ? 'block' : 'none';
    if (this.step3) this.step3.style.display = stepNumber === 3 ? 'block' : 'none';

    document.querySelectorAll('.checkout-step-indicator').forEach(el => {
      const step = parseInt(el.dataset.step, 10);
      if (step === stepNumber) {
        el.classList.add('active');
      } else if (step < stepNumber) {
        el.classList.add('completed');
        el.classList.remove('active');
      } else {
        el.classList.remove('active', 'completed');
      }
    });
  }

  renderSummary() {
    if (!this.summaryItemsEl) return;
    this.summaryItemsEl.innerHTML = store.cart.map(item => `
      <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0.5rem 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
        <span>${item.quantity}x ${item.name} (${item.variantLabel})</span>
        <span style="color: var(--color-gold);">$${(item.price * item.quantity).toLocaleString('es-MX')} MXN</span>
      </div>
    `).join('');

    if (this.summaryTotalEl) {
      this.summaryTotalEl.textContent = `$${store.getCartTotal().toLocaleString('es-MX')} MXN`;
    }
  }

  processOrder() {
    const name = document.getElementById('checkout-name')?.value.trim();
    const email = document.getElementById('checkout-email')?.value.trim();
    const phone = document.getElementById('checkout-phone')?.value.trim();
    const address = document.getElementById('checkout-address')?.value.trim();
    const city = document.getElementById('checkout-city')?.value.trim();
    const state = document.getElementById('checkout-state')?.value.trim();
    const zip = document.getElementById('checkout-zip')?.value.trim();
    const paymentMethod = document.querySelector('input[name="payment_method"]:checked')?.value || 'tarjeta';

    const order = store.addOrder({
      customer: { name, email, phone, address, city, state, zip },
      paymentMethod
    });

    if (this.confirmationFolioEl) {
      this.confirmationFolioEl.textContent = order.id;
    }

    if (this.confirmationWaBtn) {
      const itemsList = order.items.map(i => `• ${i.quantity}x ${i.name} ($${i.price * i.quantity} MXN)`).join('%0A');
      const waMsg = `Hola CHANTICO 🔥 Acabo de realizar mi orden ${order.id} por $${order.total.toLocaleString('es-MX')} MXN.%0A%0AProductos:%0A${itemsList}%0A%0ACliente: ${name}%0ATel: ${phone}%0ADirección: ${address}, ${city}, ${state}.`;
      this.confirmationWaBtn.href = `https://wa.me/5218441228140?text=${waMsg}`;
    }

    this.goToStep(3);
  }
}
