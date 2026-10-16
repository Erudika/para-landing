# 06: CI deploy to GitHub Pages

**What to build:** Merging ships the site. A CI workflow on push builds the static output and publishes it to GitHub Pages with the custom domain verified working, so no manual deploy script is ever run again.

**Blocked by:** 05-agent-readiness-legacy-compat.

**Status:** needs-info

- [x] Workflow runs on push to `main` or `master`: install, check, build, run build verification, then deploy the Pages artifact; failures never publish
- [ ] Deployed site serves at the custom domain (CNAME honored), HTTPS resolves
- [ ] Root, docs home, one deep docs page, 404, sitemap, `llms.txt`, and `llms-full.txt` all verified on the live domain
- [ ] Legacy deploy script retired; repository README's development → publish flow references CI
- [ ] Pages cache/config does not break agent-readiness artifacts (no header mangling on txt files)

## Comments

- CI workflow added and YAML-parsed locally. It runs the type/content check, static build, and output verification on `main`/`master` pushes and pull requests. It deploys only on `main`/`master` pushes or manual runs from those branches. It uses GitHub's Pages artifact/deploy actions and Node 24.
- `public/CNAME` is included in the build. README documents the workflow and the required repository setting: Pages source must be **GitHub Actions**.
- Live deployment, HTTPS, and hosted response headers are not verified: this workspace is not a Git repository and has no remote. The old `deploy.sh` remains in the separate legacy `paraio.org` repository, which this ticket did not modify.
- To finish this ticket, connect/push this project to its GitHub repository, set Pages source to GitHub Actions, and confirm the custom domain/DNS. Then verify the first live deployment and decide when to retire the old repository's deploy script.
