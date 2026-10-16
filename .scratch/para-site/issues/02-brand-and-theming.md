# 02: Brand and theming system

**What to build:** The site wears Para's visual identity. Both light and dark themes render with a toggle whose default follows system preference. Logo, typeface, color, radius, and texture conventions are established so later sections inherit them. The custom 404 page is wired end to end.

**Blocked by:** 01-scaffold-site-skeleton.

**Status:** done

- [x] Logo SVG (speech-bubble glyph + wordmark) imported with a viewBox added so it scales; glyph sky blue, wordmark gray, both themes
- [x] Brand tokens defined once: sky blue and deep yellow accents, monochrome base, dark-themed primary background
- [x] Light/dark toggle present on the landing header; default follows system preference; switching never flickers content
- [x] Aesthetic utilities established: system fonts only, ASCII-art flavor, dithering effect for simple graphics, 3–5px corner rounding everywhere
- [x] Base layout finished: header nav (site, Docs entry) and footer shells, semantic landmarks and heading structure
- [x] Custom 404 page wireframe done and reachable for unknown URLs
- [x] Build verification passes for both themes (checked with the toggle at system default and manually switched)

## Comments

- Done 2026-10-16. Logo copied from the Erudika brand repo; `viewBox="0 0 2800 880"` added; dark variant (`footer-logo.svg`) uses a light wordmark (`rgb(228,228,231)`), glyph stays `#31c7ff`. Favicon built from the real glyph path.
- Theme mechanism: Starlight 0.42 signals dark via `html[data-theme="dark"]`, not the `.dark` class. The dark variant matches both signals; the landing toggle writes both plus the `starlight-theme` storage key, verified in-browser: system-default follows preference on landing and docs, and the choice round-trips both directions (landing toggle ↔ Starlight select).
- Dither utilities: `.dither` (ordered dot pattern via layered radial gradients, currentColor) used on the hero diagram, Para Cloud panel, 404, and feature hover.
