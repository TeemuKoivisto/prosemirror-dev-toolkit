import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-ts'
import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'

import path from 'path'

import pkg from './package.json'
const preprocessOptions = require('./svelte.config').preprocessOptions

const isProduction = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'prosemirror-dev-toolkit',
      sourcemap: isProduction
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: isProduction
    }
  ],
  external: [
    // ...Object.keys(pkg.dependencies || {}),
    // ...Object.keys(pkg.devDependencies || {}),
    ...Object.keys(pkg.peerDependencies || {})
  ],
  plugins: [
    alias({
      entries: [
        { find: '$stores', replacement: path.resolve(__dirname, 'src/stores') },
        { find: '$tabs', replacement: path.resolve(__dirname, 'src/tabs') },
        { find: '$typings', replacement: path.resolve(__dirname, 'src/typings') }
      ]
    }),
    commonjs(),
    typescript(),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !isProduction
      },
      preprocess: autoPreprocess(preprocessOptions)
    }),
    postcss(),
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    isProduction && terser()
  ],
  watch: {
    clearScreen: false
  }
}
