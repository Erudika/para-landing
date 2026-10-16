# 08: Publish acceptance fixes to the staging domain

**What to build:** Publish the accepted landing and domain fixes, then confirm the deployed `new.paraio.org` site matches the current build. Keep `paraio.org` unchanged until the planned domain cutover.

**Blocked by:** 07-spec-acceptance-sweep.

**Status:** ready-for-agent

- [ ] Push the current acceptance fixes to the configured deployment branch and wait for the GitHub Actions build and deploy jobs to pass
- [ ] Live landing and docs canonical URLs use `https://new.paraio.org/`; the sitemap uses the same origin
- [ ] Live `/CNAME` contains `new.paraio.org`
- [ ] Landing shows the public health curl sample, Java client tab, and one Erudika/Scoold credit
- [ ] Live docs search, an old fragment redirect, `llms.txt`, `llms-full.txt`, and Markdown sidecars work
- [ ] Live light/dark theme behavior works on the landing page and a docs page
- [ ] Record the deployed commit and verify that `paraio.org` remains unchanged
