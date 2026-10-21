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
- `src/styles/` — design tokens and responsive styles
- `src/data/projects/*.json` — **approved, public** product and case-study records
- `src/data/insights/*.md` — **approved, public** articles
- `src/content.config.ts` — collection schemas and validation
- `docs/` — brand decisions, information architecture, publishing rules and roadmap
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

Source scaffold and CI are prepared locally. GitHub repository creation,
remote synchronization, GitHub Actions execution and public URL verification
must be completed against the authenticated GitHub account.
