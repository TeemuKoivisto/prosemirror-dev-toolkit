import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

const { INPUT = '' } = process.env

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    minify: false,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      },
      input: {
        [INPUT]: path.resolve(`./src/${INPUT}/index.ts`)
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
