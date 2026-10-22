import { getCollection } from 'astro:content';
import { withBase } from '../lib/paths';
import type { APIRoute } from 'astro';

const fixedRoutes = ['', 'about/', 'contact/', 'solutions/', 'websites/', 'work/', 'insights/', 'privacy/', 'site-information/'];
const escapeXml = (value: string) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');

export const GET: APIRoute = async ({ site }) => {
  if (!site) return new Response('Site origin unavailable', { status: 500 });
  const projects = await getCollection('projects');
  const insights = await getCollection('insights');
  const urls: { path: string; date?: Date }[] = [
    ...fixedRoutes.map((path) => ({ path })),
    ...projects.map((item) => ({ path: `work/${encodeURIComponent(item.id)}/` })),
    ...insights.map((item) => ({ path: `insights/${encodeURIComponent(item.id)}/`, date: item.data.date }))
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ path, date }) => {
    const location = new URL(withBase(path), site).href;
    return `  <url><loc>${escapeXml(location)}</loc>${date ? `<lastmod>${date.toISOString().slice(0, 10)}</lastmod>` : ''}</url>`;
  }).join('\n')}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
