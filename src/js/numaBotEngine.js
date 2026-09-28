import { PRODUCTS, CATEGORIES } from '../data/products.js';
import { LIFE_PATH_ARCHETYPES, NUMEROLOGY_CONCEPTS } from '../data/numerology.js';
import {
  calculateLifePath,
  calculatePersonalYear,
  calculateSoulNumber,
  calculateExpressionNumber,
  reduceToCoreNumber
} from './numerologyEngine.js';

/**
 * Normaliza cadenas de texto para búsqueda insensible a acentos y puntuación
 */
function normalizeText(text = '') {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/**
 * Mapeo de meses en español a números de dos dígitos
 */
const MONTH_MAP = {
  enero: '01',
  febrero: '02',
  marzo: '03',
  abril: '04',
  mayo: '05',
  junio: '06',
  julio: '07',
  agosto: '08',
  septiembre: '09',
  setiembre: '09',
  octubre: '10',
  noviembre: '11',
  diciembre: '12'
};

/**
 * Intenta extraer una fecha YYYY-MM-DD del texto
 */
function extractBirthDate(text) {
  const norm = normalizeText(text);

  // Formato: DD/MM/YYYY o DD-MM-YYYY
  const slashMatch = norm.match(/\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/);
  if (slashMatch) {
    const day = slashMatch[1].padStart(2, '0');
    const month = slashMatch[2].padStart(2, '0');
    const year = slashMatch[3];
    return `${year}-${month}-${day}`;
  }

  // Formato: YYYY-MM-DD
  const isoMatch = norm.match(/\b(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})\b/);
  if (isoMatch) {
    const year = isoMatch[1];
    const month = isoMatch[2].padStart(2, '0');
    const day = isoMatch[3].padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Formato textual: "15 de marzo de 1990" o "15 marzo 1990"
  const textMatch = norm.match(/\b(\d{1,2})\s+(?:de\s+)?([a-z]+)\s+(?:de\s+)?(\d{4})\b/);
  if (textMatch) {
    const day = textMatch[1].padStart(2, '0');
    const monthName = textMatch[2];
    const year = textMatch[3];
    if (MONTH_MAP[monthName]) {
      return `${year}-${MONTH_MAP[monthName]}-${day}`;
    }
  }

  return null;
}

/**
 * Encuentra productos recomendados por nombre o similitud
 */
function findProductByTerm(queryTerm) {
  const normQuery = normalizeText(queryTerm);
  return PRODUCTS.find(p => {
    const normName = normalizeText(p.name);
    return normName.includes(normQuery) || normQuery.includes(normName);
  });
}

/**
 * Búsqueda de productos en catálogo
 */
function searchProducts(query) {
  const norm = normalizeText(query);
  const words = norm.split(/\s+/).filter(w => w.length > 2);

  const scored = PRODUCTS.map(prod => {
    let score = 0;
    const nameNorm = normalizeText(prod.name);
    const catNorm = normalizeText(prod.categoryLabel + ' ' + prod.category);
    const descNorm = normalizeText(prod.description + ' ' + prod.tagline + ' ' + prod.experience);
    const aromaNorm = normalizeText(
      Object.values(prod.aroma || {}).join(' ')
    );

    // Coincidencia exacta de nombre o categoría
    if (nameNorm.includes(norm)) score += 50;
    if (catNorm.includes(norm)) score += 35;
    if (aromaNorm.includes(norm)) score += 30;
    if (descNorm.includes(norm)) score += 20;

    // Coincidencia por palabras individuales
    words.forEach(word => {
      if (nameNorm.includes(word)) score += 15;
      if (catNorm.includes(word)) score += 10;
      if (aromaNorm.includes(word)) score += 12;
      if (descNorm.includes(word)) score += 6;
    });

    return { prod, score };
  });

  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(item => item.prod);
}

/**
 * Núcleo del Bot: Procesa la entrada del usuario y devuelve respuesta estructurada
 * @param {string} input Mensaje del usuario
 * @returns {{ text: string, products: Array, quickReplies: Array }}
 */
export function processBotQuery(input) {
  if (!input || !input.trim()) {
    return {
      text: 'Estoy aquí para acompañar tu viaje hacia la calma y el autoconocimiento. ¿Deseas consultar tu Carta Numerológica o descubrir una herramienta sagrada de nuestro catálogo?',
      products: [],
      quickReplies: [
        'Calcular mi Camino de Vida',
        'Velas para calmar la mente',
        '¿Qué es un Número Maestro?',
        'Ver Kits de regalo'
      ]
    };
  }

  const raw = input.trim();
  const norm = normalizeText(raw);

  // 1. DETECCIÓN DE FECHA DE NACIMIENTO -> CÁLCULO DIRECTO DE CAMINO DE VIDA Y AÑO PERSONAL
  const birthDate = extractBirthDate(raw);
  if (birthDate) {
    const lifePath = calculateLifePath(birthDate);
    const personalYear = calculatePersonalYear(birthDate);
    const archetype = LIFE_PATH_ARCHETYPES[lifePath];

    if (archetype) {
      // Buscar el producto recomendado del arquetipo en el catálogo
      let matchedProducts = [];
      const prodTokens = archetype.recommendedProduct.split('+').map(s => s.trim());
      prodTokens.forEach(t => {
        const found = findProductByTerm(t);
        if (found && !matchedProducts.some(p => p.id === found.id)) {
          matchedProducts.push(found);
        }
      });

      // Si no encontró por coincidencia exacta, proveer el producto insignia de CHANTICO
      if (matchedProducts.length === 0) {
        matchedProducts.push(PRODUCTS[0]);
      }

      const responseText = `✨ **Tu Frecuencia Sagrada: Camino de Vida ${lifePath}**

**${archetype.title}**
*${archetype.essence}*

🌿 **Vibración:** ${archetype.frequency}
🔥 **Elemento:** ${archetype.element}
💎 **Cristal Afín:** ${archetype.crystal}
🗓️ **Año Personal ${new Date().getFullYear()}:** Vibración ${personalYear} (ciclo de energía y alineación).

📜 **Mensaje de tu Arquetipo:**
${archetype.description}

🧘 **Tu Mantra Sagrado:**
${archetype.mantra}

🕯️ **Ritual & Elemento Recomendado:**
*${archetype.recommendedRitual}* con **${archetype.recommendedProduct}**.`;

      return {
        text: responseText,
        products: matchedProducts,
        quickReplies: [
          '¿Qué significa mi Año Personal?',
          'Velas aromáticas recomendadas',
          '¿Cómo calculo el Número del Alma?',
          'Ver kits de bienestar'
        ]
      };
    }
  }

  // 2. DETECCIÓN DE NÚMEROS ESPECÍFICOS DE ARQUETIPO (1-9, 11, 22, 33)
  const numberPatterns = [
    { num: 11, regex: /\b(numero\s+)?(11|once|maestro\s+11)\b/ },
    { num: 22, regex: /\b(numero\s+)?(22|veintidos|maestro\s+22)\b/ },
    { num: 33, regex: /\b(numero\s+)?(33|treinta\s+y\s+tres|maestro\s+33)\b/ },
    { num: 1, regex: /\b(numero\s+)?(1|uno)\b/ },
    { num: 2, regex: /\b(numero\s+)?(2|dos)\b/ },
    { num: 3, regex: /\b(numero\s+)?(3|tres)\b/ },
    { num: 4, regex: /\b(numero\s+)?(4|cuatro)\b/ },
    { num: 5, regex: /\b(numero\s+)?(5|cinco)\b/ },
    { num: 6, regex: /\b(numero\s+)?(6|seis)\b/ },
    { num: 7, regex: /\b(numero\s+)?(7|siete)\b/ },
    { num: 8, regex: /\b(numero\s+)?(8|ocho)\b/ },
    { num: 9, regex: /\b(numero\s+)?(9|nueve)\b/ }
  ];

  const isAskingAboutNumber = norm.includes('significa') || norm.includes('arquetipo') || norm.includes('numero') || norm.includes('frecuencia') || norm.includes('maestro');

  if (isAskingAboutNumber) {
    for (const item of numberPatterns) {
      if (item.regex.test(norm)) {
        const arch = LIFE_PATH_ARCHETYPES[item.num];
        if (arch) {
          let recProducts = [];
          const prodTokens = arch.recommendedProduct.split('+').map(s => s.trim());
          prodTokens.forEach(t => {
            const found = findProductByTerm(t);
            if (found && !recProducts.some(p => p.id === found.id)) recProducts.push(found);
          });
          if (recProducts.length === 0) {
            recProducts.push(PRODUCTS[0]);
          }

          return {
            text: `✨ **Arquetipo del Número ${arch.number}: ${arch.title}**

🌿 **Esencia:** ${arch.essence}
💫 **Frecuencia:** ${arch.frequency}
💎 **Cristal Conector:** ${arch.crystal} | **Elemento:** ${arch.element}

📜 **Enseñanza:**
${arch.description}

🕊️ **Mantra de Sintonización:**
${arch.mantra}

🔥 **Herramienta CHANTICO Recomendada:**
${arch.recommendedProduct} para acompañar el *${arch.recommendedRitual}*.`,
            products: recProducts,
            quickReplies: [
              'Calcular con mi fecha de nacimiento',
              'Ver productos recomendados',
              '¿Qué son los Números Maestros?',
              'Consultar otro número'
            ]
          };
        }
      }
    }
  }

  // 2B. GUÍA BÁSICA: ¿CUÁL ES MI NÚMERO SEGÚN MI FECHA DE NACIMIENTO? / ¿CÓMO SE CALCULA?
  const isAskingHowToFindNumber = 
    norm.includes('cual es mi numero') || 
    norm.includes('como saber mi numero') || 
    norm.includes('como calculo mi numero') || 
    norm.includes('como calcular mi numero') || 
    norm.includes('depende de la fecha') || 
    norm.includes('segun mi fecha') || 
    norm.includes('saber mi numero') ||
    norm.includes('como saco mi numero');

  if (isAskingHowToFindNumber) {
    return {
      text: `🔢 **¿Cómo saber tu Número según tu Fecha de Nacimiento?**

En la sabiduría numerológica y tolteca de CHANTICO, tu número principal se llama **Camino de Vida** (*Life Path*) y define el mapa vibracional con el que tu alma decidió experimentar el mundo:

✨ **La Fórmula Sagrada:**
Se suman **todos los dígitos** de tu fecha natal (Día + Mes + Año) y se reducen sucesivamente hasta obtener un solo dígito del **1 al 9** (a excepción de los números maestros **11, 22 y 33**, que no se reducen).

🌿 **Ejemplo práctico:**
Si naciste el **15 de Julio de 1993**:
1. Día: 1 + 5 = **6**
2. Mes: 0 + 7 = **7**
3. Año: 1 + 9 + 9 + 3 = 22 → 2 + 2 = **4**
4. Suma total: 6 + 7 + 4 = **17** → 1 + 7 = **8** *(Arquetipo: La Conquista Material y el Poder Creador)*.

💬 **¡Pruébalo ahora mismo!**
Escríbeme tu fecha de nacimiento (por ejemplo: *"Nací el 24/09/1988"* o *"15 de julio de 1993"*) y yo haré el cálculo instantáneo, revelándote tu arquetipo y las herramientas CHANTICO afines a tu vibración.`,
      products: [PRODUCTS[1], PRODUCTS[0]],
      quickReplies: [
        'Nací el 15/07/1993',
        'Nací el 08/11/1986',
        '¿Qué es la numerología?',
        '¿Qué son los Números Maestros?'
      ]
    };
  }

  // 2C. INFORMACIÓN BÁSICA SOBRE NUMEROLOGÍA
  const isAskingBasicNumerology = 
    norm.includes('informacion sobre numerologia') || 
    norm.includes('informacion basica') || 
    norm.includes('que es la numerologia') || 
    norm.includes('explicame numerologia') ||
    norm.includes('como funciona la numerologia');

  if (isAskingBasicNumerology) {
    return {
      text: `📜 **Información Básica sobre la Numerología y Tarot en CHANTICO**

La numerología no es adivinación ni determinismo estricto: es una **brújula de autoconocimiento** ancestral fundada en la premisa pitagórica de que el universo entero se organiza mediante patrones de frecuencia y vibración armónica.

Dentro de CHANTICO exploramos 4 coordenadas esenciales de tu mapa energético:

1. 🧭 **Camino de Vida:** Calculado a partir de tu **fecha completa de nacimiento**. Representa el aprendizaje primario, talentos innatos y lección evolutiva de tu existencia.
2. 💖 **Número del Alma:** Surge de las **vocales de tu nombre de nacimiento**. Describe tus deseos íntimos, lo que anhela tu corazón en silencio.
3. 🎭 **Número de Expresión:** Suma total de **todas las letras de tu nombre**. Muestra las aptitudes prácticas con las que te manifiestas al exterior.
4. 🗓️ **Año Personal:** Ciclo anual individual de 9 fases que te indica en qué etapa estás (iniciar, gestar, florecer, cosechar o descansar).

¿Deseas calcular tu **Camino de Vida** compartiéndome tu fecha de nacimiento?`,
      products: [PRODUCTS[1], PRODUCTS[6]],
      quickReplies: [
        '¿Cuál es mi número según mi fecha?',
        'Nací el 12/04/1995',
        '¿Qué significa el número 11?',
        'Ver herramientas y velas'
      ]
    };
  }

  // 3. CONCEPTOS FUNDAMENTALES DE NUMEROLOGÍA
  if (norm.includes('camino de vida') || norm.includes('sendero')) {
    const concept = NUMEROLOGY_CONCEPTS.find(c => c.id === 'camino-de-vida');
    return {
      text: `🧭 **${concept.title}: ${concept.subtitle}**

${concept.description}

✨ **¿Cómo calcularlo?**
Dime tu fecha de nacimiento (por ejemplo: *"Nací el 14 de agosto de 1992"*) y calcularé tu arquetipo sagrado y herramientas recomendadas de inmediato.`,
      products: [PRODUCTS[1]], // Vela Sagrada Frecuencia del Ser
      quickReplies: [
        'Nací el 14/08/1992',
        'Nací el 03/11/1988',
        '¿Qué es el Número del Alma?',
        '¿Qué es el Año Personal?'
      ]
    };
  }

  if (norm.includes('alma') || norm.includes('numero del alma')) {
    const concept = NUMEROLOGY_CONCEPTS.find(c => c.id === 'numero-del-alma');
    return {
      text: `💖 **${concept.title}: ${concept.subtitle}**

${concept.description}

Escribe tu nombre completo (ejemplo: *"Mi nombre es Sofia Morales"*) para que revele la vibración profunda de tus vocales.`,
      products: [PRODUCTS[0]], // Vela Calma
      quickReplies: [
        'Calcular mi Camino de Vida',
        '¿Qué es el Número de Expresión?',
        'Ver velas de meditación'
      ]
    };
  }

  if (norm.includes('expresion') || norm.includes('mascara sagrada')) {
    const concept = NUMEROLOGY_CONCEPTS.find(c => c.id === 'numero-de-expresion');
    return {
      text: `🎭 **${concept.title}: ${concept.subtitle}**

${concept.description}

Integra todas las letras de tu nombre natal y describe cómo compartes tus dones y energía con el plano exterior.`,
      products: [PRODUCTS[3]], // Jabón Carbón & Oro
      quickReplies: [
        'Calcular mi Camino de Vida',
        '¿Qué es el Año Personal?',
        'Productos para energía y foco'
      ]
    };
  }

  if (norm.includes('ano personal') || norm.includes('ciclo') || norm.includes('ano 2026') || norm.includes('ano actual')) {
    const concept = NUMEROLOGY_CONCEPTS.find(c => c.id === 'ano-personal');
    return {
      text: `🌀 **${concept.title}: ${concept.subtitle}**

${concept.description}

Los ciclos de 9 años marcan fases de inicio, gestación, creatividad, orden, cambio, armonía familiar, introspección, cosecha y trascendencia.

Proporcióname tu día y mes de nacimiento para sintonizar en cuál ciclo estás transitando este año.`,
      products: [PRODUCTS[1]],
      quickReplies: [
        'Nací el 21 de septiembre',
        '¿Qué son los Números Maestros?',
        'Ver rituales de bienestar'
      ]
    };
  }

  if (norm.includes('maestro') || norm.includes('11:11') || norm.includes('numeros maestros')) {
    return {
      text: `🌟 **Los Números Maestros en CHANTICO: 11, 22 y 33**

En la numerología pitagórica sagrada, estos números no se reducen a un solo dígito cuando aparecen como resultado final, ya que portan una octava superior de vibración:

• **11 — El Canal Luminoso:** Intuición despierta, visión espiritual y capacidad de iluminar la conciencia colectiva.
• **22 — El Maestro Constructor:** Capacidad de plasmar ideales elevados y utopías en obras tangibles y legados perdurables.
• **33 — El Amor Crístico:** Servicio incondicional, sanación del corazón y compasión universal.

¿Te resuena alguno de estos números o deseas calcular si portas uno en tu fecha natal?`,
      products: [PRODUCTS[1], PRODUCTS[4]], // Vela Frecuencia + Bruma Áurica
      quickReplies: [
        'Háblame del Número Maestro 11',
        'Háblame del Número Maestro 22',
        'Háblame del Número Maestro 33',
        'Calcular mi fecha'
      ]
    };
  }

  // 4. DETECCIÓN DE CÁLCULO POR NOMBRE
  const nameMatch = raw.match(/(?:mi nombre es|me llamo|soy|nombre:?)\s+([A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,})/i);
  if (nameMatch) {
    const nameFound = nameMatch[1].trim();
    const soulNum = calculateSoulNumber(nameFound);
    const expNum = calculateExpressionNumber(nameFound);

    if (soulNum && expNum) {
      return {
        text: `🌸 **Sintonización Numerológica para ${nameFound}:**

✨ **Número del Alma (Vibración de tus Vocales): ${soulNum}**
Representa los deseos más íntimos de tu ser, lo que anhela tu corazón en silencio y tu mayor motivación interior.

🎭 **Número de Expresión (Consonantes y Vocales): ${expNum}**
Refleja cómo proyectas tus talentos en el mundo y las herramientas con las que construyes tu realidad.

Combina esta vibración con tu **Camino de Vida** compartiéndome tu fecha de nacimiento completa.`,
        products: [PRODUCTS[1], PRODUCTS[6]],
        quickReplies: [
          'Calcular con mi fecha de nacimiento',
          'Velas recomendadas',
          'Ver kits de bienestar'
        ]
      };
    }
  }

  // 5. CONSULTAS DE PRODUCTOS POR BENEFICIO / INTENCIÓN
  // Relajación / Dormir / Calma
  if (norm.includes('dormir') || norm.includes('insomnio') || norm.includes('sueno') || norm.includes('calma') || norm.includes('relajar') || norm.includes('paz') || norm.includes('estres') || norm.includes('ansiedad')) {
    const calmProds = PRODUCTS.filter(p =>
      p.id === 'vela-calma-intensa' ||
      p.id === 'sales-himalaya-loto' ||
      p.id === 'jabon-lavanda-serenidad' ||
      p.id === 'difusor-ultrasonico-obsidian'
    );
    return {
      text: `🌿 **Ritual de Calma & Fuego Purificador CHANTICO**

Para apaciguar la mente, disolver tensiones y preparar tu templo para un sueño restaurador, te sugerimos elementos con aceites esenciales de lavanda silvestre de Provenza, manzanilla noble y sales botánicas del Himalaya:`,
      products: calmProds,
      quickReplies: [
        '¿Cuánto cuesta la Vela Calma Intensa?',
        'Ver Jabón de Lavanda',
        'Calcular mi Camino de Vida',
        'Ver difusores ultrasónicos'
      ]
    };
  }

  // Energía / Foco / Mañanas
  if (norm.includes('energia') || norm.includes('foco') || norm.includes('concentracion') || norm.includes('manana') || norm.includes('vitalidad') || norm.includes('despertar')) {
    const energyProds = PRODUCTS.filter(p =>
      p.id === 'vela-energia-solar' ||
      p.id === 'bruma-aurica-frecuencia' ||
      p.id === 'jabon-carbon-oro' ||
      p.id === 'oleo-esencial-enfoque'
    );
    return {
      text: `☀️ **Elevación de Frecuencia, Vitalidad & Enfoque Mental**

Para despejar la niebla matutina y conectar con tu poder creador, nuestra sinergia botánica de cítricos nobles (naranja dulce, pomelo rosa), romero silvestre y menta piperita brinda claridad sin alterar tu centro:`,
      products: energyProds.length > 0 ? energyProds : [PRODUCTS[2], PRODUCTS[4]],
      quickReplies: [
        'Vela Despertar Solar',
        'Kit Espiritual Chantico',
        'Roll-on Óleo de Enfoque',
        'Calcular mi número'
      ]
    };
  }

  // Meditación Guiada & Música / Pistas
  if (norm.includes('meditacion guiada') || norm.includes('meditaciones guiadas') || norm.includes('cancion') || norm.includes('canciones') || norm.includes('musica') || norm.includes('pista') || norm.includes('audio')) {
    return {
      text: `🧘 **Zona de Meditación & Frecuencias Sagradas de CHANTICO**

Hemos creado una sección consagrada con pistas de meditación y sonoterapia compuestas en frecuencias de afinación natural (432 Hz y 528 Hz) para acompañar tu descanso y tus rituales:

• **Bienvenida al Silencio (432 Hz):** Apertura consciente y calma mental.
• **Frecuencia Sagrada del Ser (432 Hz):** Reconexión profunda con tu nahual.
• **Cuencos Tibetanos & Fuego Interior (528 Hz):** Armonización bioenergética.
• **Respiración Consciente Tolteca (432 Hz):** Aliento de vida de Ehécatl.

Puedes escucharlas de forma gratuita en la sección **MEDITACIÓN GUIADA** o desde el reproductor místico inferior en nuestra web.`,
      products: [PRODUCTS[0], PRODUCTS[1], PRODUCTS[4] || PRODUCTS[0]],
      quickReplies: [
        '¿Cuál es mi número según mi fecha?',
        'Ver Veladoras Toltecas',
        'Kit Espiritual Chantico',
        'Ver barajas de tarot'
      ]
    };
  }

  // Meditación / Espiritualidad / Conexión (Aromas y Velas)
  if (norm.includes('meditar') || norm.includes('meditacion') || norm.includes('ritual') || norm.includes('espiritual') || norm.includes('presencia') || norm.includes('cuencos')) {
    const spiritProds = PRODUCTS.filter(p =>
      p.id.includes('tarot') ||
      p.id.includes('veladora') ||
      p.id.includes('kit')
    );
    return {
      text: `🕯️ **Sintonización del Espacio Sagrado & Fuego de CHANTICO**

Nuestras **Veladoras Toltecas Consagradas** preparadas con copal, hierbas protectoras y cera limpia, junto con la baraja del **Tarot Tolteca Espejo de Obsidiana**, crean la atmósfera perfecta para conectar con tu sabiduría interior y nahuales:`,
      products: spiritProds.length > 0 ? spiritProds : [PRODUCTS[0], PRODUCTS[1]],
      quickReplies: [
        'Ver Barajas de Tarot Tolteca',
        '¿Qué es la sonoterapia con cuencos?',
        'Kit Espiritual Chantico',
        'Calcular mi Nahual y Camino de Vida'
      ]
    };
  }

  // Regalos / Kits
  if (norm.includes('regalo') || norm.includes('kit') || norm.includes('set') || norm.includes('detalle') || norm.includes('obsequio')) {
    const giftProds = PRODUCTS.filter(p => p.category === 'kits' || p.badge === 'Regalo Ideal' || p.badge === 'Insignia');
    return {
      text: `🎁 **Kits Rituales & Cursos de Tarot CHANTICO**

Regalar CHANTICO es despertar el fuego sagrado de la protección y el misticismo. Cada cofre viene en empaque de lujo sostenible con detalles en hot stamping dorado y tarjeta de intención personalizable:`,
      products: giftProds,
      quickReplies: [
        'Cofre Ritual de Calma',
        'Kit Alquimia de la Esencia',
        'Ver todas las velas',
        'Consultar precios'
      ]
    };
  }



  // 6. BÚSQUEDA GENERAL DE PRODUCTOS EN EL CATÁLOGO (Por nombre, aroma o categoría)
  const matched = searchProducts(raw);
  if (matched.length > 0) {
    const topResults = matched.slice(0, 3);
    const categoryDetected = CATEGORIES.find(c => norm.includes(normalizeText(c.label)) || norm.includes(c.id));

    let intro = `🌿 Encontré estas piezas sagradas en nuestro catálogo que resuenan con tu búsqueda:`;
    if (categoryDetected) {
      intro = `✨ Explorando nuestra colección de **${categoryDetected.label}**:`;
    }

    return {
      text: intro,
      products: topResults,
      quickReplies: [
        `¿Qué aroma tiene ${topResults[0]?.name.split(' ')[0] || 'este producto'}?`,
        'Ver todos los precios',
        'Calcular mi Camino de Vida',
        'Productos para relajarme'
      ]
    };
  }

  // 7. PREGUNTAS GENERALES SOBRE NÜMA, EXPERIENCIAS Y CONTACTO
  if (norm.includes('whatsapp') || norm.includes('contacto') || norm.includes('telefono') || norm.includes('celular') || norm.includes('hablar') || norm.includes('asesor') || norm.includes('agendar')) {
    return {
      text: `📱 **Atención Personalizada CHANTICO por WhatsApp**

Puedes comunicarte directamente con nuestro equipo de sintonización y atención al cliente a través de nuestro canal oficial:

✨ **WhatsApp:** [+52 1 844 122 8140](https://wa.me/5218441228140?text=Hola%20CHANTICO%20🔥%20Quisiera%20recibir%20atención%20personalizada)
🕊️ Horario de atención: Lunes a Sábado de 10:00 a 19:00 hrs.

¿Deseas además que te recomiende algún ritual o producto mientras tanto?`,
      products: [PRODUCTS[1], PRODUCTS[0]],
      quickReplies: [
        'Calcular mi Camino de Vida',
        'Velas para calmar la mente',
        'Ver kits de regalo',
        '¿Qué es un Número Maestro?'
      ]
    };
  }

  if (norm.includes('que es numa') || norm.includes('quienes son') || norm.includes('concepto') || norm.includes('marca')) {
    return {
      text: `✨ **Bienvenido a CHANTICO: Tarot & Fuego Sagrado**

CHANTICO es un espacio de sabiduría ancestral tolteca, tarot intuitivo y fuego sagrado que fusiona la pureza botánica, la geometría sagrada, la numerología transpersonal y la sonoterapia con cuencos tibetanos.

Diseñamos rituales, aromas y herramientas conscientes vertidas a mano con cera vegetal, aceites botánicos puros y envases reutilizables para transformar tus rutinas en actos de presencia y calma.`,
      products: [PRODUCTS[1], PRODUCTS[0]],
      quickReplies: [
        'Calcular mi Camino de Vida',
        'Ver colección de velas',
        'Ver jabones artesanales',
        'Agendar una experiencia'
      ]
    };
  }

  if (norm.includes('cuenco') || norm.includes('sonoterapia') || norm.includes('sonido') || norm.includes('432')) {
    return {
      text: `🔔 **Sonoterapia & Frecuencia 432 Hz**

El sonido es medicina para el sistema nervioso. En CHANTICO facilitamos sesiones de tarot mexicano, cursos espirituales y rituales individuales y círculos de meditación con cuencos tibetanos forjados artesanalmente en siete metales sagrados.

Puedes activar la sintonización auditiva en el reproductor inferior izquierdo para escuchar la vibración de 432 Hz mientras exploras nuestro espacio.`,
      products: [PRODUCTS[1]],
      quickReplies: [
        'Agendar sesión de cuencos',
        'Calcular mi Camino de Vida',
        'Vela Sagrada Frecuencia del Ser',
        'Productos para meditar'
      ]
    };
  }

  if (norm.includes('meditacion') || norm.includes('cancion') || norm.includes('canciones') || norm.includes('musica') || norm.includes('audio') || norm.includes('pista')) {
    return {
      text: `🧘 **Zona de Meditación & Frecuencias Sagradas de CHANTICO**

Contamos con una experiencia inmersiva de **Meditación y Sonoterapia Guiada** en 432 Hz y 528 Hz, diseñada para inducir calma mental, armonizar tus nahuales y disolver tensiones.

Puedes reproducir las sesiones directamente desde la sección **MEDITACIÓN GUIADA** o pulsar el reproductor místico en la esquina inferior izquierda de tu pantalla.`,
      products: [PRODUCTS[0], PRODUCTS[1]],
      quickReplies: [
        'Escuchar Frecuencia 432 Hz',
        'Ver rituales de meditación',
        'Calcular mi Nahual y Camino de Vida'
      ]
    };
  }

  if (norm.includes('tolteca') || norm.includes('nahuatl') || norm.includes('lengua') || norm.includes('palabra') || norm.includes('idioma') || norm.includes('niltze')) {
    return {
      text: `🦅 **Sabiduría de la Lengua Sagrada Tolteca en CHANTICO**
      
El Nahual se comunica a través de la vibración ancestral:
• ✨ **¡Niltze! Cualli tonalli**: *«¡Saludos sagrados! Que tu luz y destino sean propicios»*.
• 🔥 **¡Xipantlaza moyolotl!**: *«¡Despierta el fuego que habita en tu corazón!»*.
• 🔮 **¡Toteotl mitzpalehuiltz!**: *«¡Que la gran energía sagrada guíe tu caminar!»*.
• 🙏 **¡Tlazohcamati!**: *«¡Gracias con amor desde el fondo del corazón!»*.
• 🛡️ **¡Chantico tlazotla!**: *«¡El fuego sagrado del hogar bendice y protege tu espacio!»*.
• 🐾 **Nahual**: *«Tu espíritu guía, alter ego sagrado y protector interior»*.`,
      products: [PRODUCTS[1], PRODUCTS[0]],
      quickReplies: [
        'Calcular mi Nahual y Camino de Vida',
        'Ver Curso de Tarot Tolteca',
        '¿Cómo activar mi fuego sagrado?',
        'Ver catálogo de productos'
      ]
    };
  }

  if (norm.includes('hola') || norm.includes('buen') || norm.includes('saludos') || norm.includes('namaste') || norm.includes('inicio')) {
    return {
      text: `🕊️ **¡Niltze! Cualli tonalli.** Saludos sagrados y bienvenida a este espacio místico. Soy tu **Guía Tolteca de CHANTICO**, guardián del fuego sagrado, el tarot tolteca y tus nahuales.

¿En qué sabiduría ancestral puedo orientarte hoy?
• 🦅 Revelar tu **Nahual y Camino de Vida** a partir de tu fecha de nacimiento.
• 🔥 Conectar con el aroma, vela o ritual de fuego sagrado ideal para tu momento.
• 📜 Explorar las lecturas de Tarot Tolteca, sonoterapia y meditación.`,
      products: [PRODUCTS[1], PRODUCTS[0]],
      quickReplies: [
        'Calcular mi Nahual y Camino de Vida',
        'Recomiéndame una vela para relajarme',
        'Ver rituales de fuego sagrado',
        'Ver catálogo CHANTICO'
      ]
    };
  }

  // 8. FALLBACK CORDIAL Y GUIADO
  return {
    text: `🌿 Siento la resonancia de tu mensaje. Como **Guía Tolteca de CHANTICO**, puedo orientarte sobre **nuestros rituales del fuego sagrado, velas botánicas, tarot tolteca y nahuales**.

Para orientarte con precisión, puedes:
• Escribir tu **fecha de nacimiento** (ej: *"Nací el 15/07/1991"*).
• Preguntar por una intención (ej: *"¿Qué tienen para armonizar o meditar?"*).
• Consultar por un producto o ritual (ej: *"Tarot tolteca"*, *"Velas aromáticas"*, *"Cuencos"*).`,
    products: [PRODUCTS[0], PRODUCTS[1]],
    quickReplies: [
      'Calcular mi Nahual y Camino de Vida',
      'Velas para relajación profunda',
      '¿Qué significa el número 7?',
      'Ver jabones botánicos'
    ]
  };
}
