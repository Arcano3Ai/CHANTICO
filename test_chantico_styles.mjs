import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { chromium } from 'playwright';

console.log('=====================================================');
console.log('   SUITE DE PRUEBAS DE IDENTIDAD VISUAL CHANTICO    ');
console.log('=====================================================\n');

// 1. VERIFICACIÓN ESTÁTICA DE TOKENS EN CSS
console.log('▶ Fase 1: Verificación de variables CSS y tokens de diseño...');

const variablesCss = fs.readFileSync(path.resolve('src/styles/variables.css'), 'utf-8');
const typographyCss = fs.readFileSync(path.resolve('src/styles/typography.css'), 'utf-8');
const componentsCss = fs.readFileSync(path.resolve('src/styles/components.css'), 'utf-8');
const layoutCss = fs.readFileSync(path.resolve('src/styles/layout.css'), 'utf-8');

// Verificación de Colores de Marca
assert(variablesCss.includes('#E62624'), 'Falta el rojo fuego vibrante (#E62624) en variables.css');
assert(variablesCss.includes('#111111'), 'Falta el negro carbón profundo (#111111) en variables.css');
assert(variablesCss.includes('#FBF7F0'), 'Falta el pergamino cálido (#FBF7F0) en variables.css');
assert(variablesCss.includes('#FFB703'), 'Falta el amarillo flama (#FFB703) en variables.css');
assert(variablesCss.includes('#F5A623'), 'Falta el oro solar (#F5A623) en variables.css');
assert(variablesCss.includes('#FDFDFD'), 'Falta el blanco/crema (#FDFDFD) en variables.css');
assert(variablesCss.includes('#000000'), 'Falta el negro absoluto (#000000) en variables.css');
console.log('  ✔ Paleta cromática CHANTICO confirmada en variables.css.');

// Verificación de Tipografía
assert(typographyCss.includes('Cinzel'), 'Falta la tipografía Cinzel en typography.css');
assert(typographyCss.includes('Playfair') || variablesCss.includes('Playfair Display'), 'Falta Playfair Display en typography.css o variables.css');
assert(typographyCss.includes('uppercase'), 'Falta text-transform: uppercase en encabezados');
assert(typographyCss.includes('700') || typographyCss.includes('bold'), 'Falta peso bold (700) en encabezados');
console.log('  ✔ Jerarquía tipográfica (H1-H3 bold/uppercase) confirmada en typography.css.');

// Verificación de Botones y Tarjetas
assert(componentsCss.includes('border-radius: var(--radius-btn'), 'Falta variable de border-radius en .btn');
assert(componentsCss.includes('0 0 12px rgba(255, 183, 3, 0.4)'), 'Falta resplandor flama tenue en hover de botones');
assert(componentsCss.includes('--radius-xl') || componentsCss.includes('16px'), 'Falta rounded-xl en product-card');
assert(layoutCss.includes('border-radius: var(--radius-xl'), 'Falta rounded-xl en tarjetas de layout');
console.log('  ✔ Especificaciones de botones (CTA con resplandor flama) y tarjetas (rounded-xl) confirmadas.');

// 2. VERIFICACIÓN DINÁMICA CON SERVIDOR VITE + PLAYWRIGHT (HEADLESS EDGE/CHROMIUM)
console.log('\n▶ Fase 2: Verificación de renderizado en navegador headless...');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function testBrowser() {
  const server = await createServer({
    server: { port: 3123 }
  });
  await server.listen();
  const address = server.httpServer.address();
  const testUrl = `http://localhost:${address.port}`;
  console.log(`  Servidor Vite de prueba escuchando en ${testUrl}`);

  let browser;
  if (fs.existsSync(edgePath)) {
    browser = await chromium.launch({ executablePath: edgePath, headless: true });
  } else {
    browser = await chromium.launch({ headless: true });
  }

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(testUrl, { waitUntil: 'networkidle' });

  // Test 1: Verificar color de fondo principal y fuentes del Hero / Encabezados
  const sectionTitle = page.locator('h2.section-title').first();
  await sectionTitle.waitFor({ state: 'visible' });
  const titleStyles = await sectionTitle.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      fontFamily: s.fontFamily,
      textTransform: s.textTransform,
      fontWeight: s.fontWeight,
      color: s.color
    };
  });
  console.log('  H2 .section-title computed styles:', titleStyles);
  assert(titleStyles.textTransform === 'uppercase', 'Section Title debe estar en mayúsculas');
  assert(parseInt(titleStyles.fontWeight) >= 600, 'Section Title debe tener peso clásico/bold (>=600)');

  // Test 2: Verificar Botón CTA Primario (.btn-primary)
  const primaryBtn = page.locator('.btn-primary').first();
  await primaryBtn.waitFor({ state: 'visible' });
  const btnStyles = await primaryBtn.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor,
      color: s.color,
      borderRadius: s.borderRadius
    };
  });
  console.log('  Botón .btn-primary computed styles:', btnStyles);
  // #E62624 -> rgb(230, 38, 36)
  assert(btnStyles.backgroundColor.includes('230, 38, 36'), `Fondo de botón debe ser rojo fuego rgb(230, 38, 36), obtenido: ${btnStyles.backgroundColor}`);
  const radiusNum = parseInt(btnStyles.borderRadius);
  assert(radiusNum >= 6 && radiusNum <= 10, `Border radius de botón debe estar entre 6px y 10px, obtenido: ${btnStyles.borderRadius}`);

  // Test 3: Verificar Tarjeta de Producto (.product-card)
  const productCard = page.locator('.product-card').first();
  await productCard.waitFor({ state: 'visible' });
  const cardStyles = await productCard.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor,
      borderRadius: s.borderRadius,
      borderWidth: s.borderWidth
    };
  });
  console.log('  Tarjeta .product-card computed styles:', cardStyles);
  // #111111 -> rgb(17, 17, 17)
  assert(cardStyles.backgroundColor.includes('17, 17, 17'), `Fondo de tarjeta debe ser negro carbón rgb(17, 17, 17), obtenido: ${cardStyles.backgroundColor}`);
  const cardRadius = parseInt(cardStyles.borderRadius);
  assert(cardRadius >= 14 && cardRadius <= 18, `Border radius de tarjeta debe ser rounded-xl (aprox 16px), obtenido: ${cardStyles.borderRadius}`);

  // Test 4: Capturas visuales de prueba en test_shots/
  const outDir = path.resolve('test_shots');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  await page.screenshot({ path: path.join(outDir, 'chantico_01_hero.png') });
  
  await page.locator('#tienda').scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(outDir, 'chantico_02_tienda_cards.png') });

  console.log('  ✔ Capturas visuales generadas en test_shots/chantico_01_hero.png y test_shots/chantico_02_tienda_cards.png');

  await browser.close();
  await server.close();
  console.log('\n=====================================================');
  console.log('  ✅ TODOS LOS TESTS DE CHANTICO PASARON CON ÉXITO   ');
  console.log('=====================================================');
}

testBrowser().catch(err => {
  console.error('❌ Error en test de estilos:', err);
  process.exit(1);
});
