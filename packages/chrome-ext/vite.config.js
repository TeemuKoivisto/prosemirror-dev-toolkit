import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

import path from 'path'

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        chunkFileNames: '[name].js',
        entryFileNames: '[name].js'
      },
      input: {
        background: path.resolve('./src/background.ts'),
        inject: path.resolve('./src/inject.ts'),
        index: path.resolve('index.html')
      }
    }
  }
})
