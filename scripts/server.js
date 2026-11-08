/**
 * @file Interactive Local Development & Preview Web Server.
 * Serves the full Pokémon Evolution Companion interactive browser application.
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { evaluateEvolution } from "../src/engine/evolution.js";
import { renderSvg } from "../src/engine/renderer.js";
import { EVOLUTION_TIERS } from "../src/pokemon/definitions.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const appDir = path.resolve(rootDir, "app");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3333;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml; charset=utf-8",
  ".png": "image/png",
  ".gif": "image/gif",
  ".ico": "image/x-icon"
};

/**
 * Handles incoming HTTP requests.
 */
async function handleRequest(req, res) {
  const urlObj = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = urlObj.pathname;

  // CORS headers for local development
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // API 1: Evolution state JSON
  if (pathname === "/api/state") {
    const commits = parseInt(urlObj.searchParams.get("commits") || "219", 10);
    const state = evaluateEvolution(Number.isFinite(commits) ? commits : 219);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(state));
    return;
  }

  // API 2: Rendered front-facing SVG string
  if (pathname === "/api/render-svg") {
    const commits = parseInt(urlObj.searchParams.get("commits") || "219", 10);
    const breath = parseFloat(urlObj.searchParams.get("breath") || "0");
    const flamePhase = parseFloat(urlObj.searchParams.get("flamePhase") || "0");
    const transparent = urlObj.searchParams.get("transparent") === "true";

    const state = evaluateEvolution(Number.isFinite(commits) ? commits : 219);
    const svg = renderSvg(state, {
      animationState: { breath, flamePhase },
      transparent
    });

    res.writeHead(200, { "Content-Type": "image/svg+xml; charset=utf-8" });
    res.end(svg);
    return;
  }

  // API 3: All 5 forms metadata
  if (pathname === "/api/forms") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(EVOLUTION_TIERS));
    return;
  }

  // API 4: Fetch GitHub activity for any user
  if (pathname === "/api/github-user") {
    const username = (urlObj.searchParams.get("username") || "").trim();
    if (!username) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Missing username parameter" }));
      return;
    }

    try {
      const ghRes = await fetch(`https://api.github.com/users/${username}`, {
        headers: { "User-Agent": "pokemon-evolution-companion" }
      });
      if (!ghRes.ok) {
        throw new Error(`GitHub returned ${ghRes.status}`);
      }
      const data = await ghRes.json();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          username: data.login,
          publicRepos: data.public_repos,
          followers: data.followers,
          createdAt: data.created_at
        })
      );
    } catch (err) {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ fallback: true, username, message: err.message }));
    }
    return;
  }

  // Serve static files
  let filePath = path.join(appDir, pathname === "/" ? "index.html" : pathname);

  // If path starts with /assets, serve from root assets dir
  if (pathname.startsWith("/assets/")) {
    filePath = path.join(rootDir, pathname);
  }

  try {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      filePath = path.join(filePath, "index.html");
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const data = await fs.promises.readFile(filePath);

    res.writeHead(200, { "Content-Type": contentType });
    res.end(data);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("404 Not Found");
  }
}

const server = http.createServer(handleRequest);

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🔥 POKÉMON EVOLUTION COMPANION — INTERACTIVE APP`);
  console.log(`======================================================`);
  console.log(`▶ Local URL: http://localhost:${PORT}`);
  console.log(`▶ Status: Live Front-Facing 2.5D Anime Evolution Engine`);
  console.log(`▶ Press Ctrl+C to stop the server`);
  console.log(`======================================================\n`);
});

