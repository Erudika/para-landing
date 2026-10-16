#!/usr/bin/env node
// Build-output smoke check — the project's single test seam.
// Verifies external behavior of `astro build` output only.

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

// 1. Required pages exist
for (const page of [
  'index.html',
  '404.html',
  'docs/index.html',
  'docs/getting-started/quickstart/index.html',
  'docs/api/index.html',
  'docs/api/objects/create/index.html',
  'docs/search/elasticsearch/index.html',
  'docs/integrations/forms/index.html',
  'docs/getting-started/quickstart.md',
  'docs/index.md',
  'llms.txt',
  'llms-full.txt',
  'CNAME',
  'sitemap-index.xml',
  'sitemap-0.xml',
  'pagefind/pagefind.js',
]) {
  if (await exists(join(DIST, page))) pass(`${page} exists`);
  else fail(`${page} missing`);
}

// 2. Landing content renders
const index = await readFile(join(DIST, 'index.html'), 'utf8');
for (const needle of [
  'general-purpose backend',
  'Get started',
  'Para Cloud',
  'Quickstart',
  'curl -i http://localhost:8080/v1/_health',
  'Java client',
  'ParaClient client',
]) {
  if (index.includes(needle)) pass(`index.html contains "${needle}"`);
  else fail(`index.html missing "${needle}"`);
}
for (const feature of siteData.features.items) {
  if (index.includes(feature.title)) pass(`feature "${feature.title}" is present`);
  else fail(`feature "${feature.title}" is missing`);
}
if (index.includes('Why not Supabase?') && index.includes('Firebase') && index.includes('Parse')) {
  pass('BaaS comparison covers Supabase, Firebase, and Parse');
} else {
  fail('BaaS comparison is incomplete');
}
if (!/\bBlog\b|\bFAQ\b|Frequently asked questions/i.test(index)) pass('no blog or FAQ section is present');
else fail('unexpected blog or FAQ section is present');
if ((index.match(/<table\b/g) ?? []).length === 1 && index.includes('Pricing at paraio.com')) {
  pass('only the comparison table is local; Para Cloud pricing links out');
} else {
  fail('unexpected local pricing table or missing Para Cloud pricing link');
}
const footerText = index.match(/<footer\b[\s\S]*?<\/footer>/)?.[0] ?? '';
if (footerText.includes('Built by Erudika') && (footerText.match(/Scoold/g) ?? []).length === 1) {
  pass('footer credits Erudika and Scoold once');
} else {
  fail('footer credit is missing or duplicated');
}
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

// 3. Theme toggle wired: pre-paint script + toggle button
if (index.includes('prefers-color-scheme') && index.includes('starlight-theme')) {
  pass('theme system-preference script present');
} else {
  fail('theme system-preference script missing');
}
if (index.includes('data-theme-toggle')) pass('theme toggle button present');
else fail('theme toggle button missing');

// 3b. Migrated docs have representative content and generated routes.
const docsQuickstart = await readFile(join(DIST, 'docs/getting-started/quickstart/index.html'), 'utf8');
for (const needle of ['Make your first request', 'curl -i', 'ParaClient']) {
  if (docsQuickstart.includes(needle)) pass(`docs quickstart contains "${needle}"`);
  else fail(`docs quickstart missing "${needle}"`);
}
const createObject = await readFile(join(DIST, 'docs/api/objects/create/index.html'), 'utf8');
for (const needle of ['POST /v1/{type}', 'Request', 'Response']) {
  if (createObject.includes(needle)) pass(`create-object reference contains "${needle}"`);
  else fail(`create-object reference missing "${needle}"`);
}
const docsHtml = await walkHtml(join(DIST, 'docs'));
if (docsHtml.length === 101) pass('docs home plus all 100 legacy pages are built');
else fail(`expected docs home plus 100 legacy pages; found ${docsHtml.length} docs pages`);

// 3c. Agent-ready Markdown files and discovery indexes are complete.
const llms = await readFile(join(DIST, 'llms.txt'), 'utf8');
const llmsFull = await readFile(join(DIST, 'llms-full.txt'), 'utf8');
const markdownLinkCount = [...llms.matchAll(/^- \[[^\]]+\]\(\/docs\/[^)]+\.md\)/gm)].length;
if (markdownLinkCount === 101) pass('llms.txt links to all 101 documentation pages as Markdown');
else fail(`llms.txt has ${markdownLinkCount} Markdown page links; expected 101`);
for (const needle of ['# Para', 'Quickstart', 'REST API overview']) {
  if (llmsFull.includes(needle)) pass(`llms-full.txt contains "${needle}"`);
  else fail(`llms-full.txt missing "${needle}"`);
}
const markdownFiles = (await walkFiles(join(DIST, 'docs'))).filter((path) => path.endsWith('.md'));
if (markdownFiles.length === 101) pass('all documentation pages are available as Markdown files');
else fail(`expected 101 documentation Markdown files; found ${markdownFiles.length}`);
const cname = (await readFile(join(DIST, 'CNAME'), 'utf8')).trim();
if (cname === siteUrl.hostname) pass(`CNAME contains ${siteUrl.hostname}`);
else fail(`CNAME has unexpected domain: ${cname}`);

// 3d. The old docs anchors map to pages that now exist.
const legacyRoutes = JSON.parse(await readFile('src/data/legacy-doc-routes.json', 'utf8'));
const legacyRouteCount = Object.keys(legacyRoutes).length;
let invalidLegacyRoutes = 0;
for (const [fragment, route] of Object.entries(legacyRoutes)) {
  const output = join(DIST, route.replace(/^\//, ''), 'index.html');
  if (!(await exists(output))) {
    invalidLegacyRoutes++;
    fail(`legacy fragment ${fragment} points to missing page ${route}`);
  }
}
if (legacyRouteCount === 101 && invalidLegacyRoutes === 0) pass('all old docs fragment IDs map to built pages');
else if (legacyRouteCount !== 101) fail(`legacy route map has ${legacyRouteCount} entries; expected 101`);
const redirectBundles = (await walkFiles(join(DIST, '_astro'))).filter((path) => path.endsWith('.js'));
let redirectBundleFound = false;
for (const bundle of redirectBundles) {
  const source = await readFile(bundle, 'utf8');
  if (
    source.includes('034-api-jwt-signin') &&
    source.includes('/docs/api/authentication/sign-in/') &&
    source.includes('window.location.replace')
  ) {
    redirectBundleFound = true;
    break;
  }
}
if (redirectBundleFound) pass('legacy docs hash redirects are included in the built site');
else fail('legacy docs hash redirect code is missing from the build');

// 3e. The sitemap index includes the new docs routes.
const sitemap = await readFile(join(DIST, 'sitemap-0.xml'), 'utf8');
for (const needle of ['/docs/', '/docs/getting-started/quickstart/', '/docs/api/objects/create/']) {
  if (sitemap.includes(`${siteUrl.origin}${needle}`)) pass(`sitemap includes ${needle}`);
  else fail(`sitemap missing ${needle}`);
}
const sitemapDocsCount = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
  .map(([, url]) => new URL(url))
  .filter((url) => url.origin === siteUrl.origin && url.pathname.startsWith('/docs/')).length;
if (sitemapDocsCount === 101) pass('sitemap lists all 101 docs routes');
else fail(`sitemap lists ${sitemapDocsCount} docs routes; expected 101`);

// 3f. Every docs page has one page title; API request sections use H2 headings.
let invalidHeadingPages = 0;
for (const file of docsHtml) {
  const html = await readFile(file, 'utf8');
  if ((html.match(/<h1\b/g) ?? []).length !== 1) {
    invalidHeadingPages++;
    fail(`${file}: expected exactly one H1`);
  }
}
if (invalidHeadingPages === 0) pass('all docs pages have exactly one H1');
if (createObject.includes('<h2 id="request"') && createObject.includes('<h2 id="response"')) {
  pass('API request and response sections use ordered H2 headings');
} else {
  fail('API request/response heading levels are incorrect');
}

// 4. Trailing slash sweep: no bare internal hrefs
const htmlFiles = await walkHtml(DIST);
const fileLike = /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js|mjs|json|txt|xml|pdf|zip|md|woff2?|ttf|map)$/i;
let bareLinks = 0;
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const match of html.matchAll(/href="([^"]*)"/g)) {
    const href = match[1];
    if (!href.startsWith('/')) continue; // external or relative
    if (href.startsWith('//')) continue; // protocol-relative external
    if (fileLike.test(href)) continue; // asset files
    if (!href.endsWith('/') && !href.includes('#')) {
      bareLinks++;
      fail(`${file}: internal href without trailing slash: ${href}`);
    }
  }
}
if (bareLinks === 0) pass(`no bare internal links across ${htmlFiles.length} HTML files`);

// 5. Every internal page href resolves to a generated static HTML route.
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

console.log('');
if (failures > 0) {
  console.error(`FAILED: ${failures} check(s) failed`);
  process.exit(1);
} else {
  console.log('PASSED: all checks green');
}
