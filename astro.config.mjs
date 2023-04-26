import { defineConfig } from 'astro/config';
import mdx from "@astrojs/mdx";
import deno from '@astrojs/deno';

// https://astro.build/config
export default defineConfig({
    output: 'server',
    adapter: deno(),
    server: {
        port: 5888,
    },
    integrations: [
        mdx()
    ],
});
