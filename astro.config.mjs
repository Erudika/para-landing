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
        src: './src/images/logo.svg',
        replacesTitle: true,
      },
      components: {
        SiteTitle: './src/components/starlight/SiteTitle.astro',
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
          label: 'Configuration',
          items: [{ autogenerate: { directory: 'docs/configuration' } }],
        },
        {
          label: 'Plugins',
          items: [{ autogenerate: { directory: 'docs/plugins' } }],
        },
        {
          label: 'Persistence',
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
          label: 'Authentication & Security',
          items: [{ autogenerate: { directory: 'docs/security' } }],
        },
        {
          label: 'Integrations',
          items: [{ autogenerate: { directory: 'docs/integrations' } }],
        },
        {
          label: 'Utilities & Operations',
          items: [
            { autogenerate: { directory: 'docs/utilities' } },
            { autogenerate: { directory: 'docs/operations' } },
          ],
        },
        {
          label: 'REST API',
          items: [
            { slug: 'docs/api' },
          ],
        },
      ],
      components: {
        SiteTitle: './src/components/starlight/SiteTitle.astro',
      }
    }),
    mdx(),
  ],
  vite: {
    plugins: [tailwind()],
  },
});
