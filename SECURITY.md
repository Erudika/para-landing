# Security Policy

## Supported versions

Security fixes are applied to the latest Para release and to the `master`
branch. Older releases may receive a fix at the maintainers' discretion. Always
run the latest stable release.

## Reporting a vulnerability

Do not open a public GitHub issue for a security problem.

- Email: **security@erudika.com**
- Optional PGP: ask for a key in your first message.
- Include: affected version or commit, a description of the issue, reproduction
  steps, and the impact you believe it has.

You can also read the machine-readable contact file at
`https://new.paraio.org/.well-known/security.txt`.

## What to expect

- We acknowledge reports within 3 business days.
- We give an initial assessment within 10 business days.
- We keep you informed while we work on a fix.
- We credit reporters in the release notes unless you ask to stay anonymous.

Please allow us to release a fix before you publish details. We will agree on a
disclosure date with you.

## Scope

In scope:

- The Para server and its official modules in the `Erudika/para` repository.
- The Para Cloud service at `paraio.com`.
- This website at `new.paraio.org`.

Out of scope:

- Findings from automated scanners with no demonstrated impact.
- Denial-of-service tests against production systems.
- Social engineering, spam, or physical attacks.
- Vulnerabilities in third-party services that Para only links to.

## Safe harbour

We will not take legal action against researchers who act in good faith, follow
this policy, avoid privacy violations and data destruction, and give us a
reasonable time to fix the issue before disclosure.
