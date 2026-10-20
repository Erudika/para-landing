import { mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve, sep } from 'node:path';
import siteData from '../src/data/site-data.json' with { type: 'json' };
import legacyRoutes from '../src/data/legacy-doc-routes.json' with { type: 'json' };

const projectRoot = process.cwd();
const docsRoot = resolve(projectRoot, 'src/content/docs/docs');
const publicRoot = resolve(projectRoot, 'public');

async function collectMarkdown(dir) {
  const result = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) result.push(...(await collectMarkdown(fullPath)));
    else if (/\.mdx?$/.test(entry.name)) result.push(fullPath);
  }
  return result;
}

function pageRoute(filePath) {
  const sourcePath = relative(docsRoot, filePath).split(sep).join('/');
  const withoutExtension = sourcePath.replace(/\.mdx?$/, '');
  if (withoutExtension === 'index') return '/docs/';
  return `/docs/${withoutExtension.replace(/\/index$/, '')}/`;
}

function frontmatter(text) {
  const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { title: 'Untitled', description: '', body: text };
  const titleLine = match[1].match(/^title:\s*(.+)$/m)?.[1]?.trim() ?? 'Untitled';
  const descriptionLine = match[1].match(/^description:\s*(.+)$/m)?.[1]?.trim() ?? '';
  const unquote = (value) => {
    if (value.startsWith('"') && value.endsWith('"')) {
      try {
        return JSON.parse(value);
      } catch {
        return value.slice(1, -1);
      }
    }
    return value.replace(/^['"]|['"]$/g, '');
  };
  return {
    title: unquote(titleLine),
    description: unquote(descriptionLine),
    body: text.slice(match[0].length),
  };
}

function stripTags(value) {
  return value
    .replace(/<br\s*\/?>/gi, ' / ')
    .replace(/<kbd\b[^>]*>([\s\S]*?)<\/kbd>/gi, '`$1`')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .trim();
}

function convertHtmlTables(markdown) {
  return markdown.replace(/<table\b[^>]*>([\s\S]*?)<\/table>/gi, (_table, content) => {
    const rows = [...content.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map((row) =>
      [...row[1].matchAll(/<(?:td|th)\b[^>]*>([\s\S]*?)<\/(?:td|th)>/gi)].map((cell) =>
        stripTags(cell[1]).replace(/\|/g, '\\|').replace(/\s+/g, ' '),
      ),
    ).filter((row) => row.length > 0);
    if (rows.length === 0) return '';
    const width = Math.max(...rows.map((row) => row.length));
    const padded = rows.map((row) => [...row, ...Array(width - row.length).fill('')]);
    const lines = [
      `| ${padded[0].join(' | ')} |`,
      `| ${Array(width).fill('---').join(' | ')} |`,
      ...padded.slice(1).map((row) => `| ${row.join(' | ')} |`),
    ];
    return `\n${lines.join('\n')}\n`;
  });
}

function toPlainMarkdown(rawBody) {
  let body = rawBody
    .replace(/^import\s+.*?;\s*$/gm, '')
    .replace(/<Tabs\b[^>]*>/g, '')
    .replace(/<\/Tabs>/g, '')
    .replace(/<TabItem\s+label="([^"]+)"[^>]*>/g, '\n### $1\n\n')
    .replace(/<\/TabItem>/g, '\n')
    .replace(/<details\b[^>]*>\s*<summary\b[^>]*>([\s\S]*?)<\/summary>/gi, (_all, summary) => `\n### ${stripTags(summary)}\n\n`)
    .replace(/<\/details>/gi, '')
    .replace(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi, (_all, href, label) => `[${stripTags(label)}](${href})`)
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, '')
    .replace(/<pre\b[^>]*>/gi, '\n```text\n')
    .replace(/<\/pre>/gi, '\n```\n')
    .replace(/<br\s*\/?>/gi, ' / ')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<\/?P\s*>/g, '')
    .replace(/<table\b/i, '<table');

  body = convertHtmlTables(body);
  body = body.replace(/<[^>]*>/g, '');
  body = body
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return body;
}

function markdownFilePath(route) {
  if (route === '/docs/') return 'docs/index.md';
  return `${route.slice(1, -1)}.md`;
}

function pageSummary(body, fallback) {
  const plain = toPlainMarkdown(body);
  const candidates = plain
    .split(/\n\s*\n/)
    .map((paragraph) =>
      paragraph
        .replace(/^\s*[-*+]\s+/gm, '')
        .replace(/^\s*\|.*\|\s*$/gm, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/[`*_>#]/g, '')
        .replace(/\s+/g, ' ')
        .trim(),
    )
    .filter((paragraph) => paragraph.length >= 35 && !/^[-|]/.test(paragraph));
  const summary = candidates[0] ?? fallback;
  if (summary.length <= 180) return summary;
  return `${summary.slice(0, 177).replace(/\s+\S*$/, '')}…`;
}

const files = await collectMarkdown(docsRoot);
const byRoute = new Map();
const pages = [];

// Remove sidecars from previous builds so renamed or deleted pages do not linger.
await rm(join(publicRoot, 'docs'), { recursive: true, force: true });

for (const filePath of files) {
  const { title, description, body } = frontmatter(await readFile(filePath, 'utf8'));
  const route = pageRoute(filePath);
  const markdown = `# ${title}\n\n${toPlainMarkdown(body)}\n`;
  const publicPath = join(publicRoot, markdownFilePath(route));
  await mkdir(dirname(publicPath), { recursive: true });
  await writeFile(publicPath, markdown);
  const page = {
    title,
    description: pageSummary(body, description),
    route,
    markdownPath: `/${markdownFilePath(route)}`,
    markdown,
  };
  byRoute.set(route, page);
  pages.push(page);
}

const home = byRoute.get('/docs/');
// `34` is an extra legacy anchor used by an old cross-reference. Integer-like
// object keys enumerate before string keys, so keep it out of the source order.
const legacyOrderedRoutes = [
  ...new Set(
    Object.entries(legacyRoutes)
      .filter(([fragment]) => fragment !== '34')
      .map(([, route]) => route),
  ),
];
const orderedPages = [home, ...legacyOrderedRoutes.map((route) => byRoute.get(route))].filter(Boolean);

if (orderedPages.length !== files.length) {
  throw new Error(`Only mapped ${orderedPages.length} of ${files.length} documentation pages.`);
}

const links = orderedPages
  .map((page) => `- [${page.title}](${page.markdownPath})${page.description ? `: ${page.description}` : ''}`)
  .join('\n');
const llmsText = `# ${siteData.site.title}\n\n> ${siteData.site.description}\n\n## Documentation\n\n${links}\n\n## Project\n\n- [Para on GitHub](https://github.com/Erudika/para)\n- [Para Cloud](https://paraio.com)\n`;

const fullText = [
  `# ${siteData.site.title} documentation`,
  '',
  siteData.site.description,
  '',
  ...orderedPages.flatMap((page) => [
    `## ${page.title}`,
    '',
    `Source: ${page.markdownPath}`,
    '',
    page.markdown
      .replace(/^# .+\n+/, '')
      .replace(/^(#{2,5})\s/gm, (_heading, hashes) => `${'#'.repeat(Math.min(hashes.length + 1, 6))} `),
    '',
  ]),
].join('\n');

await mkdir(publicRoot, { recursive: true });
await writeFile(join(publicRoot, 'llms.txt'), llmsText);
await writeFile(join(publicRoot, 'llms-full.txt'), fullText);
console.log(`Generated llms.txt, llms-full.txt, and ${pages.length} Markdown sidecars.`);
