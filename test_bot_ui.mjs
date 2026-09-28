import { chromium } from 'playwright';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve('test_shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function runBotAudit() {
  console.log('Iniciando servidor de desarrollo Vite embebido...');
  const server = await createServer({
    configFile: path.resolve('vite.config.js'),
    server: { port: 5188 }
  });
  await server.listen();
  console.log('Servidor Vite escuchando en http://localhost:5188');

  console.log('Iniciando navegador Playwright + Edge...');
  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    console.log('Navegando a http://localhost:5188...');
    await page.goto('http://localhost:5188', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    // 1. Verificar launcher flotante
    const launcher = page.locator('#numa-bot-launcher');
    await launcher.waitFor({ state: 'visible', timeout: 5000 });
    console.log('✅ Launcher del bot visible en esquina inferior.');
    await page.screenshot({ path: path.join(outDir, '06_bot_launcher.png') });

    // 2. Abrir la ventana del bot
    await launcher.click();
    await page.waitForTimeout(600);
    const chatWindow = page.locator('#numa-bot-window');
    await chatWindow.waitFor({ state: 'visible' });
    console.log('✅ Ventana del bot abierta correctamente.');
    await page.screenshot({ path: path.join(outDir, '07_bot_opened.png') });

    // 3. Escribir fecha de nacimiento y enviar
    const botInput = page.locator('#numa-bot-input');
    await botInput.fill('Nací el 14/08/1992');
    await page.locator('#numa-bot-form button[type="submit"]').click();
    await page.waitForTimeout(1200);
    console.log('✅ Consulta de fecha de nacimiento enviada y procesada.');
    await page.screenshot({ path: path.join(outDir, '08_bot_numerology_result.png') });

    // 4. Preguntar por productos de calma
    await botInput.fill('¿Qué velas tienen para calmar la mente y dormir mejor?');
    await page.locator('#numa-bot-form button[type="submit"]').click();
    await page.waitForTimeout(1200);
    console.log('✅ Consulta de productos enviada y procesada.');
    await page.screenshot({ path: path.join(outDir, '09_bot_products_result.png') });

    // 5. Clic en un chip de respuesta rápida
    const chips = page.locator('.numa-bot-chip');
    const chipCount = await chips.count();
    if (chipCount > 0) {
      const firstChip = chips.first();
      const chipText = await firstChip.innerText();
      console.log(`✅ Haciendo clic en chip interactivo: "${chipText}"`);
      await firstChip.click();
      await page.waitForTimeout(1200);
      await page.screenshot({ path: path.join(outDir, '10_bot_chip_interaction.png') });
    }

    console.log('🎉 Auditoría visual del Bot completada con éxito.');
  } finally {
    await browser.close();
    await server.close();
  }
}

runBotAudit().catch(err => {
  console.error('Error en auditoría del bot:', err);
  process.exit(1);
});
