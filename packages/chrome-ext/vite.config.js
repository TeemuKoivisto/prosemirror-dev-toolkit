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
        content: path.resolve('./src/content.ts'),
        index: path.resolve('index.html')
      }
    }
  }
})
