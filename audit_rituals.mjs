import { chromium } from 'playwright';
import { createServer } from 'vite';
import path from 'path';
import fs from 'fs';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve('test_shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Iniciando servidor Vite para auditoría integral...');
  const server = await createServer({
    server: { port: 5182 }
  });
  await server.listen();

  console.log('Servidor activo en http://localhost:5182');
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  await page.goto('http://localhost:5182/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // 1. Hero en Modo Oscuro (ES)
  await page.screenshot({ path: path.join(outDir, '01_hero_dark_es.png') });
  console.log('Captura 1: Hero Dark ES guardada.');

  // 2. Cambiar a Modo Claro
  await page.locator('#theme-toggle-btn').click({ force: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '02_hero_light_es.png') });
  console.log('Captura 2: Hero Light ES guardada.');

  // 3. Cambiar a Inglés (EN) en Modo Claro
  await page.locator('.lang-btn[data-lang="en"]').first().click({ force: true });
  await page.waitForTimeout(600);
  await page.screenshot({ path: path.join(outDir, '03_hero_light_en.png') });
  console.log('Captura 3: Hero Light EN guardada.');

  // 4. Scroll a Rituales en Modo Claro (EN)
  const ritualSection = page.locator('#rituales');
  await ritualSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);
  await ritualSection.screenshot({ path: path.join(outDir, '04_rituals_light_en.png') });
  console.log('Captura 4: Rituales Light EN guardada.');

  // 5. Scroll a Footer para ver redes sociales oficiales
  const footerSection = page.locator('footer');
  await footerSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(600);

  // Simular hover sobre TikTok en Footer
  await page.locator('footer .social-icon-btn.social-tiktok').hover();
  await page.waitForTimeout(400);
  await footerSection.screenshot({ path: path.join(outDir, '05_footer_social_tiktok_hover.png') });
  console.log('Captura 5: Footer TikTok Hover guardada.');

  // Simular hover sobre Instagram en Footer
  await page.locator('footer .social-icon-btn.social-instagram').hover();
  await page.waitForTimeout(400);
  await footerSection.screenshot({ path: path.join(outDir, '06_footer_social_instagram_hover.png') });
  console.log('Captura 6: Footer Instagram Hover guardada.');

  await browser.close();
  await server.close();
  console.log('Auditoría Integral (Temas, i18n, Redes Sociales) completada con éxito.');
}

run().catch(err => {
  console.error('Error en auditoría:', err);
  process.exit(1);
});
