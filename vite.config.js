import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function copyMeditacionPlugin() {
  return {
    name: 'copy-meditacion-folder',
    buildStart() {
      const srcDir = path.resolve('meditacion_guiada');
      const pubDir = path.resolve('public/meditacion_guiada');
      if (fs.existsSync(srcDir)) {
        if (!fs.existsSync(pubDir)) fs.mkdirSync(pubDir, { recursive: true });
        const files = fs.readdirSync(srcDir);
        for (const file of files) {
          const srcFile = path.join(srcDir, file);
          const destFile = path.join(pubDir, file);
          if (fs.statSync(srcFile).isFile()) {
            fs.copyFileSync(srcFile, destFile);
          }
        }
      }
    }
  };
}

export default defineConfig({
  base: './',
  root: '.',
  publicDir: 'public',
  plugins: [copyMeditacionPlugin()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
  server: {
    port: 3000,
    open: false,
  },
});
