# 07: Spec acceptance sweep

**What to build:** Final quality gate. Every user story from the spec is verified against the built (and ideally deployed) site at the single test seam; each failing story becomes a concrete follow-up ticket rather than a note. The sweep also closes any remaining polish gaps between the spec and reality.

**Blocked by:** 06-ci-deploy-github-pages.

**Status:** done

- [x] All 24 spec user stories checked one by one; each marked pass or fixed in this ticket, never silently skipped
- [x] Comparison tone, no-blog rule, no-FAQ rule, no-local-pricing rule verified against the built output
- [x] Both themes re-verified on the landing page and a deep docs page
- [x] Trailing-slash rule, sitemap, redirect, llms.txt, CNAME, and glossary terms checked against the build and live staging site; the stale live canonical/CNAME is tracked in ticket 08
- [x] Any leftover mismatch yields a follow-up ticket under this same tracker slug, labelled with the triage vocabulary
- [x] README updated with quickstart for contributors; final report back to the human

## Acceptance matrix

| # | Result | Evidence |
|---:|---|---|
| 1 | Pass | Landing H1 states what Para is. |
| 2 | Fixed | Landing curl sample now calls the public health endpoint and returns a valid response. |
| 3 | Pass | Comparison includes Para, Supabase, Firebase, and Parse. |
| 4 | Fixed | Landing tabs are curl first and Java client second. |
| 5 | Pass | All eight required product capabilities appear in the feature grid. |
| 6 | Pass | Para Cloud promo links to paraio.com; no local pricing is shown. |
| 7 | Pass | GitHub, JAR download, and self-host quickstart links are present. |
| 8 | Pass | Static pages; landing loads a 1.4 KB JavaScript bundle, with no heavy client framework. |
| 9 | Pass | Starlight sidebar and Pagefind search work; live search returned DynamoDB results. |
| 10 | Pass | `/docs/` is the new docs home; old fragment links redirect to their mapped pages. |
| 11 | Pass | Both root-level LLM files return successfully. |
| 12 | Pass | All 101 docs routes have Markdown sidecars and one H1 each. |
| 13 | Pass | Sitemap lists the landing page and all 101 docs routes. |
| 14 | Fixed | Landing copy, logo alt text, and nav labels use site data. |
| 15 | Pass | Starlight content schema validates docs front matter. |
| 16 | Pass | JavaDoc pages and links are absent. |
| 17 | Pass | Maven docs link to the Para server artifact on Maven Central. |
| 18 | Pass | A temporary docs page with no title caused the build to fail; the probe was removed. |
| 19 | Pass | Light/dark system defaults and the toggle were checked on landing and docs. |
| 20 | Pass | Java client is the single secondary SDK example in the docs and landing page. |
| 21 | Fixed | Footer names Erudika and Scoold once, without duplicate text. |
| 22 | Fixed | Built canonical URLs, sitemap host, and CNAME now use `new.paraio.org`. |
| 23 | Pass | GitHub Actions run completed successfully; user confirmed deploy behavior. |
| 24 | Pass | Semantic header, nav, main, footer, and heading levels are present. |

## Comments

- Local checks: `npm run check` reports 0 errors, warnings, or hints. `npm run build` produces 103 HTML pages; `npm run verify` passes all content, route, sitemap, theme, and link checks.
- Live checks at `https://new.paraio.org/` confirmed canonical URLs, the CNAME and sitemap origin, docs search, old fragment redirects, themes, HTTPS, and text/Markdown agent files.
- Ticket 08 published commit `ec35e61` and verified the successful GitHub Actions deployment. The root `paraio.org` cutover is not part of this ticket and remains unchanged.
