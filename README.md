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
The temporary site preview is marked `noindex`; remove that directive in
`BaseLayout.astro` only when public launch is approved.

## Structure

- `src/pages/` — routes and page composition
- `src/layouts/` — global document shell, SEO and shared navigation
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
- `deploy.yml`: deploys to GitHub Pages only via a manual workflow dispatch.
  It is deliberately gated until content and presentation are approved.
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
still require owner approval; the public founder display name and a direct
contact route remain unverified. See `docs/content-strategy.md` for the content
map and launch review checklist. **Do not run the manual Pages deployment yet.**

## Phase-2 status

Technical editorial visual design, responsive layout, original SVG illustration,
mobile navigation and reduced-motion-aware interactions are implemented.
`docs/design-system.md` records the provisional visual decisions. Browser/device
review and founder approval remain before public deployment. The site stays
`noindex`; publication is still gated by manual GitHub Actions dispatch.
