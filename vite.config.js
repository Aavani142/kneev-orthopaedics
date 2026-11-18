import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';

/**
 * Static site plus one serverless function, api/lead.js (Vercel deploys it as /api/lead).
 * This plugin runs the same function under `npm run dev` / `npm run preview`,
 * with server-side variables (RESEND_API_KEY, LEAD_EMAIL_*) read from .env.
 */
function leadApi() {
  const attach = (server, load) => {
    server.middlewares.use('/api/lead', async (req, res) => {
      try {
        const { default: handler } = await load();
        await handler(req, res);
      } catch (err) {
        console.error('[api/lead]', err);
        res.statusCode = 500;
        res.end(JSON.stringify({ ok: false, error: 'server' }));
      }
    });
  };
  return {
    name: 'kneev-lead-api',
    configureServer(server) {
      Object.assign(process.env, { ...loadEnv(server.config.mode, process.cwd(), ''), ...process.env });
      attach(server, () => server.ssrLoadModule('/api/lead.js'));
    },
    configurePreviewServer(server) {
      Object.assign(process.env, { ...loadEnv('production', process.cwd(), ''), ...process.env });
      attach(server, () => import('./api/lead.js'));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), leadApi()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy-policy.html'),
      },
    },
  },
});
