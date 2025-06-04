import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import tailwind from '@astrojs/tailwind'
import compress from 'astro-compress'
import icon from 'astro-icon'

export default defineConfig({
  compressHTML: true,
  integrations: [
    mdx(),
    icon({
      customCollections: {
        local: './src/icons', // allow usage of <Icon name="local:scales" />
      },
    }),
    tailwind({
      applyBaseStyles: false,
    }),
    compress(),
  ],
})
