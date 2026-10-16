# 07: Spec acceptance sweep

**What to build:** Final quality gate. Every user story from the spec is verified against the built (and ideally deployed) site at the single test seam; each failing story becomes a concrete follow-up ticket rather than a note. The sweep also closes any remaining polish gaps between the spec and reality.

**Blocked by:** 06-ci-deploy-github-pages.

**Status:** ready-for-agent

- [ ] All 24 spec user stories checked one by one; each marked pass or fixed in this ticket, never silently skipped
- [ ] Comparison tone, no-blog rule, no-FAQ rule, no-local-pricing rule verified against the built output
- [ ] Both themes re-verified on the landing page and a deep docs page
- [ ] Trailing-slash rule, sitemap, redirect, llms.txt, CNAME re-verified on deploy domain; glossary term usage in page copy consistent (Para, Para Cloud naming, agent-ready terminology)
- [ ] Any leftover mismatch yields a follow-up ticket under this same tracker slug, labelled with the triage vocabulary
- [ ] README updated with quickstart for contributors; final report back to the human
