// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import remarkAttributeList from 'remark-attribute-list';
import remarkKramdownToc from './src/lib/remark-kramdown-toc';

export default defineConfig({
  site: 'https://justmeat.co',
  trailingSlash: 'always',
  // Wiki URLs from the Jekyll site used colons ("talk:plants"); keep them working.
  redirects: {
    '/wiki/special:link-dump/': '/wiki/special-link-dump/',
    '/wiki/special:suggestions/': '/wiki/special-suggestions/',
    '/wiki/talk:plants/': '/wiki/talk-plants/',
  },
  markdown: {
    // The content was written for kramdown: attribute lists (`{:.text-center}`)
    // and `{:toc}` markers. Only the unified/remark pipeline supports these.
    processor: unified({ remarkPlugins: [remarkAttributeList, remarkKramdownToc] }),
  },
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});
