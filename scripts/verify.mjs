#!/usr/bin/env node
// Build-output smoke check — the project's single test seam.
// Verifies external behaviour of `astro build` output only.

import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const siteData = JSON.parse(await readFile('src/data/site-data.json', 'utf8'));
const site = siteData.site;
const siteUrl = new URL(site.url);
let failures = 0;

function fail(msg) {
  failures++;
  console.error(`  FAIL ${msg}`);
}
function pass(msg) {
  console.log(`  ok   ${msg}`);
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

async function walkHtml(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkHtml(full, acc);
    else if (entry.name.endsWith('.html')) acc.push(full);
  }
  return acc;
}

async function walkFiles(dir, acc = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) await walkFiles(full, acc);
    else acc.push(full);
  }
  return acc;
}

console.log('verifying build output in dist/');

// 1. Required pages and assets exist.
for (const file of [
  'index.html',
  '404.html',
  'docs/index.html',
  'docs/getting-started/quickstart/index.html',
  'docs/getting-started/architecture/index.html',
  'docs/reference/para-api/index.html',
  'docs/security/rest-api-authentication/index.html',
  'docs/integrations/forms/index.html',
  'docs/getting-started/quickstart.md',
  'docs/index.md',
  'llms.txt',
  'llms-full.txt',
  'CNAME',
  'manifest.json',
  'sw.js',
  'offline.html',
  'og-image.png',
  'favicon.svg',
  'favicon.ico',
  'favicon-32x32.png',
  'apple-touch-icon.png',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  '.well-known/security.txt',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'pagefind/pagefind.js',
]) {
  if (await exists(join(DIST, file))) pass(`${file} exists`);
  else fail(`${file} missing`);
}

// 2. Landing content renders.
const index = await readFile(join(DIST, 'index.html'), 'utf8');
for (const needle of [
  'general-purpose backend',
  'Get started',
  'Para Cloud',
  'Use the client you know',
  'ParaClient',
  'Schemaless objects',
]) {
  if (index.includes(needle)) pass(`index.html contains "${needle}"`);
  else fail(`index.html missing "${needle}"`);
}
const featuresHtml = await readFile(join(DIST, 'features/index.html'), 'utf8');
for (const [i, feature] of siteData.features.items.entries()) {
  const scope = i < 8 ? index : featuresHtml;
  const page = i < 8 ? 'index.html' : 'features/index.html';
  if (scope.includes(feature.title)) pass(`feature "${feature.title}" is present in ${page}`);
  else fail(`feature "${feature.title}" is missing from ${page}`);
}
if (index.includes('Why not Supabase?') && index.includes('Firebase') && index.includes('Parse')) {
  pass('BaaS comparison covers Supabase, Firebase, and Parse');
} else {
  fail('BaaS comparison is incomplete');
}
if ((index.match(/<table\b/g) ?? []).length === 1) pass('landing has exactly one comparison table');
else fail('unexpected number of tables on the landing page');
if (index.includes('/cloud-hosting/')) pass('landing links to Para Cloud');
else fail('landing does not link to Para Cloud');
const footerText = index.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
if (footerText.includes('Erudika')) pass('footer credits Erudika');
else fail('footer credit is missing');
if (index.includes(`<link rel="canonical" href="${siteUrl.origin}/"`)) {
  pass(`landing canonical matches ${siteUrl.origin}`);
} else {
  fail(`landing canonical does not match ${siteUrl.origin}`);
}
if (index.includes('<header') && index.includes('<main') && footerText) {
  pass('landing uses header, main, and footer landmarks');
} else {
  fail('landing is missing a semantic page landmark');
}
if (index.includes('href="#main"') && index.includes('id="main"')) pass('landing has a working skip link');
else fail('landing skip link is missing or does not target main');

// 3. Theme system is wired to one key.
if (index.includes('prefers-color-scheme') && index.includes('starlight-theme')) {
  pass('theme system-preference script present');
} else {
  fail('theme system-preference script missing');
}
if (index.includes('data-theme-toggle')) pass('theme toggle button present');
else fail('theme toggle button missing');
if (!index.includes('para-theme')) pass('no stale para-theme storage key');
else fail('stale para-theme storage key is still present');

// 4. Docs have representative content.
const quickstart = await readFile(join(DIST, 'docs/getting-started/quickstart/index.html'), 'utf8');
for (const needle of ['Make your first request', 'curl -i', 'ParaClient']) {
  if (quickstart.includes(needle)) pass(`docs quickstart contains "${needle}"`);
  else fail(`docs quickstart missing "${needle}"`);
}
const apiReference = await readFile(join(DIST, 'docs/reference/para-api/index.html'), 'utf8');
for (const needle of ['REST API', 'GET /myobjects']) {
  if (apiReference.includes(needle)) pass(`API reference contains "${needle}"`);
  else fail(`API reference missing "${needle}"`);
}

const docsHtml = await walkHtml(join(DIST, 'docs'));
const docsMarkdown = (await walkFiles(join(DIST, 'docs'))).filter((path) => path.endsWith('.md'));
if (docsHtml.length >= 60) pass(`${docsHtml.length} docs HTML pages built`);
else fail(`expected at least 60 docs pages; found ${docsHtml.length}`);
if (docsMarkdown.length === docsHtml.length) {
  pass(`Markdown sidecars match docs pages (${docsMarkdown.length})`);
} else {
  fail(`${docsMarkdown.length} Markdown sidecars for ${docsHtml.length} docs pages`);
}

let invalidHeadingPages = 0;
let missingDocsJsonLd = 0;
for (const file of docsHtml) {
  const html = await readFile(file, 'utf8');
  if ((html.match(/<h1\b/g) ?? []).length !== 1) {
    invalidHeadingPages++;
    fail(`${file}: expected exactly one H1`);
  }
  if (!html.includes('application/ld+json')) {
    missingDocsJsonLd++;
    fail(`${file}: missing JSON-LD`);
  }
}
if (invalidHeadingPages === 0) pass('all docs pages have exactly one H1');
if (missingDocsJsonLd === 0) pass('all docs pages include JSON-LD');

// 5. Agent-ready Markdown files and discovery indexes are complete.
const llms = await readFile(join(DIST, 'llms.txt'), 'utf8');
const llmsFull = await readFile(join(DIST, 'llms-full.txt'), 'utf8');
const markdownLinkCount = [...llms.matchAll(/^- \[[^\]]+\]\(\/docs\/[^)]+\.md\)/gm)].length;
if (markdownLinkCount === docsMarkdown.length) {
  pass(`llms.txt links to all ${markdownLinkCount} documentation pages`);
} else {
  fail(`llms.txt has ${markdownLinkCount} Markdown page links; expected ${docsMarkdown.length}`);
}
for (const needle of ['# Para', 'Quickstart', 'REST API']) {
  if (llmsFull.includes(needle)) pass(`llms-full.txt contains "${needle}"`);
  else fail(`llms-full.txt missing "${needle}"`);
}
const cname = (await readFile(join(DIST, 'CNAME'), 'utf8')).trim();
if (cname === siteUrl.hostname) pass(`CNAME contains ${siteUrl.hostname}`);
else fail(`CNAME has unexpected domain: ${cname}`);

// 6. The old docs anchors map to pages that exist.
const legacyRoutes = JSON.parse(await readFile('src/data/legacy-doc-routes.json', 'utf8'));
let invalidLegacyRoutes = 0;
for (const [fragment, route] of Object.entries(legacyRoutes)) {
  const output = join(DIST, route.replace(/^\//, ''), 'index.html');
  if (!(await exists(output))) {
    invalidLegacyRoutes++;
    fail(`legacy fragment ${fragment} points to missing page ${route}`);
  }
}
if (invalidLegacyRoutes === 0) pass('all old docs fragment IDs map to built pages');

// 7. The sitemap includes the docs routes.
const sitemap = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const needle of [
  '/',
  '/docs/',
  '/docs/getting-started/quickstart/',
  '/docs/reference/para-api/',
  '/cloud-hosting/',
]) {
  if (sitemap.includes(`${siteUrl.origin}${needle}`)) pass(`sitemap includes ${needle}`);
  else fail(`sitemap missing ${needle}`);
}
const sitemapDocsCount = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, url]) => new URL(url))
  .filter((url) => url.origin === siteUrl.origin && url.pathname.startsWith('/docs/')).length;
if (sitemapDocsCount === docsHtml.length) pass('sitemap lists all docs routes');
else fail(`sitemap lists ${sitemapDocsCount} docs routes; expected ${docsHtml.length}`);

// 8. Every HTML page has the metadata crawlers and social cards need.
const htmlFiles = await walkHtml(DIST);
const fileLike = /\.(png|jpe?g|gif|svg|webp|ico|css|js|mjs|json|txt|xml|pdf|zip|md|html|webmanifest|woff2?|ttf|map)$/i;
let missingMetadata = 0;
for (const file of htmlFiles) {
  if (file.endsWith('offline.html')) continue;
  const html = await readFile(file, 'utf8');
  for (const [label, pattern] of [
    ['description', /<meta name="description" content="[^"]+"/],
    ['canonical', /<link rel="canonical" href="[^"]+"/],
    ['og:image', /<meta property="og:image" content="[^"]+"/],
  ]) {
    if (!pattern.test(html)) {
      missingMetadata++;
      fail(`${file}: missing ${label}`);
    }
  }
}
if (missingMetadata === 0) pass(`all ${htmlFiles.length} pages have description, canonical and OG image`);

// 9. Trailing slash sweep: no bare internal page hrefs.
let bareLinks = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue;
    if (href.startsWith('//')) continue;
    if (fileLike.test(href)) continue;
    if (!href.endsWith('/') && !href.includes('#')) {
      bareLinks++;
      fail(`${file}: internal href without trailing slash: ${href}`);
    }
  }
}
if (bareLinks === 0) pass(`no bare internal links across ${htmlFiles.length} HTML files`);

// 10. Every internal page href resolves to a generated static HTML route.
let brokenPages = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = match[1];
    if (!href.startsWith('/') || href.startsWith('//') || fileLike.test(href)) continue;
    const pathname = new URL(href, siteUrl).pathname;
    if (pathname.includes('.')) continue;
    const target = join(DIST, pathname.replace(/^\//, ''), 'index.html');
    if (!(await exists(target))) {
      brokenPages++;
      fail(`${file}: internal page link has no output: ${href}`);
    }
  }
}
if (brokenPages === 0) pass('all internal page links resolve to built output');
let apiLinks = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  if (html.includes('href="/docs/api/')) {
    apiLinks++;
    fail(`${file}: link to removed /docs/api/ route`);
  }
}
if (apiLinks === 0) pass('no links to removed /docs/api/ routes');

console.log('');
if (failures > 0) {
  console.error(`FAILED: ${failures} check(s) failed`);
  process.exit(1);
} else {
  console.log('PASSED: all checks green');
}
