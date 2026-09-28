/**
 * CHANTICO SACRED TOLTEC CURSOR — Puntero Ceremonial Tolteca de Obsidiana & Fuego
 * Diseño elegante, estable y de alta precisión con efecto épico de onda sagrada al hacer click.
 */

import { playHarmonicTone } from './sensoryEngine.js';

export function initNumerologyCursor() {
  // Desactivar completamente en pantallas táctiles móviles
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  // Limpiar elementos antiguos si existieran
  document.getElementById('chantico-cursor')?.remove();
  document.getElementById('chantico-cursor-dot')?.remove();
  document.getElementById('chantico-cursor-pointer')?.remove();
  document.getElementById('chantico-cursor-halo')?.remove();

  // 1. Puntero Sagrado Tolteca (Daga / Flecha Ceremonial de Obsidiana y Oro)
  const pointer = document.createElement('div');
  pointer.id = 'chantico-cursor-pointer';
  pointer.className = 'chantico-cursor-pointer';
  pointer.innerHTML = `
    <svg class="chantico-pointer-svg" width="28" height="28" viewBox="0 0 32 32" fill="none">
      <!-- Sombra de obsidiana -->
      <filter id="toltecGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="rgba(0,0,0,0.7)"/>
        <feDropShadow dx="0" dy="0" stdDeviation="4" flood-color="rgba(255, 183, 3, 0.45)"/>
      </filter>
      <g filter="url(#toltecGlow)">
        <!-- Cuerpo principal de obsidiana negra pulida -->
        <path d="M4 4 L26 13 L17 17 L13 26 Z" fill="#0D0A0A" stroke="#FFD700" stroke-width="1.2" stroke-linejoin="round"/>
        <!-- Bisel facetado reflectivo -->
        <path d="M4 4 L17 17 L13 26 Z" fill="#1A1412" stroke="#FFB703" stroke-width="0.8"/>
        <!-- Núcleo de Fuego Sagrado de Chantico -->
        <circle cx="11" cy="11" r="2.5" fill="#FF5722"/>
        <circle cx="11" cy="11" r="1.2" fill="#FFD700"/>
      </g>
    </svg>
  `;
  document.body.appendChild(pointer);

  // 2. Halo Seguidor Suave (Aura Áurea Tolteca)
  const halo = document.createElement('div');
  halo.id = 'chantico-cursor-halo';
  halo.className = 'chantico-cursor-halo';
  document.body.appendChild(halo);

  let mouseX = -100;
  let mouseY = -100;
  let haloX = -100;
  let haloY = -100;
  let isHovered = false;
  let lastSparkTime = 0;

  // Seguimiento instantáneo del mouse (Cero Lag)
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    pointer.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;

    // Efecto sutil: cuando se mueve rápido, dejar micro-polvo estelar áureo (máximo 1 cada 80ms)
    const now = performance.now();
    if (now - lastSparkTime > 75) {
      lastSparkTime = now;
      createTrailSpark(mouseX, mouseY);
    }
  }, { passive: true });

  // Animación continua del halo seguidor con física Lerp suave
  function render() {
    haloX += (mouseX - haloX) * 0.22;
    haloY += (mouseY - haloY) * 0.22;

    halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Detección de elementos interactivos (Hover)
  const interactiveSelector = 'a, button, [role="button"], input, select, textarea, .product-card, .course-card, .nahual-card-item, .category-filter-btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelector)) {
      if (!isHovered) {
        isHovered = true;
        halo.classList.add('is-hovered');
        pointer.classList.add('is-hovered');
      }
    } else {
      if (isHovered) {
        isHovered = false;
        halo.classList.remove('is-hovered');
        pointer.classList.remove('is-hovered');
      }
    }
  }, { passive: true });

  // =========================================================================
  // EFECTO ÉPICO AL HACER CLICK: ONDA EXPANSIVA DE FUEGO SAGRADO & CHISPAS
  // =========================================================================
  window.addEventListener('mousedown', (e) => {
    halo.classList.add('is-clicking');
    createSacredBurst(e.clientX, e.clientY);
  });

  window.addEventListener('mouseup', () => {
    halo.classList.remove('is-clicking');
  });

  /**
   * Crea una onda de choque concéntrica de fuego tolteca y chispas radiales
   */
  function createSacredBurst(x, y) {
    // 1. Anillo de onda expansiva
    const wave = document.createElement('div');
    wave.className = 'chantico-sacred-wave';
    wave.style.left = `${x}px`;
    wave.style.top = `${y}px`;
    document.body.appendChild(wave);

    setTimeout(() => wave.remove(), 600);

    // 2. Chispas de fuego místico proyectadas radialmente
    const sparkCount = 8;
    for (let i = 0; i < sparkCount; i++) {
      const spark = document.createElement('span');
      spark.className = 'chantico-burst-spark';
      spark.style.left = `${x}px`;
      spark.style.top = `${y}px`;

      const angle = (i / sparkCount) * 2 * Math.PI + (Math.random() * 0.4 - 0.2);
      const distance = 30 + Math.random() * 45;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      spark.style.setProperty('--dx', `${dx}px`);
      spark.style.setProperty('--dy', `${dy}px`);

      document.body.appendChild(spark);
      setTimeout(() => spark.remove(), 550);
    }
  }

  /**
   * Micro-polvo áureo sutil al desplazarse
   */
  function createTrailSpark(x, y) {
    const trail = document.createElement('span');
    trail.className = 'chantico-trail-spark';
    trail.style.left = `${x + (Math.random() * 8 - 4)}px`;
    trail.style.top = `${y + (Math.random() * 8 - 4)}px`;
    document.body.appendChild(trail);

    setTimeout(() => trail.remove(), 400);
  }
}
