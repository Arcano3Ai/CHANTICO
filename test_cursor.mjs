import { chromium } from 'playwright';
import { createServer } from 'vite';
import fs from 'fs';
import path from 'path';

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const outDir = path.resolve('test_shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function runCursorTest() {
  console.log('Iniciando prueba del cursor numerológico...');
  const server = await createServer({
    configFile: path.resolve('vite.config.js'),
    server: { port: 5192 }
  });
  await server.listen();

  const browser = await chromium.launch({
    executablePath: edgePath,
    headless: true
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 }
  });

  try {
    await page.goto('http://localhost:5192', { waitUntil: 'networkidle' });
    await page.waitForTimeout(1000);

    console.log('Moviendo cursor para generar estela de números sagrados...');
    // Mover cursor en curva suave
    for (let i = 0; i < 25; i++) {
      const x = 300 + i * 28;
      const y = 400 + Math.sin(i * 0.4) * 80;
      await page.mouse.move(x, y, { steps: 2 });
      await page.waitForTimeout(30);
    }

    await page.waitForTimeout(100);
    await page.screenshot({ path: path.join(outDir, '11_numerology_cursor_trail.png') });
    console.log('✅ Captura de estela de números sagrados guardada: 11_numerology_cursor_trail.png');
  } finally {
    await browser.close();
    await server.close();
  }
}

runCursorTest().catch(err => {
  console.error(err);
  process.exit(1);
});
