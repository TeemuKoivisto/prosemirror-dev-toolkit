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
        sw: path.resolve('./src/sw/index.ts'),
        inject: path.resolve('./src/inject.ts'),
        index: path.resolve('index.html')
      }
    }
  }
})
