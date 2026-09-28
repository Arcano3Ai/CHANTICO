// Estado Global y Persistencia en LocalStorage para CHANTICO
const CART_STORAGE_KEY = 'chantico_cart_v1';
const WISHLIST_STORAGE_KEY = 'chantico_wishlist_v1';
const ORDERS_STORAGE_KEY = 'chantico_orders_v1';
const BOOKINGS_STORAGE_KEY = 'chantico_bookings_v1';

class Store {
  constructor() {
    this.cart = this.load(CART_STORAGE_KEY, []);
    this.wishlist = this.load(WISHLIST_STORAGE_KEY, []);
    this.orders = this.load(ORDERS_STORAGE_KEY, []);
    this.bookings = this.load(BOOKINGS_STORAGE_KEY, []);
    this.coupon = null;
    this.discountPercent = 0;
    this.listeners = [];
  }

  load(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  }

  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage save failed', e);
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  // --- CARRITO ---
  addToCart(product, variantId = null, quantity = 1) {
    const selectedVariant = variantId 
      ? (product.variants?.find(v => v.id === variantId) || product.variants?.[0])
      : product.variants?.[0];

    const price = selectedVariant ? selectedVariant.price : product.price;
    const variantLabel = selectedVariant ? selectedVariant.label : 'Estándar';
    const cartItemId = `${product.id}-${selectedVariant ? selectedVariant.id : 'default'}`;

    const existingIndex = this.cart.findIndex(item => item.cartItemId === cartItemId);
    if (existingIndex > -1) {
      this.cart[existingIndex].quantity += quantity;
    } else {
      this.cart.push({
        cartItemId,
        productId: product.id,
        name: product.name,
        image: product.image,
        categoryLabel: product.categoryLabel,
        price,
        variantLabel,
        quantity
      });
    }

    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  updateQuantity(cartItemId, delta) {
    const item = this.cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }

    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  removeFromCart(cartItemId) {
    this.cart = this.cart.filter(i => i.cartItemId !== cartItemId);
    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  clearCart() {
    this.cart = [];
    this.coupon = null;
    this.discountPercent = 0;
    this.save(CART_STORAGE_KEY, this.cart);
    this.notify();
  }

  applyCoupon(code) {
    const normalized = (code || '').trim().toUpperCase();
    if (normalized === 'RITUAL15' || normalized === 'CHANTICO15' || normalized === 'FUEGOSAGRADO' || normalized === 'NUMAFRECUENCIA') {
      this.coupon = normalized;
      this.discountPercent = 0.15; // 15% OFF
      this.notify();
      return { success: true, message: '¡Cupón aplicado! 15% de descuento en tu compra sagrada.' };
    }
    return { success: false, message: 'El cupón ingresado no es válido o ha expirado.' };
  }

  getCartSubtotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getDiscountAmount() {
    return Math.round(this.getCartSubtotal() * this.discountPercent);
  }

  getShippingCost() {
    const subtotal = this.getCartSubtotal();
    if (subtotal === 0) return 0;
    return subtotal >= 1200 ? 0 : 150; // Envío gratis a partir de $1,200 MXN
  }

  getCartTotal() {
    return this.getCartSubtotal() - this.getDiscountAmount() + this.getShippingCost();
  }

  getCartCount() {
    return this.cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  // --- WISHLIST ---
  toggleWishlist(productId) {
    const index = this.wishlist.indexOf(productId);
    if (index > -1) {
      this.wishlist.splice(index, 1);
    } else {
      this.wishlist.push(productId);
    }
    this.save(WISHLIST_STORAGE_KEY, this.wishlist);
    this.notify();
    return this.isInWishlist(productId);
  }

  isInWishlist(productId) {
    return this.wishlist.includes(productId);
  }

  // --- PEDIDOS ---
  addOrder(orderData) {
    const order = {
      id: `NUM-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('es-MX', { dateStyle: 'medium' }),
      ...orderData,
      items: [...this.cart],
      total: this.getCartTotal()
    };
    this.orders.unshift(order);
    this.save(ORDERS_STORAGE_KEY, this.orders);
    this.clearCart();
    return order;
  }

  // --- RESERVAS ---
  addBooking(bookingData) {
    const booking = {
      id: `RES-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      ...bookingData
    };
    this.bookings.unshift(booking);
    this.save(BOOKINGS_STORAGE_KEY, this.bookings);
    this.notify();
    return booking;
  }
}

export const store = new Store();
