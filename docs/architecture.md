# Information architecture and content model

## Primary routes (English)

| Route | Purpose | Source |
| --- | --- | --- |
| / | Positioning, proof, selected work | curated approved collection |
| /work | Products and selected case studies | projects collection |
| /work/[id] | Evidence-based project detail | individual JSON entries |
| /insights | Research and articles | insights collection |
| /insights/[id] | Published article | individual Markdown entries |
| /solutions | Expertise and collaboration modes | editorial page |
| /about | Studio story and founder's role | editorial page |
| /contact | Contact route | verified contact only |

`/education` is reserved in planning, **not** generated until real content exists.

## Navigation

Home · Work · Insights · Solutions · About · Contact

## Project record

- Required: `title`, `summary`, `category`, `role`, `evidenceUrl`.
- Optional structured fields: `details`, `challenge`, `approach`, `highlights[]`, `status`.
- Project pages use these structured fields without hard-coded project IDs.
- Images require rights approval and are deferred until visual design.
- Any claim of a commercial client, launch, results, user count, or revenue
  requires its own evidence and publishing approval.

## Article record

Markdown with `title`, `summary`, `date`, `topic`.
Use citations for externally sourced research claims.
The first article is an original perspective, not a claim of independent scientific research.

## Editorial map

`docs/content-strategy.md` maps four audience paths, page jobs,
evidence boundaries and remaining public-launch sign-offs.

## Change contract

Site components render public collections; they should not know hard-coded
project IDs. Future apps (agents, editorial CMS, teaching) update/add content
or isolated modules behind review, not overwrite global page templates.

## Publication separation

This repository and GitHub Actions artifacts are potentially public.
There is no private-preview flag that makes tracked secrets safe. Maintain
confidential drafts in a separate private location, and only copy an approved
sanitized entry into `src/data/` after review.
