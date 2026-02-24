import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('../src', import.meta.url);
const markers = ['<<<<<<<', '=======', '>>>>>>>'];
const badFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const st = statSync(fullPath);
    if (st.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!/\.(ts|tsx|js|jsx|scss|css|html)$/i.test(entry)) continue;
    const content = readFileSync(fullPath, 'utf8');
    if (markers.some((m) => content.includes(m))) {
      badFiles.push(fullPath);
    }
  }
}

walk(root.pathname);

if (badFiles.length > 0) {
  console.error('Merge conflict markers were found in these files:');
  for (const file of badFiles) console.error(`- ${file}`);
  process.exit(1);
}

console.log('No merge conflict markers found.');
