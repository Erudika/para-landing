# 03: Landing page complete

**What to build:** The full landing walk for a Para-developer: hero stating the one-liner with quickstart, feature grid, BaaS comparison, the Para Cloud promo block, and the self-host CTA — every string sourced from the site data file and rendered through the brand system from ticket 02.

**Blocked by:** 01-scaffold-site-skeleton, 02-brand-and-theming.

**Status:** done

- [x] Hero carries: one-liner (schemaless, stateless, three layers), quickstart snippet, dithered ASCII-style visual; quickstart tab order is curl/REST first, one secondary SDK tab
- [x] Features grid covers: schemaless storage, three layers, stateless scaling, multitenant apps, pluggable DAO/search/cache modules, auth (JWT + social), webhooks, MCP server
- [x] Comparison block positions Para against Supabase/Parse/Firebase with tone limited to one light jab
- [x] Para Cloud promo block sells managed hosting and its CTA points to the hosted service's pricing on paraio.com; no local pricing table
- [x] Final CTA section: GitHub repo link + self-host quickstart anchor
- [x] Footer credit: built by Erudika; Scoold and relevant links live; no blog link
- [x] Every visible string exists in the site data file; a text search over components confirms none are hardcoded
- [x] Build verification passes; landing sections verified present in the output, in both themes

## Comments

- Done 2026-10-16. Eight features in a divided grid (no equal-card row): `01–08` mono numbering, chips for pluggable modules and auth, dither hover. Comparison table has a tinted Para column and the single jab rendered as an ASCII comment line.
- Verified in-browser: all four sections + hero render, 6 comparison rows, tabs switch correctly (curl ↔ para-cli), hero CTA visible in the initial viewport, zero console errors.
- Full-page screenshots of both themes captured for human review at `/tmp/opencode/para-shots/` (this agent cannot view images).
