# 04: Docs migration to multi-page

**What to build:** The documentation lives in Starlight as multi-page docs with a grouped sidebar and search, built by migrating the legacy markdown sources. A developer can find any legacy topic by navigation instead of one-page scroll, and the docs read like the product docs of a project that targets curl-first integrators.

**Blocked by:** 01-scaffold-site-skeleton.

**Status:** done

- [x] All legacy markdown fragments migrated; nothing dropped except the standalone JavaDoc content, which is answered by a Maven Central link
- [x] Sidebar grouped per topic families consistent with the legacy structure: getting started, core concepts (ParaObject, apps, permissions, validations, webhooks), data-access module family (DAO integrations), search module family, cache module family, auth section, REST API reference, integrations (queue, storage, emailer), and plugins
- [x] Legacy section order preserved as the canonical sequence within each group, and the docs home page links each group
- [x] Content collection schema validates front matter; a malformed page fails the build loudly
- [x] Docs search returns results for top-topic queries
- [x] Code samples are curl/REST first with one secondary SDK tab (Java client)
- [x] Headings are clean and hierarchical (no decorative divs posing as headings) — this doubles as the agent-readiness foundation
- [x] Build verification passes; migrated pages verified present in the output

## Comments

- Done 2026-10-16. Migrated all 100 Markdown fragments from the legacy site into 100 Starlight pages. The docs home page brings the total to 101 docs routes.
- Organized docs under Getting started, Core concepts, Configuration, Persistence and data stores, Search, Cache, Security, Integrations, Utilities and operations, and REST API endpoint groups. Sidebar order follows the legacy numbered fragment order inside each group.
- Converted old partial-anchor links to new canonical docs routes. Converted the legacy Bootstrap client-logo wall to plain client links. Removed the old collapse/expand control. Preserved API method/path metadata as visible request lines.
- Removed standalone JavaDocs links and replaced them with a Maven Central artifact link. JavaDocs hosting is not part of this ticket.
- Quickstart now shows curl/REST first, with one Java client tab. The curl sample uses the public health endpoint; authenticated operations link to the authentication guide.
- Starlight Pagefind search verified in-browser with queries for `DynamoDB`, `JWT`, and `MCP server`. Quickstart tabs and grouped sidebar verified in-browser.
- Verification: `astro check` has 0 errors, warnings, and hints; the static build produced 103 pages (100 migrated docs + docs home + landing + 404); `npm run verify` passes, including internal-link resolution and migrated-page content checks. A temporary malformed docs page failed the build as expected; it was removed after the test.
