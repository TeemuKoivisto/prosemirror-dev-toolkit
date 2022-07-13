import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
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
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-utils/setupTests.js']
  }
})