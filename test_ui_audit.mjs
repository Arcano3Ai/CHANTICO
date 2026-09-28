import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve('test_shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function runAudit() {
  console.log('Iniciando auditoría con Playwright + Edge...');
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  console.log('Navegando a https://arcano3ai.github.io/NUMA/...');
  await page.goto('https://arcano3ai.github.io/NUMA/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero
  await page.screenshot({ path: path.join(outDir, '01_hero.png') });
  console.log('Captura 1: Hero guardada.');

  // 2. Scroll a ¿Qué es NÜMA?
  await page.locator('#que-es-numa').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '02_que_es_numa.png') });
  console.log('Captura 2: Qué es NÜMA guardada.');

  // 3. Scroll a Experiencias
  await page.locator('#experiencias').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '03_experiencias.png') });
  console.log('Captura 3: Experiencias guardada.');

  // 4. Scroll a Tienda y agregar producto al carrito
  await page.locator('#tienda').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '04_tienda.png') });
  console.log('Captura 4: Tienda guardada.');

  // Clic en AGREGAR del primer producto
  const addBtn = page.locator('.btn-add-cart').first();
  await addBtn.click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '05_cart_drawer.png') });
  console.log('Captura 5: Carrito Drawer guardada.');

  // Cerrar carrito
  await page.locator('#cart-close-btn').click();
  await page.waitForTimeout(400);

  // 5. Rituales y Respiración Guiada
  await page.locator('#rituales').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('#ritual-start-guide-btn').click();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, '06_breathing_modal.png') });
  console.log('Captura 6: Modal Respiración guardada.');

  // Cerrar respiración
  await page.locator('#breathing-close-btn').click();
  await page.waitForTimeout(400);

  // 6. Calculadora de Numerología
  await page.locator('#numerologia').scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.locator('#num-input-date').fill('1992-06-15');
  await page.locator('#num-input-name').fill('Valeria Mendoza');
  await page.locator('#numerology-calc-form button[type="submit"]').click();
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '07_numerology_result.png') });
  console.log('Captura 7: Resultado Numerología guardada.');

  // 7. Vista Móvil (iPhone 14 Pro: 393 x 852)
  await page.setViewportSize({ width: 393, height: 852 });
  await page.goto('https://arcano3ai.github.io/NUMA/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: path.join(outDir, '08_mobile_hero.png') });
  console.log('Captura 8: Hero Móvil guardada.');

  // Abrir menú móvil
  await page.locator('#mobile-menu-btn').click();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(outDir, '09_mobile_menu.png') });
  console.log('Captura 9: Menú Móvil guardada.');

  await browser.close();
  console.log('Auditoría completada exitosamente.');
}

runAudit().catch(err => {
  console.error('Error en auditoría:', err);
  process.exit(1);
});
