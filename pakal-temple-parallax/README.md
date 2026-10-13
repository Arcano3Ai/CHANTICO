# PAKAL TUN — Experiencia Parallax 3D Templo Maya

Landing page interactiva con efecto parallax multidimensional inspirada en el templo monumental maya de **Pakal Tun**, diseñada bajo estándares de ingeniería frontend senior a **60 FPS constantes**.

---

## 🏛️ Arquitectura de Capas (Parallax Layers)

| Capa | Elemento Visual | Comportamiento Parallax (Scroll 3D) |
|---|---|---|
| **Capa 0 (Fondo)** | Cielo del amanecer, nubes y sol naciente | Desplazamiento lento ascendente (`-0.25x`) con sutil *zoom out* y rayos solares volumétricos (*God Rays*). |
| **Partículas** | Polvo cósmico y polen de jade | Simulación física continua en Canvas HTML5 con reacción dinámica al viento del scroll. |
| **Capa 1 (Media)** | Templo monumental y selva circundante | Efecto *Dolly-In* tridimensional (`scale 1.0 -> 1.16`, `translateY`) simulando la aproximación física a la montaña. |
| **Bruma** | Niebla volumétrica entre terrazas | Pulso sutil y deriva lateral para dar atmósfera mística de selva húmeda. |
| **Capa 2** | Explorador sobre la escalinata | Ascenso vertical independiente (`-270px`) simulando sus pasos hacia la entrada del santuario. |
| **Capa 2B** | Santuario superior de Pakal Tun | Enfoque gradual con resplandor dorado y jade al coronar la cima. |
| **Capa 3 (Primer Plano)** | Hojas gigantes tropicales y mascarón de jade | Desplazamiento acelerado hacia abajo y apertura lateral (`+320px`), saliendo del encuadre. |

---

## 🚀 Despliegue Rápido con Docker

### 1. Construir la imagen de Docker
```bash
docker build -t pakal-temple-parallax:latest .
```

### 2. Ejecutar el contenedor en producción (Puerto 8080)
```bash
docker run -d --name pakal-temple -p 8080:80 pakal-temple-parallax:latest
```

### 3. Verificar el estado del despliegue
Abre tu navegador en:
`http://localhost:8080`

Para inspeccionar el healthcheck:
```bash
docker inspect --format='{{json .State.Health.Status}}' pakal-temple
```

---

## 💻 Ejecución Local sin Docker

### Opción A: Con Node.js / npx
```bash
npx serve .
# o
npx http-server -p 3000
```

### Opción B: Con Python 3
```bash
python -m http.server 8080
```

---

## ⚡ Optimizaciones Técnicas y de Rendimiento (60 FPS)

1. **Aceleración por GPU**: Todas las capas utilizan `transform: translate3d(x, y, 0) scale(...)` y `will-change: transform`, evitando repaints y layout thrashing.
2. **Motor de Inercia Lerp (Linear Interpolation)**: Bucle desacoplado de `requestAnimationFrame` que suaviza la aceleración del scroll como una cámara de cine.
3. **Web Audio API Procedural**: Generador nativo de brisa de selva y campanas pentatónicas mayas (notas A, C, D, E, G) sin dependencias ni archivos externos.
4. **Accesibilidad y Degradación Elegante**: Soporte nativo para `@media (prefers-reduced-motion: reduce)` para usuarios con sensibilidad al movimiento.
5. **Nginx Alpine de Producción**: Imagen ultra-ligera (<25MB) con compresión gzip activada y cabeceras de caché estricto (`max-age=2592000`).
