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
  const questionInput = document.getElementById('obsidianQuestionInput');
  const quickPrompts = document.querySelectorAll('.obsidian-quick-prompt');
  const consultBtn = document.getElementById('obsidianConsultBtn');

  // Tarjeta de revelación oracular viva
  const revealCard = document.getElementById('obsidianOracleReveal');
  const revealBadge = revealCard?.querySelector('.obsidian-reveal-badge');
  const revealKeyword = document.getElementById('obsidianRevealKeyword');
  const revealMeaning = document.getElementById('obsidianRevealMeaning');
  const revealGuide = document.getElementById('obsidianRevealGuide');
  const revealElement = document.getElementById('obsidianRevealElement');
  const resetConsultBtn = document.getElementById('obsidianResetConsultBtn');

  if (!canvas || !rasterCanvas) return;

  const ctx = canvas.getContext('2d');
  const rasterCtx = rasterCanvas.getContext('2d');

  let orbSize = 480;
  let orbCenter = orbSize / 2;
  let orbRadius = orbSize / 2;

  const PARTICLE_COUNT = 2400;
  const particles = [];
  const shockwaves = [];

  let oracleState = 'orbiting'; // 'orbiting' | 'trance' | 'gathering'
  let gatherTimer = null;
  let currentWord = '';
  let activeTextLines = [];
  let activeFontSize = 28;
  let activeLineHeight = 36;
  let activeStartY = 0;
  let textRevealAlpha = 0;

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
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 2.5) {
          // Bloqueo estable en el trazo con micro-brillo viviente
          this.x = this.textTargetX + (Math.random() - 0.5) * 0.45;
          this.y = this.textTargetY + (Math.random() - 0.5) * 0.45;
          this.vx = 0;
          this.vy = 0;
        } else {
          this.vx = (this.vx + dx * 0.08) * 0.75;
          this.vy = (this.vy + dy * 0.08) * 0.75;
        }
        this.alpha = Math.min(1.0, this.alpha + 0.06);
      } else {
        // Si estamos en gathering pero esta partícula no forma parte del texto:
        if (oracleState === 'gathering') {
          // Atenuar y empujar suavemente hacia la corona exterior para dar máximo contraste al centro
          this.alpha = Math.max(0.12, this.alpha * 0.94);
          const fromCenterX = this.x - orbCenter;
          const fromCenterY = this.y - orbCenter;
          const distCenter = Math.sqrt(fromCenterX * fromCenterX + fromCenterY * fromCenterY);
          if (distCenter < orbRadius * 0.65 && distCenter > 1) {
            const push = (1 - distCenter / (orbRadius * 0.65)) * 1.6;
            this.vx += (fromCenterX / distCenter) * push;
            this.vy += (fromCenterY / distCenter) * push;
          }
        }

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

        if (gyro.active) {
          this.vx += gyro.gx * 0.18;
          this.vy += gyro.gy * 0.18;
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
     3. RASTERIZADOR Y CATÁLOGO DE REVELACIONES TOLTECAS
     ========================================================================= */
  const TOLTEC_REVELATIONS = [
    {
      keyword: "MIRA HACIA ADENTRO",
      meaning: "La respuesta que buscas en el mundo exterior ya habita en el silencio de tu propio corazón. Detén el ruido del pensamiento y escucha tu intuición más profunda.",
      element: "Fuego Interior",
      guide: "Tezcatlipoca · El Espejo Humeante"
    },
    {
      keyword: "TRANSFORMA LA SOMBRA",
      meaning: "Aquello que rechazas o temes en ti mismo es tu mayor reserva de fuerza espiritual. No huyas de tu sombra; abrázala para convertirla en medicina y sabiduría.",
      element: "Obsidiana & Humo",
      guide: "Ocelotl · Jaguar Sagrado"
    },
    {
      keyword: "DESPIERTA EL NAHUAL",
      meaning: "Es momento de trascender la visión ordinaria de tu realidad. Tu guardián espiritual te impulsa a dar un salto de valentía, lucidez y transmutación.",
      element: "Viento & Serpiente",
      guide: "Quetzalcóatl · Aliento de Sabiduría"
    },
    {
      keyword: "SILENCIA EL EGO",
      meaning: "La necesidad constante de control y validación es solo un reflejo distorsionado. Cuando aquietas la mente, el camino del guerrero se revela con nitidez.",
      element: "Agua Mística",
      guide: "Chantico · Fuego del Hogar"
    },
    {
      keyword: "AVANZA SIN MIEDO",
      meaning: "La indecisión paraliza el poder del espíritu. Todo el linaje de tus ancestros camina a tu lado: da el paso que has postergado con plena determinación.",
      element: "Llama Solar",
      guide: "Tonatiuh · Fuerza Guerrera"
    },
    {
      keyword: "CONFÍA EN EL VACÍO",
      meaning: "Lo que parece pérdida es espacio sagrado para lo que renace. No temas soltar lo que ya cumplió su ciclo; el universo llena el vacío con gracia.",
      element: "Éter Tolteca",
      guide: "Tloque Nahuaque · El Que Todo lo Abarca"
    },
    {
      keyword: "HONRA TU PALABRA",
      meaning: "Tu palabra es un decreto cósmico que moldea tu destino. Habla con absoluta impecabilidad, sin juzgarte y cumpliendo tus acuerdos íntimos.",
      element: "Palabra Florida",
      guide: "In Xochitl In Cuicatl · Flor y Canto"
    },
    {
      keyword: "FUEGO SAGRADO",
      meaning: "El fuego sagrado de Chantico purifica las memorias de dolor. Permite que la alquimia interior consuma tus apegos para que renazcas en libertad.",
      element: "Llama de Transmutación",
      guide: "Chantico · Guardiana del Fuego"
    },
    {
      keyword: "RETORNA A TU CENTRO",
      meaning: "Has estado dispersando tu atención en exigencias ajenas. Vuelve a tu eje vital, respira el instante presente y recupera tu calma fundamental.",
      element: "Tierra Madre",
      guide: "Coatlicue · Matriz de Sanación"
    },
    {
      keyword: "FLORECE EN EL CAOS",
      meaning: "Las mayores transmutaciones del alma ocurren en medio del movimiento inesperado. No intentes detener el torbellino; aprende a volar con él.",
      element: "Viento Sagrado",
      guide: "Ehécatl · Viento Cósmico"
    }
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

    const words = word.trim().split(/\s+/);
    let lines = [];
    if (words.length <= 2) {
      lines.push(word);
    } else if (words.length === 3) {
      lines.push(words.slice(0, 2).join(' '));
      lines.push(words[2]);
    } else {
      const mid = Math.ceil(words.length / 2);
      lines.push(words.slice(0, mid).join(' '));
      lines.push(words.slice(mid).join(' '));
    }

    // Auto-ajuste de tamaño proporcional al diámetro seguro del orbe
    const maxSafeWidth = w * 0.70;
    let fontSize = Math.floor(w * (lines.length > 2 ? 0.082 : lines.length > 1 ? 0.096 : 0.118));
    const spacingPx = Math.max(3, Math.floor(fontSize * 0.1));
    rasterCtx.font = `900 ${fontSize}px 'Outfit', 'Cinzel', system-ui, sans-serif`;
    if ('letterSpacing' in rasterCtx) rasterCtx.letterSpacing = `${spacingPx}px`;

    while (lines.some(l => rasterCtx.measureText(l).width > maxSafeWidth) && fontSize > 16) {
      fontSize -= 1.5;
      rasterCtx.font = `900 ${fontSize}px 'Outfit', 'Cinzel', system-ui, sans-serif`;
      if ('letterSpacing' in rasterCtx) rasterCtx.letterSpacing = `${Math.max(3, Math.floor(fontSize * 0.1))}px`;
    }

    const lineHeight = fontSize * 1.34;
    const startY = (h / 2) - ((lines.length - 1) * lineHeight) / 2;

    activeTextLines = lines;
    activeFontSize = fontSize;
    activeLineHeight = lineHeight;
    activeStartY = startY;
    textRevealAlpha = 0;

    lines.forEach((line, index) => {
      rasterCtx.fillText(line, w / 2, startY + (index * lineHeight));
    });

    const imgData = rasterCtx.getImageData(0, 0, w, h).data;
    const targetCoords = [];
    const step = 3; // Muestreo denso de 3px para trazos continuos y definidos

    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        const index = (y * w + x) * 4;
        const alpha = imgData[index + 3];
        if (alpha > 70) {
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
        p.size = Math.random() * 0.7 + 2.0;
        p.baseColor = Math.random() > 0.65 ? '#FFFFFF' : Math.random() > 0.3 ? '#FFF6D6' : '#FFD166';
      } else {
        p.hasTarget = false;
        p.baseColor = Math.random() > 0.5 ? '#FFB703' : '#F5A623';
      }
    }
  }

  function askOracle(customQuestion) {
    if (oracleState === 'trance') return;

    if (!audioCtx) initAudio();
    if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();

    // Seleccionar revelación oracular sabia
    const revelation = TOLTEC_REVELATIONS[Math.floor(Math.random() * TOLTEC_REVELATIONS.length)];

    triggerShockwave(orbCenter, orbCenter);
    if (isAudioActive) playTibetanBowl(432, 5.0);

    // Feedback visual en el botón y en la tarjeta de revelación
    if (consultBtn) {
      consultBtn.disabled = true;
      consultBtn.innerHTML = '<span>INVOCANDO...</span><span style="animation: spin 1s infinite linear;">✦</span>';
    }

    if (revealCard) {
      revealCard.style.display = 'block';
      if (revealBadge) revealBadge.textContent = 'INVOCANDO ORÁCULO...';
      if (revealKeyword) revealKeyword.textContent = '«SINTONIZANDO EL ESPEJO...»';
      if (revealMeaning) {
        revealMeaning.textContent = customQuestion 
          ? `El fuego sagrado está recibiendo tu intención: "${customQuestion}". Las partículas de obsidiana se alinean con tu tonal...`
          : 'El oráculo tolteca de Tezcatlipoca abre el vórtice de visión. Las partículas de obsidiana transmutan tu intención...';
      }
      if (revealGuide) revealGuide.textContent = 'Canalizando sabiduría ancestral...';
      if (revealElement) revealElement.textContent = 'Frecuencia: 432 Hz';
    }

    oracleState = 'trance';
    particles.forEach(p => {
      p.vx = (Math.random() - 0.5) * 14;
      p.vy = (Math.random() - 0.5) * 14;
    });

    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([40, 60, 80]);
    }

    setTimeout(() => {
      renderCurrentWordToTargets(revelation.keyword);
      oracleState = 'gathering';
      if (isAudioActive) playTibetanBowl(540, 3.5);

      if (revealCard) {
        if (revealBadge) revealBadge.textContent = 'RESPUESTA REVELADA';
        if (revealKeyword) revealKeyword.textContent = `«${revelation.keyword}»`;
        if (revealMeaning) revealMeaning.textContent = revelation.meaning;
        if (revealGuide) revealGuide.textContent = `${revelation.guide}`;
        if (revealElement) revealElement.textContent = `Elemento: ${revelation.element}`;
      }

      if (consultBtn) {
        consultBtn.disabled = false;
        consultBtn.innerHTML = '<span>CONSULTAR</span><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
      }

      clearTimeout(gatherTimer);
      gatherTimer = setTimeout(() => {
        disperseWord();
      }, 9500);
    }, 700);
  }

  function disperseWord() {
    clearTimeout(gatherTimer);
    if (oracleState !== 'gathering') return;
    oracleState = 'orbiting';
    textRevealAlpha = 0;
    activeTextLines = [];
    particles.forEach(p => {
      p.hasTarget = false;
      p.baseColor = Math.random() > 0.4 ? '#FFD166' : '#FFB703';
      p.size = Math.random() * 1.9 + 0.8;
      p.vx += (Math.random() - 0.5) * 6;
      p.vy += (Math.random() - 0.5) * 6;
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

  // Soporte de Giroscopio Sagrado Exclusivo para Móviles
  const gyro = { gx: 0, gy: 0, active: false };
  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.gamma !== null && e.beta !== null) {
        gyro.active = true;
        // gamma: inclinación eje X, beta: inclinación eje Y
        gyro.gx = Math.max(-1.5, Math.min(1.5, e.gamma / 25));
        gyro.gy = Math.max(-1.5, Math.min(1.5, (e.beta - 40) / 25));
      }
    }, { passive: true });
  }

  let hapticPulseTimer = null;

  canvas.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
      mouse.isInside = true;
      triggerShockwave(mouse.x, mouse.y);

      // Feedback háptico rítmico móvil (Pulso Tolteca)
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([35, 40, 20]);
        clearInterval(hapticPulseTimer);
        hapticPulseTimer = setInterval(() => {
          if (mouse.isInside && window.navigator.vibrate) {
            window.navigator.vibrate([15, 60, 25]);
          }
        }, 360);
      }
    }
  }, { passive: true });

  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      updatePointerPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  canvas.addEventListener('touchend', () => {
    mouse.isInside = false;
    clearInterval(hapticPulseTimer);
  });


  // Formulario y preguntas sugeridas
  const oracleFormElem = document.getElementById('obsidianOracleForm');
  if (oracleFormElem) {
    oracleFormElem.addEventListener('submit', (e) => {
      e.preventDefault();
      const question = questionInput?.value.trim() || '';
      askOracle(question);
    });
  }

  quickPrompts.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const q = btn.getAttribute('data-question') || btn.textContent.trim();
      if (questionInput) {
        questionInput.value = q;
      }
      askOracle(q);
    });
  });

  if (resetConsultBtn) {
    resetConsultBtn.addEventListener('click', () => {
      disperseWord();
      if (revealCard) revealCard.style.display = 'none';
      if (questionInput) {
        questionInput.value = '';
        questionInput.focus();
      }
    });
  }

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

    // Renderizado del cuerpo tipográfico sagrado de alta definición
    if (oracleState === 'gathering') {
      textRevealAlpha = Math.min(1.0, textRevealAlpha + 0.05);
    } else {
      textRevealAlpha = Math.max(0, textRevealAlpha - 0.08);
    }

    if (activeTextLines.length > 0 && textRevealAlpha > 0.01) {
      ctx.save();
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `900 ${activeFontSize}px 'Outfit', 'Cinzel', system-ui, sans-serif`;
      const spacingPx = Math.max(3, Math.floor(activeFontSize * 0.1));
      if ('letterSpacing' in ctx) ctx.letterSpacing = `${spacingPx}px`;

      // Capa A: Resplandor cálido exterior de fuego sagrado
      ctx.shadowColor = 'rgba(255, 183, 3, 0.85)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = `rgba(255, 183, 3, ${textRevealAlpha * 0.65})`;
      activeTextLines.forEach((line, index) => {
        ctx.fillText(line, orbCenter, activeStartY + (index * activeLineHeight));
      });

      // Capa B: Delineado oscuro de contraste profundo (define el filo de cada letra)
      ctx.shadowBlur = 0;
      ctx.strokeStyle = `rgba(15, 8, 8, ${textRevealAlpha * 0.85})`;
      ctx.lineWidth = Math.max(2.5, activeFontSize * 0.09);
      activeTextLines.forEach((line, index) => {
        ctx.strokeText(line, orbCenter, activeStartY + (index * activeLineHeight));
      });

      // Capa C: Núcleo blanco marfil resplandeciente (máxima nitidez y legibilidad instantánea)
      ctx.shadowBlur = 3;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
      ctx.fillStyle = `rgba(255, 255, 255, ${textRevealAlpha * 0.98})`;
      activeTextLines.forEach((line, index) => {
        ctx.fillText(line, orbCenter, activeStartY + (index * activeLineHeight));
      });

      ctx.restore();
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
