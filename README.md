# [ParaIO.org](ParaIO.org) Landing & Docs page

Landing and documentation site for [Para](https://github.com/Erudika/para), the open-source backend for the cloud. Currently live at [new.paraio.org](https://new.paraio.org); `paraio.org` remains the planned final domain.

## Stack

- Astro 7 (static output) + Starlight for docs
- Tailwind CSS 4 via `@tailwindcss/vite`, daisyUI 5 via CSS `@plugin`
- `site-data.json` as the single source of truth for strings
- Trailing slashes on every internal link

## Development

```sh
npm install
npm run dev       # local dev server
npm run build     # static build to dist/
npm run check     # astro check (type + content schema)
npm run verify    # build-output smoke checks against dist/
```

Run `npm run build && npm run verify` before declaring any ticket done — `dist/` is the project's single test seam.

## Project rules

1. **`src/data/site-data.json` is the single source of truth.** Every visible string on the landing site (nav labels, hero copy, features, comparison, promos, footer, 404) lives there. Never hardcode strings in `.astro` files. Docs page bodies are markdown content, not site-data.
2. **Every internal link ends with `/`.** Enforced by `trailingSlash: 'always'` in `astro.config.mjs`, but write them correctly by hand too — Astro does not rewrite `href` attributes.
3. **Version pins.** `astro`, `@astrojs/starlight`, `@astrojs/mdx`, `@astrojs/sitemap`, `@tailwindcss/vite`, `tailwindcss` are exact-pinned to a known-good, registry-verified set. Update pins deliberately, together, after checking peer compatibility (`@astrojs/starlight` requires a matching `astro` range; `@astrojs/check` does not support TypeScript 7).
4. **Visual identity.** Minimal monochrome, ASCII-art flavor, dithered graphics, 3–5px corner radius (`rounded-[4px]`), system fonts only. Accents: sky blue (logo glyph color) and deep yellow on dark backgrounds. Light and dark themes both render; default follows system preference; the toggle stays in sync with Starlight via the `starlight-theme` storage key, `.dark` class, and `data-theme` attribute.
5. **Domain vocabulary.** Use the canonical terms from `GLOSSARY.md` (Para, App, ParaObject, Para Cloud, agent-ready docs, the three layers).

## Deployment

GitHub Pages at new.paraio.org, via `.github/workflows/astro.yml` and `withastro/action`. Pushes to `main` or `master` build and deploy the site; the workflow uses the Bun lockfile and `bun run build`. Set the repository's Pages source to **GitHub Actions**. `public/CNAME` keeps the current custom domain, and GitHub Pages provides HTTPS.

Each `npm run build` first generates `llms.txt`, `llms-full.txt`, and individual Markdown files for the docs under `public/docs/`. The build then copies these files into `dist/` with the site. Run `npm run build && npm run verify` before deploying.

GitHub Pages does not support custom response headers. If the site is fronted by a CDN or reverse proxy, set these headers there:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- `Content-Security-Policy: frame-ancestors 'none'`
- `X-Frame-Options: DENY` (legacy fallback)

## License

Site content: Apache-2.0, same as Para. Logo © Erudika Ltd.
