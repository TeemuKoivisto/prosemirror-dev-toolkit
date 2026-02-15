/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

import { resolve } from 'path'

// For tests only
export default defineConfig({
  plugins: [
    svelte({
      dynamicCompileOptions: () => {
        return {
          cssHash: ({ hash, css, name, filename }) => {
            return `s-${name}-${hash(css)}`
          }
        }
      }
    }),
    tsconfigPaths()
  ],
  resolve: {
    conditions: ['browser'],
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
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['src/test-utils/setupTests.js'],
    cache: false
  }
})
