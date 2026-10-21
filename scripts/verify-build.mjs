import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'solutions/index.html',
  'work/index.html',
  'work/industrial-pump-demo/index.html',
  'insights/index.html'
];
const root = new URL('../dist/', import.meta.url).pathname;
let failures = 0;

for (const page of pages) {
  const path = join(root, page);
  if (!existsSync(path)) {
    console.error(`Missing static route: ${page}`);
    failures++;
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (!html.includes('lang="en"') || !html.includes('/poyara/')) {
    console.error(`Unexpected language or base path: ${page}`);
    failures++;
  }
}

if (failures) process.exit(1);
console.log(`Verified ${pages.length} English static routes with the GitHub Pages base path.`);
