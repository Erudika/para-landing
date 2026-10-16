# 08: Publish acceptance fixes to the staging domain

**What to build:** Publish the accepted landing and domain fixes, then confirm the deployed `new.paraio.org` site matches the current build. Keep `paraio.org` unchanged until the planned domain cutover.

**Blocked by:** 07-spec-acceptance-sweep.

**Status:** done

- [x] Push the current acceptance fixes to the configured deployment branch and wait for the GitHub Actions build and deploy jobs to pass
- [x] Live landing and docs canonical URLs use `https://new.paraio.org/`; the sitemap uses the same origin
- [x] Live `/CNAME` contains `new.paraio.org`
- [x] Landing shows the public health curl sample, Java client tab, and one Erudika/Scoold credit
- [x] Live docs search, an old fragment redirect, `llms.txt`, `llms-full.txt`, and Markdown sidecars work
- [x] Live light/dark theme behavior works on the landing page and a docs page
- [x] Record the deployed commit and verify that `paraio.org` remains unchanged

## Comments

- Published commit `ec35e61` to `master`.
- GitHub Actions run `38893472648` passed. It built, verified, uploaded, and deployed the Pages artifact.
- Live checks at `new.paraio.org` confirmed canonical URLs, sitemap origin and coverage, CNAME, curl + Java tabs, footer credit, Markdown/LLM files, search, legacy fragment routing, themes, and HTTPS.
- `paraio.org` still serves the legacy site, as expected until the later domain cutover.
