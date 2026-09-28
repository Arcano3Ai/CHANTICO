/**
 * CHANTICO SENSORY ENGINE — Experiencia Mística Táctil y Acústica
 * Micro-Háptica en Móviles + Resonancia Sagrada 432Hz con Web Audio API (0 KB de peso)
 */

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Desbloquear contexto de audio con la primera interacción
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    getAudioContext();
    window.removeEventListener('click', unlockAudio);
    window.removeEventListener('touchstart', unlockAudio);
  };
  window.addEventListener('click', unlockAudio, { once: true });
  window.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
}

/**
 * Emite pulsos de vibración táctil suave en dispositivos móviles compatibles
 */
export function triggerHaptic(type = 'soft') {
  if (typeof navigator === 'undefined' || !navigator.vibrate) return;
  try {
    switch (type) {
      case 'soft':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(25);
        break;
      case 'resonance':
        navigator.vibrate([12, 35, 18]);
        break;
      case 'sacred':
        navigator.vibrate([15, 50, 15, 50, 30]);
        break;
      default:
        navigator.vibrate(15);
    }
  } catch (e) {
    // Si el dispositivo restringe la vibración, silencia el error
  }
}

/**
 * Sintetiza tonos armónicos puros (Campana sagrada / Cuenco) en 432 Hz y 528 Hz
 */
export function playHarmonicTone(preset = 'bell') {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    let baseFreq = 432; // Frecuencia de sintonización universal

    if (preset === 'resonance' || preset === 'portal') {
      baseFreq = 528; // Frecuencia Solfeggio de amor y transformación
    } else if (preset === 'high') {
      baseFreq = 864; // Octava superior
    } else if (preset === 'chime') {
      baseFreq = 576;
    }

    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);

    // Armónico sutil en octava para brillo cristalino
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baseFreq * 2, now);

    // Envolvente de decaimiento místico suave
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.12, now + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.25);

    osc.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc2.start(now);
    osc.stop(now + 1.3);
    osc2.stop(now + 1.3);
  } catch (e) {
    // Silenciar si Web Audio está restringido
  }
}

/**
 * Disparador combinado sensorial (Vibración + Tono)
 */
export function triggerSacredFeedback(type = 'soft') {
  triggerHaptic(type);
  playHarmonicTone(type === 'resonance' || type === 'sacred' ? 'resonance' : 'bell');
}
