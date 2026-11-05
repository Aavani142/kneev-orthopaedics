/**
 * Minimal production server for VPS / container hosting (no dependencies).
 *   npm run build && npm start
 * Serves dist/ and POST /api/lead. Reads secrets from the process environment
 * (or a .env file in the project root, if present).
 */
import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { nodeLeadRoute } from './node-adapter.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

// Tiny .env loader (does not override real environment variables).
const envFile = path.join(root, '.env');
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/\s+#.*$/, '').replace(/^["']|["']$/g, '');
  }
}
process.env.NODE_ENV ||= 'production';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  if (url.pathname === '/api/lead') return nodeLeadRoute(req, res, process.env);

  let file = path.normalize(path.join(dist, decodeURIComponent(url.pathname)));
  if (!file.startsWith(dist)) {
    res.statusCode = 403;
    return res.end();
  }
  try {
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
  } catch {
    file = path.join(dist, 'index.html');
  }
  try {
    const data = await readFile(file);
    const ext = path.extname(file);
    res.setHeader('Content-Type', TYPES[ext] || 'application/octet-stream');
    if (file.includes(`${path.sep}assets${path.sep}`)) res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.end(data);
  } catch {
    res.statusCode = 404;
    res.end('Not found');
  }
});

const port = Number(process.env.PORT || 3000);
server.listen(port, () => console.log(`KNEEV landing page on http://localhost:${port}`));
