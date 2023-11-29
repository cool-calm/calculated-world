import { defineConfig, passthroughImageService } from 'astro/config';
import mdx from "@astrojs/mdx";
import deno from '@astrojs/deno';

import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: deno(),
  server: {
    port: 5888
  },
  integrations: [mdx(), tailwind()],
  image: {
    service: passthroughImageService()
  }
});