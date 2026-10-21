import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const pages = [
  'index.html',
  'about/index.html',
  'contact/index.html',
  'solutions/index.html',
  'work/index.html',
  'work/industrial-pump-demo/index.html',
  'insights/index.html',
  'insights/what-a-working-demo-proves/index.html',
  'privacy/index.html',
  'site-information/index.html',
  '404.html'
];
const root = new URL('../dist/', import.meta.url).pathname;
let failures = 0;
let internalLinks = 0;
let maxInlineJsBytes = 0;
const publicBuild = process.env.PUBLIC_SITE_INDEXABLE === 'true';

function fail(message) {
  console.error(message);
  failures++;
}

for (const page of pages) {
  const path = join(root, page);
  if (!existsSync(path)) {
    fail(`Missing static route: ${page}`);
    continue;
  }
  const html = readFileSync(path, 'utf8');
  if (!html.includes('lang="en"') || !html.includes('/poyara/')) {
    fail(`Unexpected language or base path: ${page}`);
  }
  if (!html.includes('id="main"') || !html.includes('class="menu-toggle"') || !/<h1\b/i.test(html)) {
    fail(`Missing landmark, mobile navigation control or main heading: ${page}`);
  }
  const expectedUrl = `https://maxlightner.github.io/poyara/${page === 'index.html' ? '' : page === '404.html' ? '404.html' : page.replace(/index\.html$/, '')}`;
  if (page !== '404.html' && !html.includes(`property="og:url" content="${expectedUrl}"`)) {
    fail(`Incorrect social URL on ${page}`);
  }
  if (!html.includes('property="og:image"') || !html.includes('name="twitter:card"') || !html.includes('name="description"')) {
    fail(`Missing SEO/social metadata on ${page}`);
  }
  if (page !== '404.html' && !html.includes(`rel="canonical" href="${expectedUrl}"`)) {
    fail(`Missing or incorrect canonical URL on ${page}`);
  }
  if (!publicBuild && !html.includes('name="robots" content="noindex, nofollow"')) {
    fail(`Non-indexable preview gate was removed on ${page}`);
  }
  if (page === '404.html' && !html.includes('noindex')) {
    fail('404 page must not be indexed');
  }
  const inlineJsBytes = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((match) => !/type=["']application\/ld\+json["']/i.test(match[1]))
    .reduce((total, match) => total + Buffer.byteLength(match[2]), 0);
  maxInlineJsBytes = Math.max(maxInlineJsBytes, inlineJsBytes);
  for (const match of html.matchAll(/href="([^"]+)"/g)) {
    const href = match[1];
    if (!href.startsWith('/poyara/')) continue;
    internalLinks++;
    const route = decodeURIComponent(href.slice('/poyara/'.length).split(/[?#]/)[0]);
    const destination = join(root, route.endsWith('/') || !route ? `${route}index.html` : route);
    if (!existsSync(destination)) {
      fail(`Broken internal link on ${page}: ${href}`);
    }
  }
}

for (const asset of ['favicon.svg', 'og-card.svg', 'og-card.png', 'robots.txt', 'sitemap.xml']) {
  if (!existsSync(join(root, asset))) fail(`Missing asset: ${asset}`);
}
if (existsSync(join(root, 'og-card.png')) && statSync(join(root, 'og-card.png')).size > 350_000) {
  fail('Social card exceeds 350 kB budget');
}
if (existsSync(join(root, 'sitemap.xml'))) {
  const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
  for (const page of pages.filter((page) => page !== '404.html')) {
    const url = `https://maxlightner.github.io/poyara/${page === 'index.html' ? '' : page.replace(/index\.html$/, '')}`;
    if (!sitemap.includes(`<loc>${url}</loc>`)) fail(`Missing sitemap entry: ${url}`);
  }
  if (sitemap.includes('/404.html')) fail('404 appears in sitemap');
}
if (existsSync(join(root, 'robots.txt'))) {
  const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
  if (!publicBuild && !robots.includes('Disallow: /poyara/')) fail('Preview robots.txt must disallow project path');
  if (publicBuild && !robots.includes('Sitemap:')) fail('Public robots.txt must mention sitemap');
}

let cssBytes = 0;
let jsBytes = 0;
const assetsPath = join(root, '_astro');
if (existsSync(assetsPath)) for (const name of readdirSync(assetsPath)) {
  const size = statSync(join(assetsPath, name)).size;
  if (name.endsWith('.css')) cssBytes += size;
  if (name.endsWith('.js')) jsBytes += size;
}
if (cssBytes > 90_000) fail(`Compiled CSS is too large: ${cssBytes} bytes`);
if (jsBytes + maxInlineJsBytes > 50_000) fail(`Compiled and inline JS exceeds budget: ${jsBytes + maxInlineJsBytes} bytes`);

if (failures) process.exit(1);
console.log(`Verified ${pages.length} English static routes, canonical/social metadata, search gates, sitemap, privacy pages and ${internalLinks} internal links.`);
console.log(`Compiled assets: CSS ${(cssBytes / 1024).toFixed(1)} KiB, JS (external + max inline) ${((jsBytes + maxInlineJsBytes) / 1024).toFixed(1)} KiB.`);
