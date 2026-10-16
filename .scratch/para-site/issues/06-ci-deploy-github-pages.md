# 06: CI deploy to GitHub Pages

**What to build:** Merging ships the site. A CI workflow on push builds the static output and publishes it to GitHub Pages with the custom domain verified working, so no manual deploy script is ever run again.

**Blocked by:** 05-agent-readiness-legacy-compat.

**Status:** done

- [x] Workflow runs on push to `main` or `master`: install, check, build, run build verification, then deploy the Pages artifact; failures never publish
- [x] Deployed site serves at the current custom domain (`new.paraio.org`), HTTPS resolves
- [x] Root, docs home, one deep docs page, 404, sitemap, `llms.txt`, and `llms-full.txt` verified on the live domain
- [x] This repository uses CI instead of a manual deploy script; README's development → publish flow references CI
- [x] Pages serves agent-readiness artifacts as text and Markdown, without header or cache errors

## Comments

- CI workflow added and YAML-parsed locally. It runs the type/content check, static build, and output verification on `main`/`master` pushes and pull requests. It deploys only on `main`/`master` pushes or manual runs from those branches. It uses GitHub's Pages artifact/deploy actions and Node 24.
- User confirmed the GitHub Actions deployment. The latest workflow run completed successfully and reported the Pages URL as `new.paraio.org`.
- Live verification at `https://new.paraio.org/` confirmed the landing page, docs, search, sitemap, `llms.txt`, `llms-full.txt`, Markdown sidecars, HTTPS, and response types. The current hostname is temporary; `paraio.org` remains the planned final domain. Ticket 07 corrected the checked-in CNAME and canonical URL to match the temporary hostname.
- The live artifact still reflects the prior commit and returns `paraio.org` at `/CNAME`; ticket 08 tracks publishing the updated CNAME and canonical URL.
- The legacy repository can keep its old deploy script until the final domain cutover. This repository has no manual deploy script.
