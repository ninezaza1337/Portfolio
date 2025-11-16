const fs = require('fs');
const path = require('path');

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
}

module.exports = (req, res) => {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method_not_allowed' });

  let body = '';
  req.on('data', (chunk) => { body += chunk; if (body.length > 1e6) req.destroy(); });
  req.on('end', () => {
    let payload = {};
    try { payload = JSON.parse(body || '{}'); } catch (e) { return res.status(400).json({ ok: false, error: 'invalid_json' }); }
    const now = new Date().toISOString();
    const ip = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '';
    const ua = req.headers['user-agent'] || '';
    const name = String(payload.name || '').replace(/[\r\n]/g, ' ').slice(0, 200);
    const message = String(payload.message || '').replace(/[\r\n]/g, ' ').slice(0, 5000);
    if (!message.trim()) return res.status(400).json({ ok: false, error: 'empty_message' });
    const line = `[${now}] ip=${ip} ua=${ua} name="${name}" message="${message}"\n`;
    const filePath = path.join(process.cwd(), 'massage.txt');
    try {
      fs.appendFileSync(filePath, line);
      return res.status(200).json({ ok: true });
    } catch (err) {
      return res.status(500).json({ ok: false, error: 'write_failed' });
    }
  });
};