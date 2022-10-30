import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

export default defineConfig({
  plugins: [svelte({}), tsconfigPaths()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      },
      input: {
        inject: path.resolve('./src/inject.ts'),
        proxy: path.resolve('./src/proxy.ts'),
        'pop-up': path.resolve('./pop-up.html')
      }
    }
  }
})
