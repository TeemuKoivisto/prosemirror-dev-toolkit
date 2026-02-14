import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { resolve } from 'path'

import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  build: {
    outDir: 'dist',
    lib: {
      entry: resolve('src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: [
        'react',
        'react/jsx-runtime',
        'react-dom',
        ...Object.keys(pkg.devDependencies || {}),
        ...Object.keys(pkg.dependencies || {})
      ],
      output: {
        globals: {
          react: 'react',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'react/jsx-runtime'
        }
      }
    },
    minify: false
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  },
  define: {
    process: {}
  },
  plugins: [
    react({
      jsxRuntime: 'classic'
    })
  ]
})
