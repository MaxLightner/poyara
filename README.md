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
- `src/data/projects/*.json` — **approved, public** product and case-study records
- `src/data/insights/*.md` — **approved, public** articles
- `src/content.config.ts` — collection schemas and validation
- `docs/` — brand decisions, content strategy, information architecture, publishing rules and roadmap
- `.github/workflows/` — CI previews and gated Pages publishing

To add a public project or article, add a validated content file. The relevant
listing/detail pages are statically generated; page components do not change.

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

Source scaffold is synced to `MaxLightner/poyara`. The first GitHub Actions
validation and static-preview artifact succeeded on 2026-10-21. This is
downloadable build output, **not a live public website**. Pages deployment,
domain work, design approval and final editorial review remain future phases.

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
review and founder approval remain before public deployment. The site stays
`noindex`; publication is still gated by manual GitHub Actions dispatch.

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

The expected public preview URL is `https://maxlightner.github.io/poyara/`.
GitHub Pages must first be enabled under **Settings → Pages → Build and
deployment → Source: GitHub Actions**. After enabling it, rerun **Build and
deploy POYARA to GitHub Pages** if the initial push-triggered deployment has
not succeeded. The production build retains `noindex` until visual and
editorial approval. The website has no own custom domain at this stage.
