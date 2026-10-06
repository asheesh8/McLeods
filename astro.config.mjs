// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// TODO(mcleods): confirm the production domain before launch. It is baked
// into canonicals, Open Graph URLs and the sitemap.
export default defineConfig({
  site: 'https://www.mcleodsspring.com',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto', format: 'directory' },
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  compressHTML: true,
});
