import { defineConfig } from 'vitest/config'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import dts from 'vite-plugin-dts'
import tsconfigPaths from 'vite-tsconfig-paths'

import { resolve } from 'path'

const UMD_BUNDLE = process.env.UMD_BUNDLE === 'true'

export default defineConfig({
  build: {
    outDir: 'dist',
    ...(UMD_BUNDLE
      ? {
          lib: {
            entry: resolve('src/index.ts'),
            formats: ['umd'],
            name: 'prosemirror-dev-toolkit',
            fileName: () => 'bundle.umd.min.js'
          },
          minify: true
        }
      : {
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
          minify: false
        })
  },
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
  plugins: [
    dts(),
    svelte({
      extensions: ['.svelte'],
      emitCss: false,
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
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['src/test-utils/setupTests.js'],
    cache: false
  }
})
