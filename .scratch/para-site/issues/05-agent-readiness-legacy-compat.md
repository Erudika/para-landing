# 05: Agent readiness and legacy compatibility

**What to build:** The documentation becomes agent-ready and the legacy URLs keep working. An LLM agent can discover and ingest the full docs via root-level files; a human following an old bookmark lands on the new docs and old deep links resolve through redirects.

**Blocked by:** 04-docs-migration-multipage.

**Status:** done

- [x] `llms.txt` emitted at the site root at build time: site description plus one markdown link per docs page with a title
- [x] `llms-full.txt` emitted alongside: full concatenated docs content in legacy-derived section order
- [x] Sitemap lists every page (including docs) with canonical URLs matching the trailing-slash routing
- [x] Legacy single-page `/docs/` URL resolves to the new docs home at the same URL; old section fragments redirect to their new topic pages
- [x] Trailing-slash sweep passes: no bare internal link exists anywhere, verified against a crawl of all internal hrefs
- [x] CNAME file present in build output so the custom domain survives deploys
- [x] Heading structure verified: one H1 per page, ordered H2/H3 where the API reference endpoints benefit, front-matter titles match page headings
- [x] Build verification passes, including the agent artifacts present in the output

## Comments

- Done 2026-10-16. `npm run build` now creates `llms.txt`, `llms-full.txt`, and 101 individual Markdown sidecars under `/docs/` before Astro builds. The LLM index has one title link per documentation page; the full file follows the old fragment order.
- Legacy fragment IDs map to their new Starlight page. Since `/docs/` is already the new docs home, no separate redirect page is needed; the same URL stays canonical. Verified the old `#034-api-jwt-signin` bookmark redirects to `/docs/api/authentication/sign-in/` in the browser.
- `sitemap-0.xml` includes all 101 docs routes. `CNAME` matches the active `new.paraio.org` domain and appears in build output. The docs pages have one H1 each; API Request and Response use H2 headings.
- `npm run verify` checks generated artifacts, sidecar count, sitemap coverage, fragment mappings, heading count, trailing slashes, and internal page links. `npm run check` reports 0 errors, 0 warnings, and 0 hints.
