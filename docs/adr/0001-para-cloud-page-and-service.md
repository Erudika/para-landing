# 1. Para Cloud page and service are separate surfaces

Date: 2026-10-21

## Status

Accepted

## Context

Para Cloud is the managed hosting service for Para. The service, sign-in, billing,
and customer apps live at `paraio.com`. The new site needs a product page for
Para Cloud at `/cloud-hosting/`.

In the future, only the root path `paraio.com/` will redirect to
`/cloud-hosting/`. The service routes such as `/signin`, `/apps`, and `/console`
must stay on `paraio.com`.

## Decision

- The Para Cloud product page is `/cloud-hosting/` on the new site.
- The Para Cloud service and sign-in stay at `paraio.com`.
- Calls to action on the new site go to `https://paraio.com/signin`.
- The home-page Para Cloud call to action goes to `/cloud-hosting/`.
- Legal documents for Para Cloud live under `/legal/` on the new site.
- The root redirect from `paraio.com/` is a later cutover. It is not part of this
  change.

## Consequences

- Marketing copy uses "Para Cloud" as the product name.
- `ParaIO.com` remains the service domain and the name used in legal documents.
- The new site and `paraio.com` must stay consistent while both surfaces exist.
- A future redirect must exclude the service routes.
