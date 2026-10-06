// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/**
 * The public URL, baked into canonicals, Open Graph tags and the sitemap.
 *  1. SITE_URL, if set (set it in Vercel once the real domain is connected)
 *  2. Vercel's production domain for this project (set automatically on Vercel)
 *  3. The default Vercel domain, for local builds
 */
const vercelHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const site = process.env.SITE_URL || (vercelHost ? `https://${vercelHost}` : 'https://mcleods.vercel.app');

export default defineConfig({
  site,
  trailingSlash: 'always',
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  build: { inlineStylesheets: 'auto', format: 'directory' },
  image: { responsiveStyles: true },
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  compressHTML: true,
});
