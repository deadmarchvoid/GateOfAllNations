import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const HOST = "0.0.0.0";

const webDir = path.join(__dirname, "..", "web");
const indexFile = path.join(webDir, "index.html");

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);

  if (req.url === "/health") {
    res.writeHead(200, {
      "Content-Type": "application/json; charset=utf-8"
    });

    res.end(
      JSON.stringify({
        status: "ok",
        service: "GateOfAllNations",
        port: PORT
      })
    );
    return;
  }

  if (req.url === "/" || req.url === "/index.html") {
    fs.readFile(indexFile, (error, data) => {
      if (error) {
        console.error("Failed to read index.html:", error);
        res.writeHead(500, {
          "Content-Type": "text/plain; charset=utf-8"
        });
        res.end("Internal Server Error");
        return;
      }

      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });
      res.end(data);
    });
    return;
  }

  if (req.url === "/favicon.ico") {
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(404, {
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.end("Not Found");
});

server.listen(PORT, HOST, () => {
  console.log("=================================");
  console.log("GateOfAllNations started successfully");
  console.log(`Host: ${HOST}`);
  console.log(`Port: ${PORT}`);
  console.log("Health: /health");
  console.log("=================================");
});

process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down...");
  server.close(() => process.exit(0));
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down...");
  server.close(() => process.exit(0));
});
