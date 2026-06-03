/**
 * Convenience entry point (same as `npm start`).
 * For development with auto-reload, use: npm run dev
 */
import { existsSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const built = join(__dirname, "dist", "index.js");

if (!existsSync(built)) {
  console.error(`
Build not found. Run these commands first:

  npm install
  npm run build
  node server.js

Or skip the build step during development:

  npm install
  npm run dev
`);
  process.exit(1);
}

await import("./dist/index.js");
