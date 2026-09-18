const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, 'dist');
const port = Number(process.env.PORT || 8080);
const types = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
};

http.createServer((request, response) => {
  const requestedPath = decodeURIComponent((request.url || '/').split('?')[0]);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let filePath = path.join(root, safePath === '/' ? 'index.html' : safePath);

  if (!filePath.startsWith(root)) {
    response.writeHead(400);
    response.end('Bad request');
    return;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(root, 'index.html');
  }

  response.writeHead(200, {
    'Content-Type': types[path.extname(filePath)] || 'application/octet-stream',
    'Cache-Control': path.basename(filePath) === 'index.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });
  fs.createReadStream(filePath).pipe(response);
}).listen(port, '0.0.0.0', () => {
  console.log(`Frontend server listening on ${port}`);
});
