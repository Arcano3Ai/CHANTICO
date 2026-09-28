import { processBotQuery } from './src/js/numaBotEngine.js';

console.log('--- INICIANDO VERIFICACIÓN DEL MOTOR DEL BOT GUÍA TOLTECA CHANTICO ---');

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`✅ [PASS]: ${message}`);
    passed++;
  } else {
    console.error(`❌ [FAIL]: ${message}`);
    failed++;
  }
}

// 1. Prueba de fecha de nacimiento (Camino de Vida 3: 15/03/1992 -> 1+5=6, 3=3, 1+9+9+2=21->3 -> 6+3+3=12 -> 3)
const resDate = processBotQuery('Nací el 15/03/1992');
assert(resDate.text.includes('Camino de Vida 3'), 'Debe calcular Camino de Vida 3 correctamente');
assert(resDate.products.length > 0, 'Debe adjuntar al menos un producto afín al arquetipo 3');
assert(resDate.quickReplies.length > 0, 'Debe proveer sugerencias rápidas contextuales');

// 2. Prueba de fecha con texto ("23 de noviembre de 1985")
const resDateText = processBotQuery('Nací el 23 de noviembre de 1985');
assert(resDateText.text.includes('Tu Frecuencia Sagrada'), 'Debe reconocer fechas en lenguaje natural');

// 3. Prueba de número maestro 11
const resMaster11 = processBotQuery('Háblame del número maestro 11');
assert(resMaster11.text.includes('Número 11') || resMaster11.text.includes('Canal Luminoso'), 'Debe explicar el arquetipo maestro 11');
assert(resMaster11.products.length > 0, 'Debe incluir productos para el arquetipo maestro 11');

// 4. Prueba de concepto: Camino de Vida
const resConceptCV = processBotQuery('¿Qué es el camino de vida?');
assert(resConceptCV.text.includes('Camino de Vida') && resConceptCV.text.includes('fecha de nacimiento'), 'Debe explicar el concepto de Camino de Vida');

// 5. Prueba de producto por intención: "tarot y barajas"
const resTarot = processBotQuery('busco el tarot tolteca');
assert(resTarot.products.some(p => p.id.includes('tarot')), 'Debe recomendar barajas del Tarot Tolteca');

// 6. Prueba de producto: nahual o guardianes
const resNahual = processBotQuery('quiero un nahualito guardian');
assert(resNahual.products.some(p => p.id.includes('nahualito')), 'Debe encontrar el Nahualito Guardián');

// 7. Prueba de kits de regalo o espiritual
const resGifts = processBotQuery('quiero un kit');
assert(resGifts.products.some(p => p.id.includes('kit') || p.category === 'kits'), 'Debe sugerir kits espirituales');

// 8. Prueba de saludo inicial como Guía Tolteca de CHANTICO
const resHello = processBotQuery('Hola');
assert(resHello.text.includes('Guía Tolteca de CHANTICO'), 'Debe saludar amablemente como la Guía Tolteca de CHANTICO');

// 9. Prueba de consulta: ¿Cómo saber mi número según mi fecha de nacimiento?
const resHowToNum = processBotQuery('¿Cuál es mi número? depende de la fecha de nacimiento');
assert(resHowToNum.text.includes('¿Cómo saber tu Número según tu Fecha de Nacimiento?'), 'Debe responder didácticamente cómo saber el número por fecha de nacimiento');
assert(resHowToNum.text.includes('La Fórmula Sagrada'), 'Debe incluir la fórmula de suma y reducción');

// 10. Prueba de información básica sobre numerología
const resBasicNum = processBotQuery('Dame información básica sobre numerología');
assert(resBasicNum.text.includes('Información Básica sobre la Numerología y Tarot en CHANTICO'), 'Debe proveer información básica sobre numerología en CHANTICO');
assert(resBasicNum.text.includes('Camino de Vida') && resBasicNum.text.includes('Número del Alma'), 'Debe explicar las coordenadas esenciales');

// 11. Prueba de Meditaciones Guiadas y música
const resMed = processBotQuery('¿Tienen canciones o meditaciones guiadas?');
assert(resMed.text.includes('Zona de Meditación & Frecuencias Sagradas de CHANTICO'), 'Debe informar sobre la zona de meditación guiada de CHANTICO');

console.log(`\nResumen: ${passed} pruebas superadas, ${failed} fallos.`);
if (failed > 0) process.exit(1);
