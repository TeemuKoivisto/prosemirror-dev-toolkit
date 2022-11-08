import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

/** @type {import('vite').UserConfig} */
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
      },
      plugins: [
        {
          name: 'wrap-in-iife',
          generateBundle(outputOptions, bundle) {
            Object.keys(bundle).forEach(fileName => {
              const file = bundle[fileName]
              if (fileName.slice(-3) === '.js' && 'code' in file) {
                file.code = `(() => {\n${file.code}})()`
              }
            })
          }
        }
      ]
    }
  }
})
