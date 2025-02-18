// @ts-check
import { defineConfig } from 'astro/config';
import { SITE } from './src/consts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: '/',
  trailingSlash: 'always',
  build: {
    assets: 'assets'
  },
  compressHTML: true,
  integrations: []
});
