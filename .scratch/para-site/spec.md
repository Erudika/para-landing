# Spec: Para landing and documentation site

<!-- Issue: para-site -->
Status: ready-for-agent

## Problem Statement

Para has no modern web presence. Its current landing page and documentation are a decade-old Grunt/Assemble static site: a single stitched HTML page for ~110 sections of docs, no full-text navigation experience for humans, and no machine-readable surface for LLM agents. Developers evaluating Para against Supabase, Parse, or Firebase can't quickly grasp the product story, get to a quickstart, or see the hosted Para Cloud option in one coherent site.

## Solution

One Astro-based static site at paraio.org that replaces the legacy site entirely:

- A landing page that sells Para to developers: minimal monochrome ASCII-art aesthetic, quickstart-first hero, feature grid, "why not Supabase" comparison, Para Cloud promo block, and clear self-host CTAs.
- Multi-page documentation with a sidebar and search, migrated from the legacy doc sources, structured so an LLM agent is the primary consumer (agent-ready docs).
- Light and dark themes with a toggle; default follows system preference.

## User Stories

1. As a developer evaluating backends, I want the hero to state what Para is in one line, so that I know within seconds if it's relevant to me.
2. As a developer evaluating backends, I want a runnable quickstart snippet on the front page, so that I can go from curiosity to a working server in minutes.
3. As a developer comparing BaaS options, I want a "why not Supabase/Parse/Firebase" comparison section, so that I can position Para against what I already know.
4. As a developer integrating Para, I want curl/REST-first code examples with a secondary SDK tab, so that I never need to know Java to integrate.
5. As a developer requiring flexibility, I want a feature grid covering schemaless storage, the three layers, stateless scaling, multitenant apps, pluggable DAOs/search/cache, auth, webhooks, and MCP server support, so that I can see the full surface at a glance.
6. As a developer who dislikes self-hosting ops, I want a Para Cloud promo block selling managed hosting, so that I can decide whether the paid option fits, being pointed to paraio.com for pricing.
7. As a self-hoster, I want GitHub and download CTAs with setup instructions, so that I can run Para on my own infrastructure.
8. As a potential user, I want the site to load fast and work without JavaScript bloat, so that the page feels as lean as the product claims to be.
9. As a human docs reader, I want multi-page docs with a sidebar and search, so that I can find a specific topic instead of scrolling one giant page.
10. As a human docs reader following an old link, I want the legacy single-page docs URL to redirect to the new docs home, so that my bookmark doesn't rot.
11. As an LLM agent, I want an `llms.txt` and `llms-full.txt` at the site root, so that I can discover and ingest the documentation efficiently.
12. As an LLM agent, I want docs pages backed by clean markdown sources with clean heading structure, so that I can quote precise answers without HTML noise.
13. As an LLM agent, I want a sitemap of all pages, so that I can enumerate what's available.
14. As a maintainer, I want every visible string on the landing site sourced from one data file, so that copy edits never touch component code.
15. As a maintainer, I want the docs content conforming to a validated content collection schema, so that broken front matter fails the build instead of shipping.
16. As a maintainer, I want the JavaDoc HTML trees dropped from the site, so that I don't maintain an ingest pipeline nobody asked for.
17. As a maintainer, I want a JavaDocs-to-Maven-Central link in the docs, so that API reference seekers still have a path.
18. As a developer on the site, I want the build to fail loudly on schema or type errors, so that bad content can't reach production.
19. As a visitor in light or dark environment, I want a theme toggle defaulting to my system preference, so that the site respects my eyes.
20. As a developer integrating from another language, I want secondary SDK code examples (picked from what legacy docs emphasize), so that I get idiomatic guidance.
21. As a site visitor, I want the footer crediting Erudika (Scoold), so that I know who maintains Para.
22. As an AI tool such as a code assistant, I want clean page URLs with trailing slashes matching the sitemap, so that I can canonically reference pages.
23. As a maintainer, I want deploys automated via CI on push to the static host, so that publishing is one merge, not a manual script.
24. As a screen reader user, I want semantic headings and landmarks across pages, so that navigation is accessible — this is doubly important since clean structure is also the agent-readiness requirement.

## Implementation Decisions

- **Stack (mandated by the adopted scaffold skill):** Astro 6 static output, Starlight 0.38 for docs, Tailwind CSS 4 via the Vite plugin, daisyUI 5 via CSS `@plugin`, needs-package alignment to the skill's known-good versions.
- **Single source of truth:** every visible landing-site string lives in a site data JSON file; components read from it, never hardcode copy. The docs body remains markdown within the Starlight content collections.
- **Routing:** `trailingSlash: 'always'`; all internal links end with `/`. The sitemap integration registers before Starlight.
- **Legacy landing sections mapped to new sections:** hero, features grid, comparison, Para Cloud promo, final CTA, footer credit. No blog; no FAQ; no local pricing (Para Cloud CTA points to the hosted service's own pricing page).
- **Docs structure:** multi-page under a docs root, sidebar grouped by topic families consistent with the legacy source (setup/quickstart, core concepts, data-access modules, search, cache, auth, REST API reference, integrations). A route redirect maps the legacy single-page docs URL to the new docs home.
- **Agent-ready docs:** `llms.txt` + `llms-full.txt` emitted at the site root at build time, markdown sources kept clean, headings preserved; one document source serves both humans and agents — no forked machine copies. JavaDocs dropped; linked to Maven Central instead.
- **Brand:** logo SVG (speech-bubble glyph + wordmark) imported with a viewBox added for scaling; glyph sky blue, gray wordmark; accents sky blue and deep yellow on the dark theme; system fonts only; minimal monochrome with ASCII-art flavor, dithering effects on graphics, 3–5px corner rounding as the component-level radius convention.
- **Theming:** light + dark both supported via a toggle; default resolved from system preference; both themes verified at the seam.
- **Deployment:** GitHub Pages from this repo via GitHub Actions on push; legacy CNAME retained. The manual deploy script is retired.
- **Code samples:** curl/HTTP-first in hero and throughout docs; one secondary SDK language tab (highest-priority SDK per the legacy sources).

## Testing Decisions

- **Seam (single, high):** the built static site. All tests assert external behavior of the build output: build success with zero type/schema errors, page presence at trailing-slash URLs, legacy docs redirect, presence of `llms.txt`, `llms-full.txt`, sitemap, and CNAME, both themes rendering, and docs pages containing their migrated sections.
- A good test asserts observable output (HTTP-ish presence, content text), never component internals or CSS class names.
- Prior art: none — greenfield. The first build-verification test set establishes the pattern; keep them as fast, dependency-light scripts runnable locally and in CI.

## Out of Scope

- Blog or changelog (lives on the company site).
- FAQ page.
- Local pricing tables for Para Cloud (pricing lives on the hosted service's site).
- JavaDoc hosting/ingest pipeline.
- Site i18n / translations (legacy site is English-only).
- Human-facing Java-style API explorer or Swagger UI.
- Backend functionality of any kind — the site is fully static.

## Further Notes

- Migration source: legacy docs are ~110 numbered markdown fragments concatenated in one legacy page; order in that page is the canonical source for section order during migration.
- The comparison tone stays playful (one light jab allowed by the standing decision); no aggression.
- The old site's "About/Clients" content reduces to the footer credit per the agreed lean structure.
- Domain vocabulary lives in the repo glossary; ticket and page names should use its canonical terms (Para, App, ParaObject, three layers, Para Cloud, agent-ready docs).
