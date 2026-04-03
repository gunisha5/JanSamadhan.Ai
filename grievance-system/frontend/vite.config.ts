import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import fs from 'fs';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'serve-logo-folder',
      configureServer(server) {
        const logoDir = resolve(__dirname, 'logo');
        if (fs.existsSync(logoDir)) {
          server.middlewares.use('/logo', (req, res, next) => {
            const path = (req.url || '/logo.png').replace(/^\//, '');
            const file = resolve(logoDir, path);
            if (fs.existsSync(file) && fs.statSync(file).isFile()) {
              const ext = file.split('.').pop() || '';
              const types: Record<string, string> = { png: 'image/png', svg: 'image/svg+xml', jpg: 'image/jpeg' };
              res.setHeader('Content-Type', types[ext] || 'application/octet-stream');
              fs.createReadStream(file).pipe(res);
            } else next();
          });
        }
      },
    },
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8082',
        changeOrigin: true
      }
    }
  }
});

