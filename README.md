# POYARA — website

An English-only, static-first website for an independent AI-native product studio.

This repository separates design, pages, and publishable content. It is prepared
for GitHub Pages and future agent-assisted editorial workflows. No login,
database, or custom server is required for v1.

## Work locally

Requires Node.js 22.12+ and npm.

```bash
npm ci
npm run dev
npm run check
npm run build
npm run verify:dist
```

`npm run dev` opens the local development preview. Build output is in `dist/`.
The temporary site preview is marked `noindex` and is disallowed by its generated
`robots.txt`. Only set `PUBLIC_SITE_INDEXABLE=true` for a reviewed production
build after Phase 4 launch approval. On GitHub Pages project paths, the domain's
root `robots.txt` may belong to a separate site, so per-page metadata remains
the primary prelaunch indexing safeguard.

## Structure

- `src/pages/` — routes and page composition
- `src/layouts/` — global document shell, SEO and shared navigation
- `src/pages/sitemap.xml.ts`, `src/pages/robots.txt.ts` — generated crawl files
- `public/og-card.png` — locally generated 1200×630 social preview image
- `src/components/` — reusable presentation components
- `src/styles/` — structural styles and isolated visual design layer
- `src/interaction.ts` — progressive enhancement: navigation, scroll and hero motion
- `src/components/SystemVisual.astro` — original vector-only technical artwork
- `src/data/reels.ts` — **already-public, approved** founder portfolio films and links
- `public/founder.jpg` — founder-provided portrait, currently visible on the homepage only
- `src/data/projects/*.json` — **approved, public** product and case-study records
- `src/data/insights/*.md` — **approved, public** articles
- `src/content.config.ts` — collection schemas and validation
- `docs/` — brand decisions, content strategy, information architecture, publishing rules and roadmap
- `.github/workflows/` — CI previews and gated Pages publishing

To add a public project or article, add a validated content file. The relevant
listing/detail pages are statically generated; page components do not change.

## Homepage video gallery

The motion gallery starts from three public Behance projects, using their
thumbnail URLs. Actual Adobe Creative Cloud video players load only when a
visitor clicks Play. The original Behance project remains accessible as a
fallback link.

To add an **approved** application/demo film later, export an optimized H.264
MP4 (ideally a short, compressed 720p or 1080p clip) and place it at
`public/videos/<slug>.mp4`. Add a record to `src/data/reels.ts`, with
`video: withBase('videos/<slug>.mp4')` and a small poster image (using
`withBase('images/<slug>.webp')` for locally stored assets). The modal detects
`.mp4` and plays it with a native HTML video element; other entries use their
external embed URL. Publicly adding any product, image or clip requires owner
approval, regardless of whether the material is hidden in the UI.

## Publishing boundaries

Everything tracked in a **public** GitHub repository must be considered public.
Do not put unreleased names, roadmaps, secrets, third-party source material or
unapproved images in this tree, including under hidden UI elements, comments,
unused files, or `public/`. Keep private drafts in a separate private workspace.
There is deliberately no `published: false` field: an unpublished file must
not enter this repository at all.

## GitHub Pages

The project path is configured for `MaxLightner/poyara`, serving at
`https://maxlightner.github.io/poyara/`. If the final repository name is
different, update `base` in `astro.config.mjs` before deployment.

- `ci.yml`: validates/builds pushes and pull requests and saves a downloadable
  static preview artifact. This does **not** make a public live site.
- `deploy.yml`: builds/deploys on `main` pushes and supports manual dispatch.
  It keeps `PUBLIC_SITE_INDEXABLE` unset so a visual-review build stays `noindex`.
- In Settings → Pages, select **GitHub Actions** as the build/deployment source.
- Once a custom domain is owned and configured, replace `site`, remove
  `base`, and add `public/CNAME` as per official Astro/GitHub documentation.

## Phase-0 status

Source scaffold is synced to `MaxLightner/poyara`. The initial GitHub Actions
validation succeeded on 2026-10-21. The site later received a working
GitHub Pages preview; design approval, domain work and editorial/legal review
remain outstanding.

## Phase-1 status

English narratives, a structured public demo case study and the first original
studio note are implemented for the static preview. The article and career copy
still require owner approval. The founder's display name (Mohammad
Mohammadzadeh) and contact email (`Lightnermax@gmail.com`) were supplied for
Phase 4. See `docs/content-strategy.md` for the content map and launch review
checklist.

## Phase-2 status

Technical editorial visual design, responsive layout, original SVG illustration,
mobile navigation and reduced-motion-aware interactions are implemented.
`docs/design-system.md` records the provisional visual decisions. Browser/device
review and founder approval remain for indexed public launch. The current
GitHub Pages site is public but keeps `noindex` during review.

## Phase-3 status

Static routes now include privacy, site information and a tailored 404 page.
Canonical links, Open Graph and Twitter card metadata, a small website JSON-LD
description, dynamically populated sitemap and a public-facing social image
are generated without analytics or other runtime services. `npm run verify:dist`
checks canonical URLs, internal links, metadata, sitemap, robots directives,
and CSS/JS size budgets. Indexing still requires explicit Phase 4 approval.

**Before the final indexed launch:** check email delivery, approve the detailed
bio and any public business/jurisdiction details for applicable legal
disclosures, personally approve copy and visual design, review the privacy
notice against actual hosting/third-party services, and perform browser/device
QA. Neither this source nor the present site-information page claims formal
legal compliance.

## Phase-4 preview publishing

The live public review URL is `https://maxlightner.github.io/poyara/`.
GitHub Pages is configured under **Settings → Pages** to use GitHub Actions.
Pushes to `main` automatically build and publish. The production build retains
`noindex` until visual and editorial approval. There is no custom domain yet.
