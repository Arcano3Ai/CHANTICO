import { store } from './state.js';
import { EXPERIENCES } from '../data/experiences.js';

export class BookingSystem {
  constructor() {
    this.modalEl = document.getElementById('booking-modal');
    this.closeBtn = document.getElementById('booking-close-btn');
    this.step1El = document.getElementById('booking-step-1');
    this.step2El = document.getElementById('booking-step-2');
    this.step3El = document.getElementById('booking-step-3');
    this.step4El = document.getElementById('booking-step-4');

    this.serviceSelect = document.getElementById('booking-service-select');
    this.modalitySelect = document.getElementById('booking-modality-select');
    this.dateInput = document.getElementById('booking-date-input');
    this.timeSlotsContainer = document.getElementById('booking-time-slots');
    this.nameInput = document.getElementById('booking-name-input');
    this.phoneInput = document.getElementById('booking-phone-input');
    this.emailInput = document.getElementById('booking-email-input');
    this.notesInput = document.getElementById('booking-notes-input');

    this.nextToStep2Btn = document.getElementById('booking-next-2');
    this.backToStep1Btn = document.getElementById('booking-back-1');
    this.nextToStep3Btn = document.getElementById('booking-next-3');
    this.backToStep2Btn = document.getElementById('booking-back-2');
    this.confirmBookingBtn = document.getElementById('booking-confirm-btn');

    this.confirmedFolioEl = document.getElementById('booking-confirmed-folio');
    this.confirmedWaBtn = document.getElementById('booking-wa-btn');

    this.selectedService = null;
    this.selectedTime = null;

    this.init();
  }

  init() {
    // Escuchar botones con [data-book-service]
    document.querySelectorAll('[data-book-service]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceId = btn.dataset.bookService;
        this.open(serviceId);
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

    // Configurar fecha mínima de reserva (mañana)
    if (this.dateInput) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      this.dateInput.min = tomorrow.toISOString().split('T')[0];
      this.dateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Renderizar horarios
    this.renderTimeSlots();

    // Navegación entre pasos
    if (this.nextToStep2Btn) {
      this.nextToStep2Btn.addEventListener('click', () => {
        const serviceVal = this.serviceSelect?.value;
        if (!serviceVal) {
          alert('Por favor selecciona una experiencia o terapia.');
          return;
        }
        this.goToStep(2);
      });
    }

    if (this.backToStep1Btn) {
      this.backToStep1Btn.addEventListener('click', () => this.goToStep(1));
    }

    if (this.nextToStep3Btn) {
      this.nextToStep3Btn.addEventListener('click', () => {
        if (!this.dateInput?.value) {
          alert('Por favor selecciona una fecha para tu sesión.');
          return;
        }
        if (!this.selectedTime) {
          alert('Por favor selecciona un horario disponible.');
          return;
        }
        this.goToStep(3);
      });
    }

    if (this.backToStep2Btn) {
      this.backToStep2Btn.addEventListener('click', () => this.goToStep(2));
    }

    if (this.confirmBookingBtn) {
      this.confirmBookingBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.processBooking();
      });
    }
  }

  open(preselectedServiceId = null) {
    this.goToStep(1);
    if (preselectedServiceId && this.serviceSelect) {
      this.serviceSelect.value = preselectedServiceId;
    }
    if (this.modalEl) this.modalEl.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  close() {
    if (this.modalEl) this.modalEl.classList.remove('open');
    document.body.style.overflow = '';
  }

  goToStep(stepNumber) {
    if (this.step1El) this.step1El.style.display = stepNumber === 1 ? 'block' : 'none';
    if (this.step2El) this.step2El.style.display = stepNumber === 2 ? 'block' : 'none';
    if (this.step3El) this.step3El.style.display = stepNumber === 3 ? 'block' : 'none';
    if (this.step4El) this.step4El.style.display = stepNumber === 4 ? 'block' : 'none';
  }

  renderTimeSlots() {
    const slots = ['10:00 AM', '12:00 PM', '04:00 PM', '06:00 PM', '07:30 PM'];
    if (!this.timeSlotsContainer) return;

    this.timeSlotsContainer.innerHTML = slots.map((time, idx) => `
      <button type="button" class="booking-time-btn ${idx === 0 ? 'selected' : ''}" data-time="${time}" style="
        padding: 0.65rem 1rem;
        background: ${idx === 0 ? 'rgba(255,215,0,0.18)' : 'rgba(255,255,255,0.03)'};
        border: 1px solid ${idx === 0 ? 'var(--color-gold)' : 'var(--color-border)'};
        border-radius: var(--radius-sm);
        color: ${idx === 0 ? 'var(--color-gold)' : 'var(--color-beige)'};
        font-size: 0.85rem;
        cursor: pointer;
        transition: all 0.2s;
      ">
        ${time}
      </button>
    `).join('');

    this.selectedTime = slots[0];

    this.timeSlotsContainer.querySelectorAll('.booking-time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.timeSlotsContainer.querySelectorAll('.booking-time-btn').forEach(b => {
          b.style.background = 'rgba(255,255,255,0.03)';
          b.style.borderColor = 'var(--color-border)';
          b.style.color = 'var(--color-beige)';
          b.classList.remove('selected');
        });
        btn.style.background = 'rgba(255,215,0,0.18)';
        btn.style.borderColor = 'var(--color-gold)';
        btn.style.color = 'var(--color-gold)';
        btn.classList.add('selected');
        this.selectedTime = btn.dataset.time;
      });
    });
  }

  processBooking() {
    const name = this.nameInput?.value.trim();
    const phone = this.phoneInput?.value.trim();
    const email = this.emailInput?.value.trim();
    const notes = this.notesInput?.value.trim() || 'Sin notas adicionales';
    const serviceName = this.serviceSelect?.options[this.serviceSelect.selectedIndex]?.text;
    const modality = this.modalitySelect?.value || 'Presencial';
    const date = this.dateInput?.value;
    const time = this.selectedTime;

    if (!name || !phone || !email) {
      alert('Por favor ingresa tus datos de contacto para formalizar tu cita.');
      return;
    }

    const booking = store.addBooking({
      serviceName,
      modality,
      date,
      time,
      customer: { name, phone, email, notes }
    });

    if (this.confirmedFolioEl) {
      this.confirmedFolioEl.textContent = booking.id;
    }

    if (this.confirmedWaBtn) {
      const waMsg = `Hola CHANTICO 🔥 Deseo confirmar mi reserva ${booking.id}:%0A• Experiencia: ${serviceName}%0A• Modalidad: ${modality}%0A• Fecha: ${date} a las ${time}%0A• Nombre: ${name}%0A• Teléfono: ${phone}`;
      this.confirmedWaBtn.href = `https://wa.me/5218441228140?text=${waMsg}`;
    }

    this.goToStep(4);
  }
}
