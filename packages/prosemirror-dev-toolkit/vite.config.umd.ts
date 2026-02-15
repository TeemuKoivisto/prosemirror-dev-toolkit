import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import { resolve } from 'path'

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve('src/index.ts'),
      formats: ['umd'],
      name: 'prosemirror-dev-toolkit',
      fileName: () => 'bundle.umd.min.js'
    },
    rollupOptions: {},
    minify: true
  },
  resolve: {
    alias: {
      $components: resolve('./src/components'),
      $context: resolve('./src/context'),
      $stores: resolve('./src/stores'),
      $tabs: resolve('./src/tabs'),
      '$test-utils': resolve('./src/test-utils'),
      $typings: resolve('./src/typings')
    }
  },
  plugins: [tsconfigPaths(), svelte({ extensions: ['.svelte'], emitCss: false })]
})
