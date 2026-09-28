/**
 * Cursor Místico CHANTICO: Símbolos Sagrados Toltecas & Fuego Sagrado
 * 
 * Implementa un cursor interactivo de alta precisión y cero lag que alterna
 * entre arquetipos y símbolos sagrados toltecas / mexicas:
 * - 🔥 Fuego Sagrado (Chantico)
 * - 🪶 Pluma & Sabiduría (Quetzalcóatl)
 * - ☀️ Sol Radiante (Tonatiuh)
 * - 👁️ Espejo de Obsidiana (Tezcatlipoca)
 * - 🗡️ Pedernal / Técpatl
 * - 🐍 Serpiente Divina (Coatlicue)
 * - 🌀 Movimiento Cósmico (Ollin)
 */

const TOLTEC_SYMBOLS = [
  { symbol: '🔥', name: 'Chantico — Fuego Sagrado' },
  { symbol: '🪶', name: 'Quetzalcóatl — Sabiduría' },
  { symbol: '☀️', name: 'Tonatiuh — Sol Radiante' },
  { symbol: '👁️', name: 'Tezcatlipoca — Espejo de Obsidiana' },
  { symbol: '🗡️', name: 'Técpatl — Fuerza & Claridad' },
  { symbol: '🐍', name: 'Coatlicue — Madre Tierra' },
  { symbol: '🌀', name: 'Ollin — Movimiento & Evolución' }
];

export function initNumerologyCursor() {
  // Desactivar en dispositivos táctiles para máxima usabilidad móvil
  if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) {
    return;
  }

  // Limpiar elementos previos si existieran
  document.getElementById('chantico-cursor')?.remove();
  document.getElementById('chantico-cursor-dot')?.remove();

  // 1. Crear punto de hardware central (Cero lag)
  const dot = document.createElement('div');
  dot.id = 'chantico-cursor-dot';
  dot.className = 'chantico-cursor-dot';
  document.body.appendChild(dot);

  // 2. Crear halo y contenedor del símbolo tolteca
  const ring = document.createElement('div');
  ring.id = 'chantico-cursor';
  ring.className = 'chantico-cursor-ring';
  ring.innerHTML = `
    <span class="chantico-cursor-glyph" id="chantico-glyph">🔥</span>
    <span class="chantico-cursor-spark"></span>
  `;
  document.body.appendChild(ring);

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let currentSymbolIndex = 0;
  let isHovered = false;

  const glyphEl = document.getElementById('chantico-glyph');

  // Ciclo periódico o por interacción de símbolos toltecas
  function nextToltecSymbol() {
    currentSymbolIndex = (currentSymbolIndex + 1) % TOLTEC_SYMBOLS.length;
    if (glyphEl) {
      glyphEl.style.transform = 'scale(0) rotate(-45deg)';
      setTimeout(() => {
        glyphEl.textContent = TOLTEC_SYMBOLS[currentSymbolIndex].symbol;
        glyphEl.style.transform = 'scale(1) rotate(0deg)';
      }, 150);
    }
  }

  // Cambio automático cada 5 segundos
  const symbolInterval = setInterval(nextToltecSymbol, 5000);

  // Seguimiento del mouse
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Dot responde al instante
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  }, { passive: true });

  // Animación del halo seguidor suave (Lerp)
  function render() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;

    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Detección de elementos interactivos (hover state)
  const interactiveSelectors = 'a, button, [role="button"], input, select, textarea, .product-card, .experience-card, .btn';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovered = true;
      ring.classList.add('is-hovered');
      dot.classList.add('is-hovered');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveSelectors)) {
      isHovered = false;
      ring.classList.remove('is-hovered');
      dot.classList.remove('is-hovered');
    }
  });

  // Efecto de pulso en click
  window.addEventListener('mousedown', () => {
    ring.classList.add('is-clicking');
    nextToltecSymbol();
  });

  window.addEventListener('mouseup', () => {
    ring.classList.remove('is-clicking');
  });

  // Ocultar si sale de la ventana
  document.addEventListener('mouseleave', () => {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  document.addEventListener('mouseenter', () => {
    dot.style.opacity = '1';
    ring.style.opacity = '1';
  });
}
