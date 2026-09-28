// Canvas de Partículas y Halo Estelar Dorado NÜMA

export function initParticles(canvasId = 'particles-canvas') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let animationFrameId;
  let width, height;
  let particles = [];
  const particleCount = 45; // Densidad equilibrada y elegante

  let mouse = {
    x: -1000,
    y: -1000,
    radius: 120
  };

  function resize() {
    width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.5 + 0.15,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.35 - 0.15, // Ligero movimiento ascendente
        pulseSpeed: Math.random() * 0.02 + 0.005,
        pulseFactor: 0
      });
    }
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulseFactor += p.pulseSpeed;

      // Wrap-around
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Interacción sutil con el mouse
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist) / mouse.radius;
        p.x -= Math.cos(angle) * force * 1.2;
        p.y -= Math.sin(angle) * force * 1.2;
      }

      // Brillo oscilante
      const currentAlpha = p.alpha + Math.sin(p.pulseFactor) * 0.15;
      const safeAlpha = Math.max(0.08, Math.min(0.85, currentAlpha));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 215, 0, ${safeAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(255, 215, 0, 0.4)';
      ctx.fill();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  canvas.parentElement.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  canvas.parentElement.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  resize();
  render();

  return () => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', resize);
  };
}
