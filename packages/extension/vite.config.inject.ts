import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

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
        inject: path.resolve('./src/inject/index.ts')
      }
    }
  }
})
