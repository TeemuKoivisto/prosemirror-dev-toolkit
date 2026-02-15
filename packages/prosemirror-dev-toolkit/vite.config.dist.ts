/// <reference types="vitest" />

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
      formats: ['es', 'cjs'],
      fileName: format => {
        if (format === 'cjs') {
          return 'index.cjs'
        } else {
          return 'index.js'
        }
      }
    },
    rollupOptions: {},
    minify: false
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
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use 'src/global' as *;`
      }
    }
  },
  plugins: [dts(), tsconfigPaths(), svelte({ extensions: ['.svelte'], emitCss: false })],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    cache: false
  }
})
