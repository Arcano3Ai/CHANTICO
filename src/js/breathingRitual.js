// Guía Interactiva de Respiración Consciente para Rituales NÜMA

export class BreathingRitualModal {
  constructor() {
    this.modalEl = document.getElementById('breathing-modal');
    this.circleEl = document.getElementById('breathing-circle');
    this.phaseTextEl = document.getElementById('breathing-phase-text');
    this.counterEl = document.getElementById('breathing-counter');
    this.cycleEl = document.getElementById('breathing-cycle-info');
    this.titleEl = document.getElementById('breathing-ritual-title');
    this.closeBtn = document.getElementById('breathing-close-btn');

    this.timer = null;
    this.currentCycle = 1;
    this.totalCycles = 4;
    this.currentPhase = 'inhale';
    this.secondsRemaining = 4;
    this.pattern = { inhale: 4, hold: 7, exhale: 8 };

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.stop());
    }

    if (this.modalEl) {
      this.modalEl.addEventListener('click', (e) => {
        if (e.target === this.modalEl) this.stop();
      });
    }
  }

  start(ritual) {
    if (!this.modalEl) return;
    const breath = ritual.elements?.breath || { inhale: 4, hold: 4, exhale: 4, cycles: 4 };
    this.pattern = {
      inhale: breath.inhale || 4,
      hold: breath.hold || 0,
      exhale: breath.exhale || 4
    };
    this.totalCycles = breath.cycles || 4;
    this.currentCycle = 1;

    if (this.titleEl) this.titleEl.textContent = ritual.title;
    this.modalEl.classList.add('open');

    this.runPhase('inhale');
  }

  runPhase(phase) {
    this.currentPhase = phase;
    let duration = this.pattern[phase];

    if (duration === 0) {
      // Si no hay retención en este patrón, pasa a la siguiente fase
      if (phase === 'hold') {
        this.runPhase('exhale');
        return;
      }
    }

    this.secondsRemaining = duration;
    this.updateUI();

    clearInterval(this.timer);
    this.timer = setInterval(() => {
      this.secondsRemaining--;
      if (this.secondsRemaining <= 0) {
        clearInterval(this.timer);
        this.nextPhase();
      } else {
        this.updateUI();
      }
    }, 1000);
  }

  nextPhase() {
    if (this.currentPhase === 'inhale') {
      if (this.pattern.hold > 0) {
        this.runPhase('hold');
      } else {
        this.runPhase('exhale');
      }
    } else if (this.currentPhase === 'hold') {
      this.runPhase('exhale');
    } else if (this.currentPhase === 'exhale') {
      if (this.currentCycle < this.totalCycles) {
        this.currentCycle++;
        this.runPhase('inhale');
      } else {
        this.finish();
      }
    }
  }

  updateUI() {
    if (this.counterEl) {
      this.counterEl.textContent = this.secondsRemaining;
    }
    if (this.cycleEl) {
      this.cycleEl.textContent = `Ciclo ${this.currentCycle} de ${this.totalCycles}`;
    }

    if (this.phaseTextEl && this.circleEl) {
      if (this.currentPhase === 'inhale') {
        this.phaseTextEl.textContent = 'Inhala profundamente hacia tu centro...';
        this.circleEl.style.transform = 'scale(1.35)';
        this.circleEl.style.boxShadow = '0 0 60px rgba(255, 215, 0, 0.6)';
      } else if (this.currentPhase === 'hold') {
        this.phaseTextEl.textContent = 'Sostén con calma y quietud...';
        this.circleEl.style.transform = 'scale(1.35)';
        this.circleEl.style.boxShadow = '0 0 45px rgba(255, 215, 0, 0.4)';
      } else if (this.currentPhase === 'exhale') {
        this.phaseTextEl.textContent = 'Exhala soltando toda pesadez...';
        this.circleEl.style.transform = 'scale(0.85)';
        this.circleEl.style.boxShadow = '0 0 20px rgba(255, 215, 0, 0.2)';
      }
    }
  }

  finish() {
    clearInterval(this.timer);
    if (this.phaseTextEl) {
      this.phaseTextEl.textContent = 'Ritual completado. Permanece en tu calma interior.';
    }
    if (this.counterEl) {
      this.counterEl.textContent = '✦';
    }
    setTimeout(() => {
      this.stop();
    }, 3500);
  }

  stop() {
    clearInterval(this.timer);
    if (this.modalEl) this.modalEl.classList.remove('open');
  }
}
