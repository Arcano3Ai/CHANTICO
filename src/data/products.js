export const PRODUCTS = [
  // --- BARAJAS DE TAROT & LIBROS OFICIALES CHANTICO ---
  {
    id: 'tarot-tolteca-chicas',
    name: 'Tarot Tolteca Cartas y Bolsa (Cartas Chicas)',
    category: 'libros',
    categoryLabel: 'Tarot & Barajas',
    price: 300,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 84,
    isFeatured: true,
    badge: 'Más Vendido',
    image: './assets/images/official/tarot_tolteca_chicas.jpg',
    tagline: 'Mosaico de 52 cartas originales de la cosmovisión tolteca con bolsa protectora.',
    description: 'La baraja emblemática de Chantico diseñada por Isabella Ameyalli. 52 cartas impresas en cartulina de alta calidad que reinterpretan los arquetipos mexicas y toltecas (Ometéotl, Coatlicue, Tezcatlipoca, Tonatiuh, Tláloc). Incluye bolsa de terciopelo artesanal.',
    aroma: {
      salida: 'Copal & Resinas Sagradas',
      corazon: 'Tintas Ecológicas Vivas',
      fondo: 'Consagradas al Fuego'
    },
    experience: 'Ideal para tiradas intuitivas diarias, conexión con nahuales y estudio personal.',
    variants: [
      { id: 'ttc-chicas', label: 'Baraja Chicas (Bolsa Incluida)', price: 300 }
    ],
    inStock: true,
    stockQuantity: 45
  },
  {
    id: 'tarot-tolteca-grandes',
    name: 'Tarot Tolteca Cartas y Bolsa (Cartas Grandes)',
    category: 'libros',
    categoryLabel: 'Tarot & Barajas',
    price: 400,
    originalPrice: 550,
    rating: 5.0,
    reviewsCount: 63,
    isFeatured: true,
    badge: 'Edición Altar',
    image: './assets/images/official/tarot_tolteca_grandes.jpg',
    tagline: 'Cartas en gran formato para lecturas profesionales, altares y contemplación.',
    description: 'Formato amplio para apreciar cada detalle del arte sagrado tolteca. Excelente textura al barajar y alta durabilidad. Viene acompañada de bolsa ritual de protección bordada.',
    aroma: {
      salida: 'Resina de Copal Blanco',
      corazon: 'Pigmentos Brillantes',
      fondo: 'Bendición de Humo Sagrado'
    },
    experience: 'La elección preferida de tarotistas profesionales para sesiones presenciales y virtuales.',
    variants: [
      { id: 'ttg-grandes', label: 'Baraja Formato Grande (Bolsa Incluida)', price: 400 }
    ],
    inStock: true,
    stockQuantity: 32
  },
  {
    id: 'tarot-espejo-obsidiana-completo',
    name: 'Tarot Tolteca Espejo de Obsidiana (Libro y Tarot)',
    category: 'libros',
    categoryLabel: 'Libro & Baraja Completa',
    price: 900,
    originalPrice: 1100,
    rating: 5.0,
    reviewsCount: 92,
    isFeatured: true,
    badge: 'Obra Completa',
    image: './assets/images/official/tarot_espejo_obsidiana.png',
    tagline: 'El set definitivo: Libro de estudio profundo + Baraja completa de 52 cartas.',
    description: 'El compendio maestro de Isabella Ameyalli. Incluye el libro de texto con la explicación psicológica y espiritual de cada arquetipo tolteca, tiradas de vidas pasadas y misión de vida, más la baraja original completa en estuche de colección.',
    aroma: {
      salida: 'Papel fino de edición especial',
      corazon: 'Guía de 200+ páginas a color',
      fondo: 'Caja rígida conmemorativa'
    },
    experience: 'Tu iniciación completa en la sabiduría de la Toltecáyotl y el despertar del Sexto Sol.',
    variants: [
      { id: 'teo-completo', label: 'Libro Físico + Baraja Oficial', price: 900 }
    ],
    inStock: true,
    stockQuantity: 20
  },

  // --- FIGURAS ARTESANALES & GUARDIANES ---
  {
    id: 'nahualito-guardian',
    name: 'Nahualito Guardián Artesanal',
    category: 'artesanias',
    categoryLabel: 'Figuras Sagradas',
    price: 2000,
    originalPrice: 2400,
    rating: 5.0,
    reviewsCount: 29,
    isFeatured: true,
    badge: 'Pieza Única',
    image: './assets/images/official/nahualito_guardian.png',
    tagline: 'Esculturas artesanales únicas talladas y pintadas a mano, medicina y protección.',
    description: 'Cada nahualito es una creación irrepetible hecha por manos de artesanos mexicanos. Canaliza la energía de un animal de poder (Jaguar, Águila, Serpiente o Colibrí) para anclar la presencia de tus guardianes en tu hogar o altar.',
    aroma: {
      salida: 'Madera de copalillo sagrado',
      corazon: 'Pigmentos naturales brillantes',
      fondo: 'Consagrado en humo de copal y salvia'
    },
    experience: 'Guardián energético para tu espacio sagrado, despacho de lectura o descanso.',
    variants: [
      { id: 'nh-jaguar', label: 'Nahualito Ocelotl (Jaguar - Visión)', price: 2000 },
      { id: 'nh-aguila', label: 'Nahualito Cuauhtli (Águila - Vuelo Elevado)', price: 2000 },
      { id: 'nh-serpiente', label: 'Nahualito Cóatl (Serpiente - Transmutación)', price: 2000 }
    ],
    inStock: true,
    stockQuantity: 8
  },

  // --- VELADORAS TOLTECAS & KITS ---
  {
    id: 'veladoras-toltecas',
    name: 'Veladoras Toltecas Consagradas',
    category: 'velas',
    categoryLabel: 'Veladoras Sagradas',
    price: 200,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 57,
    isFeatured: true,
    badge: 'Fuego Ritual',
    image: './assets/images/official/veladoras_dioses.png',
    tagline: 'Velas rituales preparadas con intención para consagración, apertura y protección.',
    description: 'Formuladas con ceras limpias, aceites esenciales puros y hierbas protectoras (ruda, albahaca, copal y canela). Preparadas artesanalmente con la bendición del fuego de Chantico.',
    aroma: {
      salida: 'Copal & Miel Silvestre',
      corazon: 'Canela de Fuego & Romero',
      fondo: 'Cera Sagrada'
    },
    experience: 'Encendido diario para armonizar la vibración de tu hogar y abrir canales intuitivos.',
    variants: [
      { id: 'vt-proteccion', label: 'Veladora Protección & Limpieza', price: 200 },
      { id: 'vt-prosperidad', label: 'Veladora Fuego & Abundancia', price: 200 },
      { id: 'vt-intuicion', label: 'Veladora Claridad & Tercer Ojo', price: 200 }
    ],
    inStock: true,
    stockQuantity: 40
  },
  {
    id: 'kit-chantico',
    name: 'Kit Espiritual Chantico',
    category: 'kits',
    categoryLabel: 'Kits Rituales',
    price: 980,
    originalPrice: 1150,
    rating: 5.0,
    reviewsCount: 52,
    isFeatured: true,
    badge: 'Insignia',
    image: './assets/images/official/banner_oficial_chantico.jpg',
    tagline: 'Fuego sagrado, velas consagradas, incienso, aceites y elementos rituales.',
    description: 'Consagrado a la divinidad mexica del fuego del hogar y los volcanes. Incluye vela ritual rojo fuego, copal blanco puro, mezcla de aceites alquímicos para unción y pergamino con invocación de protección tolteca.',
    aroma: {
      salida: 'Copal Blanco & Resina Olibano',
      corazon: 'Canela Ancestral & Flor de Cempasúchil',
      fondo: 'Cedro Rojo & Ceniza Volcánica'
    },
    experience: 'Encendido ritual para purificación áurica, apertura de caminos y consagración de altares.',
    variants: [
      { id: 'kit-ch-completo', label: 'Cofre Ceremonial de Fuego Sagrado', price: 980 }
    ],
    inStock: true,
    stockQuantity: 15
  },
  {
    id: 'kit-mictlan',
    name: 'Kit Ritual Mictlán',
    category: 'kits',
    categoryLabel: 'Kits Rituales',
    price: 980,
    originalPrice: 1150,
    rating: 4.9,
    reviewsCount: 38,
    isFeatured: true,
    badge: 'Transmutación',
    image: './assets/images/official/tarot_espejo_obsidiana.png',
    tagline: 'El viaje del alma hacia la quietud, transmutación y paz con los ancestros.',
    description: 'Kit para honrar ciclos que cierran y conectar con la sabiduría de los ancestros. Contiene sahumerio ceremonial de copal negro, vela de cera oscura, obsidiana pulida y guía de meditación tolteca.',
    aroma: {
      salida: 'Copal Negro & Salvia de Montaña',
      corazon: 'Tierra Húmeda & Musgo de Roble',
      fondo: 'Humo Sagrado de Palo Santo'
    },
    experience: 'Ritual de despedida consciente, cortes de lazos y honra de linaje.',
    variants: [
      { id: 'km-completo', label: 'Kit Ritual Mictlán Completo', price: 980 }
    ],
    inStock: true,
    stockQuantity: 12
  }
];

export const CATEGORIES = [
  { id: 'all', label: 'Todos los Productos', icon: '✦' },
  { id: 'libros', label: 'Tarot & Barajas', icon: '📖' },
  { id: 'artesanias', label: 'Nahualitos', icon: '🐾' },
  { id: 'velas', label: 'Veladoras', icon: '🕯️' },
  { id: 'kits', label: 'Kits Rituales', icon: '✨' }
];
