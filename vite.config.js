import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { nodeLeadRoute } from './server/node-adapter.js';

// Serves POST /api/lead during `vite` and `vite preview`, using the same
// handler as production. Server-only variables (no VITE_ prefix) never reach
// the browser bundle.
function leadApi(mode) {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') };
  // Must not return anything: Vite treats a returned function as a post-hook.
  const mount = (server) => {
    server.middlewares.use('/api/lead', (req, res) => nodeLeadRoute(req, res, env));
  };
  return { name: 'kneev-lead-api', configureServer: mount, configurePreviewServer: mount };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), leadApi(mode)],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
      },
    },
  },
}));
