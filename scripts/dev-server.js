/**
 * Servidor HTTP Estático para Desenvolvimento e Preview Local
 * Academia Evolution Fitness — Landing Page
 */

import http from "node:http";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const PORT = process.env.PORT || 4173;
const HOST = "0.0.0.0";

function getLocalNetworkUrls(port) {
  const interfaces = os.networkInterfaces();
  const urls = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        urls.push(`http://${net.address}:${port}`);
      }
    }
  }
  return urls;
}

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

const server = http.createServer((req, res) => {
  const safeUrl = decodeURIComponent((req.url || "/").split("?")[0]);
  const relativePath = safeUrl === "/" ? "/index.html" : safeUrl;
  const filePath = path.join(ROOT_DIR, relativePath);

  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache",
    });

    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`\n✅ Academia Evolution Fitness LP rodando!`);
  console.log(`   ➜ Computador (Local): http://localhost:${PORT}`);
  const lanUrls = getLocalNetworkUrls(PORT);
  if (lanUrls.length > 0) {
    for (const url of lanUrls) {
      console.log(`   ➜ Celular (Mesmo Wi-Fi): ${url}`);
    }
  } else {
    console.log(`   ➜ Celular: conecte na mesma rede Wi-Fi e use o IP local da máquina na porta ${PORT}`);
  }
  console.log("");
});
