import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'solutions/index.html',
  'work/index.html',
  'work/industrial-pump-demo/index.html',
  'insights/index.html',
  'insights/what-a-working-demo-proves/index.html'
];
const root = new URL('../dist/', import.meta.url).pathname;
let failures = 0;
let internalLinks = 0;

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
  if (!html.includes('id="main"') || !html.includes('class="menu-toggle"') || !/<h1\b/i.test(html)) {
    console.error(`Missing landmark, mobile navigation control or main heading: ${page}`);
    failures++;
  }
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/poyara/')) continue;
    internalLinks++;
    const route = decodeURIComponent(href.slice('/poyara/'.length).split(/[?#]/)[0]);
    const destination = join(root, route.endsWith('/') || !route ? `${route}index.html` : route);
    if (!existsSync(destination)) {
      console.error(`Broken internal link on ${page}: ${href}`);
      failures++;
    }
  }
}

if (failures) process.exit(1);
console.log(`Verified ${pages.length} English static routes, landmarks and ${internalLinks} internal links.`);
