/**
 * CHANTICO — Motor Sagrado del Espejo de Obsidiana (Oráculo Tolteca & Vórtice Receptivo)
 * Partículas orbitales, rasterizador oracular dinámico a 60 FPS y síntesis Web Audio API (432 Hz).
 */

export function initObsidianMirror() {
  const canvas = document.getElementById('obsidianCanvas');
  const rasterCanvas = document.getElementById('obsidianRasterCanvas');
  const soundToggleBtn = document.getElementById('obsidianSoundToggleBtn');
  const soundIcon = document.getElementById('obsidianSoundIcon');
  const soundLabel = document.getElementById('obsidianSoundLabel');
  const specularGleam = document.getElementById('obsidianGleam');
  const oracleForm = document.getElementById('obsidianOracleForm');
  const questionInput = document.getElementById('obsidianQuestionInput');
  const quickPrompts = document.querySelectorAll('.obsidian-quick-prompt');

  if (!canvas || !rasterCanvas) return;

  const ctx = canvas.getContext('2d');
  const rasterCtx = rasterCanvas.getContext('2d');

  let orbSize = 480;
  let orbCenter = orbSize / 2;
  let orbRadius = orbSize / 2;

  const PARTICLE_COUNT = 1100;
  const particles = [];
  const shockwaves = [];

  let oracleState = 'orbiting'; // 'orbiting' | 'trance' | 'gathering'
  let gatherTimer = null;
  let currentWord = '';

  // Pointer dynamics
  const mouse = {
    x: orbCenter,
    y: orbCenter,
    prevX: orbCenter,
    prevY: orbCenter,
    vx: 0,
    vy: 0,
    isDown: false,
    isInside: false
  };

  /* =========================================================================
     1. WEB AUDIO API SAGRADO (Dron 432 Hz + Armónicos Toltecas + Cuencos)
     ========================================================================= */
  let audioCtx = null;
  let isAudioActive = false;
  let masterGain = null;
  let droneOsc = null;
  let subOsc = null;

  function initAudio() {
    if (audioCtx) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtx();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(520, audioCtx.currentTime);
      filter.connect(masterGain);

      // 432 Hz Drone (Frecuencia de Sanación del Fuego)
      droneOsc = audioCtx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(432, audioCtx.currentTime);

      const droneGain = audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.18, audioCtx.currentTime);
      droneOsc.connect(droneGain);
      droneGain.connect(filter);

      // 108 Hz Sub-armónico terrenal
      subOsc = audioCtx.createOscillator();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(108, audioCtx.currentTime);

      const subGain = audioCtx.createGain();
      subGain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      subOsc.connect(subGain);
      subGain.connect(filter);

      droneOsc.start();
      subOsc.start();
    } catch (e) {
      console.warn('Web Audio no disponible:', e);
    }
  }

  function playTibetanBowl(freq = 432, duration = 3.5) {
    if (!audioCtx) return;
    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(masterGain || audioCtx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch (e) {}
  }

  function toggleAudio() {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    if (isAudioActive) {
      if (masterGain) masterGain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.6);
      isAudioActive = false;
      if (soundIcon) soundIcon.textContent = '🔇';
      if (soundLabel) soundLabel.textContent = 'Resonancia (432Hz Silenciada)';
    } else {
      if (masterGain) masterGain.gain.linearRampToValueAtTime(0.35, audioCtx.currentTime + 1.0);
      isAudioActive = true;
      if (soundIcon) soundIcon.textContent = '🔔';
      if (soundLabel) soundLabel.textContent = 'Resonancia (432Hz Activa)';
      playTibetanBowl(432, 4.0);
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', toggleAudio);
  }

  /* =========================================================================
     2. REESCALADO Y SISTEMA DE PARTÍCULAS
     ========================================================================= */
  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const size = Math.floor(Math.min(rect.width, rect.height) * dpr);
    if (size > 50) {
      orbSize = size;
      canvas.width = orbSize;
      canvas.height = orbSize;
      orbCenter = orbSize / 2;
      orbRadius = orbSize / 2;
    }

    if (oracleState === 'gathering' && currentWord) {
      renderCurrentWordToTargets(currentWord);
    }
  }

  class Particle {
    constructor() {
      this.resetOrbit();
      this.x = this.targetX;
      this.y = this.targetY;
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = (Math.random() - 0.5) * 1.5;
      this.size = Math.random() * 1.9 + 0.8;
      this.baseColor = Math.random() > 0.4 ? '#FFD166' : '#FFB703';
      this.alpha = Math.random() * 0.75 + 0.25;
      this.hasTarget = false;
      this.textTargetX = 0;
      this.textTargetY = 0;
    }

    resetOrbit() {
      this.angle = Math.random() * Math.PI * 2;
      this.semiMajor = (Math.random() * 0.75 + 0.15) * orbRadius;
      this.semiMinor = this.semiMajor * (Math.random() * 0.55 + 0.35);
      this.speed = (Math.random() * 0.015 + 0.008) * (Math.random() > 0.5 ? 1 : -1);
      this.tilt = (Math.random() - 0.5) * 0.8;
      this.calcOrbitPos();
    }

    calcOrbitPos() {
      const cos = Math.cos(this.angle);
      const sin = Math.sin(this.angle);
      const ox = cos * this.semiMajor;
      const oy = sin * this.semiMinor;

      const cosT = Math.cos(this.tilt);
      const sinT = Math.sin(this.tilt);

      this.targetX = orbCenter + (ox * cosT - oy * sinT);
      this.targetY = orbCenter + (ox * sinT + oy * cosT);
    }

    update() {
      if (oracleState === 'gathering' && this.hasTarget) {
        const dx = this.textTargetX - this.x;
        const dy = this.textTargetY - this.y;
        this.vx = (this.vx + dx * 0.045) * 0.82;
        this.vy = (this.vy + dy * 0.045) * 0.82;
        this.alpha = Math.min(1.0, this.alpha + 0.04);
      } else {
        this.angle += this.speed;
        this.calcOrbitPos();

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.vx = (this.vx + dx * 0.02) * 0.94;
        this.vy = (this.vy + dy * 0.02) * 0.94;

        if (mouse.isInside) {
          const mdx = this.x - mouse.x;
          const mdy = this.y - mouse.y;
          const dist = Math.sqrt(mdx * mdx + mdy * mdy);
          const maxDist = orbRadius * 0.45;

          if (dist < maxDist && dist > 1) {
            const force = (1 - dist / maxDist) * 3.8;
            this.vx += (mdx / dist) * force;
            this.vy += (mdy / dist) * force;

            this.vx += -mdy * 0.035 * (mouse.vx * 0.05);
            this.vy += mdx * 0.035 * (mouse.vy * 0.05);
          }
        }
      }

      this.x += this.vx;
      this.y += this.vy;

      // Interacción con ondas de choque
      for (let i = 0; i < shockwaves.length; i++) {
        const sw = shockwaves[i];
        const sdx = this.x - sw.x;
        const sdy = this.y - sw.y;
        const sdist = Math.sqrt(sdx * sdx + sdy * sdy);
        const diff = Math.abs(sdist - sw.radius);

        if (diff < 28 && sdist > 1) {
          const push = (1 - diff / 28) * 6.5 * sw.alpha;
          this.vx += (sdx / sdist) * push;
          this.vy += (sdy / sdist) * push;
        }
      }

      // Restricción al perímetro circular de la obsidiana
      const fromCenterX = this.x - orbCenter;
      const fromCenterY = this.y - orbCenter;
      const distFromCenter = Math.sqrt(fromCenterX * fromCenterX + fromCenterY * fromCenterY);
      const limitRadius = orbRadius * 0.92;

      if (distFromCenter > limitRadius) {
        const normalX = fromCenterX / distFromCenter;
        const normalY = fromCenterY / distFromCenter;
        this.x = orbCenter + normalX * limitRadius;
        this.y = orbCenter + normalY * limitRadius;
        this.vx *= -0.4;
        this.vy *= -0.4;
      }
    }

    draw() {
      ctx.fillStyle = this.baseColor;
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initParticles() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function triggerShockwave(x = orbCenter, y = orbCenter) {
    shockwaves.push({
      x: x,
      y: y,
      radius: 8,
      maxRadius: orbRadius * 1.15,
      alpha: 1.0,
      speed: 7.5
    });
    if (isAudioActive) {
      playTibetanBowl(576, 2.2);
    }
  }

  /* =========================================================================
     3. RASTERIZADOR DE RESPUESTAS SAGRADAS TOLTECAS
     ========================================================================= */
  const toltecAnswers = [
    "MIRA HACIA ADENTRO",
    "EL GUERRERO ACECHA",
    "TRANSFORMA LA SOMBRA",
    "DESPIERTA EL NAHUAL",
    "FLORECE EN EL CAOS",
    "SILENCIA EL EGO",
    "AVANZA SIN MIEDO",
    "CONFÍA EN EL VACÍO",
    "HONRA TU PALABRA",
    "EL TIEMPO ES AHORA",
    "ERES LUZ Y SOMBRA",
    "FUEGO TRANSMUTADOR",
    "ABRAZA TU DESTINO",
    "RETORNA A TU CENTRO"
  ];

  function renderCurrentWordToTargets(word) {
    currentWord = word;
    const w = canvas.width;
    const h = canvas.height;
    rasterCanvas.width = w;
    rasterCanvas.height = h;

    rasterCtx.clearRect(0, 0, w, h);
    rasterCtx.fillStyle = '#FFFFFF';
    rasterCtx.textAlign = 'center';
    rasterCtx.textBaseline = 'middle';

    const words = word.split(' ');
    let lines = [];
    if (words.length <= 2) {
      lines.push(word);
    } else {
      const mid = Math.ceil(words.length / 2);
      lines.push(words.slice(0, mid).join(' '));
      lines.push(words.slice(mid).join(' '));
    }

    const fontSize = Math.floor(w * (lines.length > 1 ? 0.082 : 0.095));
    rasterCtx.font = `900 ${fontSize}px 'Cinzel', serif`;

    const lineHeight = fontSize * 1.35;
    const startY = (h / 2) - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      rasterCtx.fillText(line, w / 2, startY + (index * lineHeight));
    });

    const imgData = rasterCtx.getImageData(0, 0, w, h).data;
    const targetCoords = [];
    const step = 6;

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const index = (y * w + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha > 120) {
          targetCoords.push({ x: x, y: y });
        }
      }
    }

    for (let i = targetCoords.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [targetCoords[i], targetCoords[j]] = [targetCoords[j], targetCoords[i]];
    }

    const count = particles.length;
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      if (i < targetCoords.length) {
        p.hasTarget = true;
        p.textTargetX = targetCoords[i].x;
        p.textTargetY = targetCoords[i].y;
        p.baseColor = '#FFFFFF';
      } else {
        p.hasTarget = false;
        p.baseColor = Math.random() > 0.5 ? '#FFB703' : '#F5A623';
      }
    }
  }

  function askOracle(customAnswer) {
    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    const answer = customAnswer || toltecAnswers[Math.floor(Math.random() * toltecAnswers.length)];

    triggerShockwave(orbCenter, orbCenter);
    if (isAudioActive) playTibetanBowl(432, 5.0);

    oracleState = 'trance';
    particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 14;
      p.vy = (Math.random() - 0.5) * 14;
    });

    // Feedback sonoro háptico si está disponible
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 60, 80]);
    }

    setTimeout(() => {
      renderCurrentWordToTargets(answer);
      oracleState = 'gathering';
      if (isAudioActive) playTibetanBowl(540, 3.5);

      clearTimeout(gatherTimer);
      gatherTimer = setTimeout(() => {
        disperseWord();
      }, 7500);
    }, 700);
  }

  function disperseWord() {
    if (oracleState !== 'gathering') return;
    oracleState = 'orbiting';
    particles.forEach(p => {
      p.hasTarget = false;
      p.baseColor = Math.random() > 0.4 ? '#FFD166' : '#FFB703';
      p.vx += (Math.random() - 0.5) * 5;
      p.vy += (Math.random() - 0.5) * 5;
    });
    if (isAudioActive) playTibetanBowl(360, 2.5);
  }

  /* =========================================================================
     4. LISTENERS DE INTERACCIÓN (RATÓN / TÁCTIL)
     ========================================================================= */
  function updatePointerPosition(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    mouse.prevX = mouse.x;
    mouse.prevY = mouse.y;
    mouse.x = (clientX - rect.left) * scaleX;
    mouse.y = (clientY - rect.top) * scaleY;
    mouse.vx = mouse.x - mouse.prevX;
    mouse.vy = mouse.y - mouse.prevY;

    if (specularGleam) {
      const normX = (mouse.x - orbCenter) / orbCenter;
      const normY = (mouse.y - orbCenter) / orbCenter;
      specularGleam.style.transform = `translate(${normX * 12}px, ${normY * 12}px)`;
    }
  }

  canvas.addEventListener('pointerdown', (e) => {
    mouse.isDown = true;
    mouse.isInside = true;
    updatePointerPosition(e.clientX, e.clientY);
    triggerShockwave(mouse.x, mouse.y);

    if (oracleState === 'gathering') {
      disperseWord();
    }
  });

  canvas.addEventListener('pointermove', (e) => {
    mouse.isInside = true;
    updatePointerPosition(e.clientX, e.clientY);
  });

  window.addEventListener('pointerup', () => {
    mouse.isDown = false;
  });

  canvas.addEventListener('pointerleave', () => {
    mouse.isInside = false;
  });

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
      mouse.isInside = true;
      triggerShockwave(mouse.x, mouse.y);
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.isInside = false;
  });

  // Formulario y preguntas sugeridas
  if (oracleForm) {
    oracleForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (questionInput) {
        questionInput.value = '';
        questionInput.blur();
      }
      askOracle();
    });
  }

  quickPrompts.forEach(btn => {
    btn.addEventListener('click', () => {
      askOracle();
    });
  });

  /* =========================================================================
     5. BUCLE DE RENDERIZADO A 60 FPS
     ========================================================================= */
  function renderLoop() {
    requestAnimationFrame(renderLoop);

    ctx.save();
    ctx.fillStyle = 'rgba(2, 1, 4, 0.22)';
    ctx.fillRect(0, 0, orbSize, orbSize);

    ctx.beginPath();
    ctx.arc(orbCenter, orbCenter, orbRadius - 2, 0, Math.PI * 2);
    ctx.clip();

    // Resplandor cósmico tenue en el centro
    const grad = ctx.createRadialGradient(orbCenter, orbCenter, 0, orbCenter, orbCenter, orbRadius);
    grad.addColorStop(0, 'rgba(45, 18, 25, 0.18)');
    grad.addColorStop(0.65, 'rgba(15, 8, 12, 0.45)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, orbSize, orbSize);

    // Actualizar ondas de choque
    for (let i = shockwaves.length - 1; i >= 0; i--) {
      const sw = shockwaves[i];
      sw.radius += sw.speed;
      sw.alpha *= 0.94;

      ctx.strokeStyle = `rgba(255, 183, 3, ${sw.alpha * 0.85})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();

      if (sw.alpha <= 0.02 || sw.radius >= sw.maxRadius) {
        shockwaves.splice(i, 1);
      }
    }

    // Actualizar partículas
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    ctx.restore();
  }

  // Inicializar
  const frameImg = document.querySelector('.obsidian-altar-frame');
  if (frameImg) {
    if (frameImg.complete) {
      resizeCanvas();
    } else {
      frameImg.addEventListener('load', resizeCanvas);
    }
  }

  if (window.ResizeObserver && canvas.parentElement) {
    const ro = new ResizeObserver(() => {
      resizeCanvas();
    });
    ro.observe(canvas.parentElement);
  }

  resizeCanvas();
  initParticles();
  renderLoop();

  window.addEventListener('resize', resizeCanvas);
}
