import { withBase } from '../lib/paths';
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  if (!site) return new Response('Site origin unavailable', { status: 500 });
  const readyForIndexing = import.meta.env.PUBLIC_SITE_INDEXABLE === 'true';
  const sitemap = new URL(withBase('sitemap.xml'), site).href;
  const body = readyForIndexing
    ? `User-agent: *\nAllow: ${withBase()}\nSitemap: ${sitemap}\n`
    : `User-agent: *\nDisallow: ${withBase()}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
