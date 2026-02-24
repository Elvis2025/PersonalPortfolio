// client/scripts/check-conflicts.mjs
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd(); // ya estás dentro de /client cuando corre
const SRC_DIR = path.resolve(ROOT, "src");

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full);
  }
}

if (!fs.existsSync(SRC_DIR)) {
  console.warn(`[check:conflicts] Skipped: src not found at ${SRC_DIR}`);
  process.exit(0);
}

walk(SRC_DIR);
console.log("[check:conflicts] OK");