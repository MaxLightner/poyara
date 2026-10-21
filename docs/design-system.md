# POYARA — Phase 2 visual system

Status: implemented in source, awaiting founder's visual review (2026-10-21).

## Direction

**Technical editorial / experimental precision.** The site should feel like a serious independent product practice: precise, exploratory, slightly cinematic, without default SaaS icon grids or unsubstantiated corporate grandeur.

The visual idea uses an original parametric rotor illustration as a metaphor for systems, interaction and real-time graphics. It is conceptual studio artwork, **not** a screenshot or faithful model of the industrial pump demo.

## Design tokens

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#070c0f` | Base canvas |
| Surface | `#10191d` | Cards and panels |
| Raised surface | `#152226` | Dense technical areas |
| Hairline | `#294044` | Engineering-like strokes |
| Text | `#edf5ef` | Primary reading |
| Muted | `#a9bcb9` | Supporting copy |
| Mint | `#adf3d2` | Core brand accent and links |
| Signal | `#bbed87` | Rare system pulse and keyboard focus |

System font stack avoids third-party network dependence. Large tight-set headings contrast with compact monospaced technical labels. The current `P.` monogram is a working graphic proposal, **not** a finalized legal trademark or logo asset.

## Page-level visual hierarchy

1. **Home:** large position statement and original kinetic technical drawing; direct evidence follows immediately.
2. **Work:** one inspectable live demo and the explanation of its evidence limits; the grid expands naturally when approved work is added.
3. **Project note:** structured technical sections and working-demo action.
4. **Solutions:** concrete outputs, not broad undefined service claims.
5. **Insights:** calm reading typography and original point-of-view writing.
6. **About:** founder expertise and studio operating model, without inflated staff or client proof.
7. **Contact:** a serious collaboration brief; verified outbound address still required.

## Interaction model

- Pointer-responsive hero rotor, slow SVG motion and subtle visual signals.
- Directional button/card hover feedback; scroll progress line.
- Scroll reveal only for elements initially below the viewport, so content remains readable without JavaScript.
- Responsive mobile navigation with `aria-expanded`, click-outside, Escape and viewport-reset handling.
- Keyboard users are moved to the opened menu and returned to its control on Escape; no-script navigation remains available.
- All motion is disabled under `prefers-reduced-motion: reduce`.
- No interaction blocks navigation, requires WebGL, or depends on a third-party animation library.

## Responsive and accessible conventions

- Layout breakpoints at 1100px, 900px, and 620px; content reflows rather than horizontally scrolling.
- Header CTA switches to mobile menu below tablet breakpoint; links remain accessible by keyboard.
- Focus ring uses the distinct signal color; internal navigation has `aria-current`.
- Main landmark, skip link, descriptive article headings and accessible link text retained.
- Decorative system illustrations are `aria-hidden` and contain no content required to understand the page.

## Review / future assets

- [ ] Owner reviews actual appearance on desktop and phone before approval.
- [ ] Confirm whether mint/signal palette and wordmark match final brand direction.
- [ ] If adding project screenshots later, use original captures with explicit rights and suitable alt text.
- [ ] Replace any conceptual image with real media only when it materially strengthens the related case study.
- [ ] Browser-based keyboard, contrast, overflow, touch and motion testing before public launch.

The base structural CSS remains in `src/styles/global.css`. The phase-2 visual layer is isolated in `src/styles/design.css`; motion is managed by `src/interaction.ts`, and the original rotor artwork is `src/components/SystemVisual.astro`.
