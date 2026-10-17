import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import starlight from '@astrojs/starlight';
import tailwind from '@tailwindcss/vite';
import { site, nav } from './src/data/site-data.json';
import rehypeTableRowIds from './src/plugins/rehype-table-row-ids.mjs';

export default defineConfig({
  site: site.url,
  output: 'static',
  trailingSlash: 'always', // REQUIRED — all internal links must end with /
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeTableRowIds],
    }),
  },
  integrations: [
    sitemap(), // Register BEFORE starlight
    starlight({
      title: nav.docsTitle,
      logo: {
        light: './src/images/logo.svg',
        dark: './src/images/footer-logo.svg',
        replacesTitle: true,
      },
      disable404Route: true,
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        styleOverrides: {
          borderRadius: '0.2rem'
        },
        themes: ['dark-plus', 'min-light'],
      },
      social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/Erudika/para' }],
      sidebar: [
        { label: nav.backToSite, link: '/' },
        { label: nav.docsHome, link: '/docs/' },
        {
          label: 'Getting started',
          items: [{ autogenerate: { directory: 'docs/getting-started' } }],
        },
        {
          label: 'Core concepts',
          items: [{ autogenerate: { directory: 'docs/concepts' } }],
        },
        {
          label: 'Configuration and plugins',
          items: [{ autogenerate: { directory: 'docs/configuration' } }],
        },
        {
          label: 'Persistence and data stores',
          items: [{ autogenerate: { directory: 'docs/data-stores' } }],
        },
        {
          label: 'Search',
          items: [{ autogenerate: { directory: 'docs/search' } }],
        },
        {
          label: 'Cache',
          items: [{ autogenerate: { directory: 'docs/cache' } }],
        },
        {
          label: 'Authentication and security',
          items: [{ autogenerate: { directory: 'docs/security' } }],
        },
        {
          label: 'Integrations',
          items: [{ autogenerate: { directory: 'docs/integrations' } }],
        },
        {
          label: 'Utilities and operations',
          items: [
            { autogenerate: { directory: 'docs/utilities' } },
            { autogenerate: { directory: 'docs/operations' } },
          ],
        },
        {
          label: 'REST API',
          items: [
            { slug: 'docs/api' },
            { label: 'Authentication', items: [{ autogenerate: { directory: 'docs/api/authentication' } }] },
            { label: 'Apps', items: [{ autogenerate: { directory: 'docs/api/apps' } }] },
            { label: 'Objects', items: [{ autogenerate: { directory: 'docs/api/objects' } }] },
            { label: 'Batch', items: [{ autogenerate: { directory: 'docs/api/batch' } }] },
            { label: 'Search', items: [{ autogenerate: { directory: 'docs/api/search' } }] },
            { label: 'Links', items: [{ autogenerate: { directory: 'docs/api/links' } }] },
            { label: 'Constraints', items: [{ autogenerate: { directory: 'docs/api/constraints' } }] },
            { label: 'Permissions', items: [{ autogenerate: { directory: 'docs/api/permissions' } }] },
            { label: 'Settings', items: [{ autogenerate: { directory: 'docs/api/settings' } }] },
            { label: 'Data operations', items: [{ autogenerate: { directory: 'docs/api/data' } }] },
            { label: 'System', items: [{ autogenerate: { directory: 'docs/api/system' } }] },
            { label: 'Integrations', items: [{ autogenerate: { directory: 'docs/api/integrations' } }] },
          ],
        },
      ],
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
