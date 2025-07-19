// server.js (ESM format)
import jsonServer from "json-server";
import path from "path";
import { fileURLToPath } from "url";

// __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create server
const server = jsonServer.create();

// Setup router with absolute path to db.json
const router = jsonServer.router(path.join(__dirname, "db.json"));

// Default middlewares (logger, CORS, static, etc)
const middlewares = jsonServer.defaults();

// Port setup
const port = process.env.PORT || 3001;

// Apply middlewares and routes
server.use(middlewares);
server.use(router);

// Start server
server.listen(port, () => {
  console.log(`🚀 JSON Server running at http://localhost:${port}`);
});
