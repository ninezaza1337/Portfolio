const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT_PREFERRED = 8002;

function send(res, status, data, headers = {}) {
  res.writeHead(status, Object.assign({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }, headers));
  res.end(JSON.stringify(data));
}

function handleMessage(req, res) {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method_not_allowed' });
  let body = '';
  req.on('data', (chunk) => { body += chunk; if (body.length > 1e6) req.destroy(); });
  req.on('end', () => {
    let payload;
    try { payload = JSON.parse(body || '{}'); } catch (e) { return send(res, 400, { ok: false, error: 'invalid_json' }); }
    const now = new Date().toISOString();
    const ip = req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : '';
    const ua = req.headers['user-agent'] || '';
    const name = String(payload.name || '').replace(/[\r\n]/g, ' ').slice(0, 200);
    const message = String(payload.message || '').replace(/[\r\n]/g, ' ').slice(0, 5000);
    if (!message.trim()) return send(res, 400, { ok: false, error: 'empty_message' });
    const line = `[${now}] ip=${ip} ua=${ua} name="${name}" message="${message}"\n`;
    const filePath = path.join(__dirname, 'massage.txt');
    fs.appendFile(filePath, line, (err) => {
      if (err) return send(res, 500, { ok: false, error: 'write_failed' });
      send(res, 200, { ok: true });
    });
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/message')) return handleMessage(req, res);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ ok: false, error: 'not_found' }));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    const alt = PORT_PREFERRED + 1;
    server.listen(alt, () => {
      console.log(`Message API running at http://localhost:${alt}/api/message`);
    });
  } else {
    console.error(err);
  }
});

server.listen(PORT_PREFERRED, () => {
  console.log(`Message API running at http://localhost:${PORT_PREFERRED}/api/message`);
});