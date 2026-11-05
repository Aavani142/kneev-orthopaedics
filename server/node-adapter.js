// Adapts a Node http request/response pair to handleLead().
import { handleLead } from './lead-handler.js';

export async function nodeLeadRoute(req, res, env) {
  const send = (status, json) => {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-store');
    res.end(JSON.stringify(json));
  };
  if (req.method !== 'POST') return send(405, { ok: false, error: 'method_not_allowed' });

  let raw = '';
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 20000) return send(413, { ok: false, error: 'too_large' });
  }
  let body;
  try {
    body = JSON.parse(raw || '{}');
  } catch {
    return send(400, { ok: false, error: 'invalid_json' });
  }
  const { status, json } = await handleLead(body, {
    env,
    ip: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim(),
    userAgent: req.headers['user-agent'],
    origin: req.headers.origin,
  });
  return send(status, json);
}
