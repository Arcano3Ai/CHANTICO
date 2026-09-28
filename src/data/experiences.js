export const EXPERIENCES = [
  // --- SESIONES PERSONALIZADAS ---
  {
    id: 'sesion-tarot-mexicano',
    name: 'Sesión de Tarot Tolteca Evolutivo',
    category: 'sesiones',
    categoryTitle: 'SESIÓN PERSONALIZADA',
    tagline: 'Lectura personalizada con enfoque espiritual y sabiduría de la Toltecayotl.',
    description: 'Una sesión íntima y reveladora facilitada por Nabil Ocelot o Isabella Ameyalli. A través del Tarot Espejo de Obsidiana, devela encrucijadas, conecta con tu nahual regente y recibe orientación directa del fuego sagrado.',
    image: './assets/images/chantico_sesion_tarot_servicio.jpg',
    types: [
      {
        id: 'tarot-tolteca-completo',
        title: 'Lectura Completa Espejo de Obsidiana (60 min)',
        duration: '60 minutos',
        modality: 'Online en Vivo (Zoom / Meet) o Presencial',
        price: 650,
        includes: [
          'Tirada profunda de 52 cartas del Tarot Tolteca',
          'Identificación de nahual protector y tonal mexica',
          'Diagnóstico del fuego interior y corte de lazos energéticos',
          'Grabación de la sesión y fotografía de la tirada'
        ]
      },
      {
        id: 'tarot-tolteca-express',
        title: 'Lectura de Enfoque & Consejo Ancestral (30 min)',
        duration: '30 minutos',
        modality: 'Online en Vivo',
        price: 350,
        includes: [
          'Resolución de una pregunta o decisión crucial',
          'Mensaje de cierre de los guardianes toltecas'
        ]
      }
    ],
    ctaText: 'AGENDAR SESIÓN DE TAROT'
  },

  // --- MASTERCLASSES & CURSOS OFICIALES ---
  {
    id: 'masterclass-tarot-tolteca-intuitivo',
    name: 'Masterclass: Tarot Tolteca Intuitivo',
    category: 'cursos',
    categoryTitle: 'MASTERCLASS OFICIAL',
    tagline: 'Conecta con el Espejo de Obsidiana y despierta tu intuición ancestral.',
    description: 'Aprende a interpretar el Tarot Tolteca desde el corazón y la sabiduría de la Toltecáyotl. Impartida por Isabella Ameyalli, creadora de la baraja Espejo de Obsidiana.',
    image: './assets/images/official/curso_tarot_tolteca.jpg',
    types: [
      {
        id: 'mc-tti-acceso',
        title: 'Acceso a la Masterclass Grabada + PDF',
        duration: '2.5 horas de formación',
        modality: 'Online / Acceso Inmediato',
        price: 200,
        includes: [
          'Video completo de la clase magistral',
          'Guía PDF descargable con la simbología de las 52 cartas',
          'Ejercicios prácticos de consagración y lectura'
        ]
      }
    ],
    ctaText: 'INSCRIBIRME ($200 MXN)'
  },
  {
    id: 'masterclass-tiradas-tarot',
    name: 'Masterclass: Tiradas de Tarot',
    category: 'cursos',
    categoryTitle: 'MASTERCLASS AVANZADA',
    tagline: 'Misión de Vida, Constelaciones Familiares, Vidas Pasadas y Tiradas Profundas.',
    description: 'Domina los métodos de tiradas más poderosos para explorar el linaje ancestral, el propósito álmico y los pactos espirituales.',
    image: './assets/images/official/curso_tiradas_toltecas.jpg',
    types: [
      {
        id: 'mc-tiradas-acceso',
        title: 'Masterclass Completa + Plantillas de Tiradas',
        duration: '3 horas de formación intensiva',
        modality: 'Online / Acceso Inmediato',
        price: 300,
        includes: [
          'Explicación paso a paso de tiradas multidimensionales',
          'Plantillas imprimibles para tu altar de lectura',
          'Acceso a grupo de dudas y práctica'
        ]
      }
    ],
    ctaText: 'INSCRIBIRME ($300 MXN)'
  },
  {
    id: 'masterclass-mundo-espiritual',
    name: 'Masterclass: El Mundo Espiritual',
    category: 'cursos',
    categoryTitle: 'FILOSOFÍA ESPÍRITA',
    tagline: 'Basado en las Leyes Espíritas de Allan Kardec y la mediumnidad consciente.',
    description: 'Explora con rigor, amor y consuelo temas fundamentales: la supervivencia del alma, la reencarnación, las leyes morales universales y la comunicación con el plano espiritual.',
    image: './assets/images/official/curso_mundo_espiritual.jpg',
    types: [
      {
        id: 'mc-mundo-espiritual-acceso',
        title: 'Formación Espírita Completa + Guía de Estudio',
        duration: '4 horas de contenido teórico-práctico',
        modality: 'Online / Acceso Permanente',
        price: 500,
        includes: [
          'Módulos detallados sobre doctrina espírita kardeciana',
          'Manual de estudio en PDF con reflexiones filosóficas',
          'Ejercicios de discernimiento y armonización energética'
        ]
      }
    ],
    ctaText: 'ACCEDER AHORA ($500 MXN)'
  },
  {
    id: 'masterclass-tarot-libertad',
    name: 'Masterclass: Tarot y Libertad',
    category: 'cursos',
    categoryTitle: 'PROFESIONALIZACIÓN',
    tagline: 'Aprende Tarot Intuitivo, lectura profesional y monetización con propósito.',
    description: 'Descubre cómo convertir tu pasión por el tarot en un servicio honesto y abundante. Aprende ética en la lectura, estructura de consultas y cómo atraer a tus consultantes ideales.',
    image: './assets/images/official/curso_tarot_libertad.jpg',
    types: [
      {
        id: 'mc-tarot-libertad-acceso',
        title: 'Masterclass + Guía de Emprendimiento Espiritual',
        duration: '3.5 horas de formación',
        modality: 'Online / Acceso Permanente',
        price: 500,
        includes: [
          'Método integral de lectura intuitiva ética',
          'Estrategia de cobro y monetización sin culpa',
          'Plantillas de agenda y seguimiento de consultantes'
        ]
      }
    ],
    ctaText: 'ACCEDER AHORA ($500 MXN)'
  },
  {
    id: 'curso-pendulo',
    name: 'Curso: Péndulo & Radiestesia',
    category: 'cursos',
    categoryTitle: 'CURSO DE RADIESTESIA',
    tagline: 'Aprende a calibrar tu péndulo, testear energías y armonizar chakras.',
    description: 'La radiestesia como herramienta de diagnóstico y limpieza. Aprende a programar tu péndulo, realizar preguntas claras, limpiar campos áuricos y trabajar con cuadrantes.',
    image: './assets/images/official/curso_pendulo_radiestesia.jpg',
    types: [
      {
        id: 'curso-pendulo-acceso',
        title: 'Curso Completo de Péndulo + Tablas de Trabajo',
        duration: '2.5 horas de clase práctica',
        modality: 'Online / Acceso Permanente',
        price: 300,
        includes: [
          'Calibración y limpieza del péndulo paso a paso',
          'Biometros y plantillas de radiestesia en PDF imprimibles',
          'Técnicas de armonización a distancia'
        ]
      }
    ],
    ctaText: 'INSCRIBIRME ($300 MXN)'
  }
];

export const UPCOMING_EXPERIENCES = [
  {
    id: 'iniciacion-nahuales',
    type: '[PRÓXIMO TALLER]',
    title: 'Iniciación a los Nahuales & Animales de Poder',
    tagline: 'Conexión chamánica tolteca con tus guías espirituales y tótem personal.',
    status: 'Próxima apertura — Primavera 2026',
    availableSoon: true
  },
  {
    id: 'fuego-chantico-retiro',
    type: '[RETIRO SAGRADO]',
    title: 'Retiro del Fuego Sagrado de Chantico',
    tagline: 'Ceremonias de temazcal, sahumerio ancestral y lectura comunitaria de tarot.',
    status: 'Próxima apertura — Cupos limitados',
    availableSoon: true
  },
  {
    id: 'tonalpohualli-mexica',
    type: '[FORMACIÓN AVANZADA]',
    title: 'El Tonalpohualli: Calendario Sagrado Mexica',
    tagline: 'Aprende a interpretar tu tonal y los regentes diarios con Nabil Ocelot.',
    status: 'Próximamente — Registro prioritario',
    availableSoon: true
  }
];

