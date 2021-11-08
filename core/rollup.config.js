import alias from '@rollup/plugin-alias'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import typescript from 'rollup-plugin-ts'
import svelte from 'rollup-plugin-svelte'
import autoPreprocess from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'
import babel from 'rollup-plugin-babel'
// import { terser } from 'rollup-plugin-terser'

import path from 'path'

import pkg from './package.json'
import svelteConfig from './svelte.config'

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
    // TODO: It seems svelte-tree-view must be bundled together with the dev-toolkit otherwise the React app
    // is unable to load it.
    ...Object.keys(pkg.dependencies || {}).filter(d => d !== 'svelte-tree-view'),
    ...Object.keys(pkg.peerDependencies || {}),
    // jsondiffpatch imports chalk, Node.js module, but which works in browser too yet
    // Rollup doesn't like it (and because it's an outdated version)
    'chalk'
  ],
  plugins: [
    alias({
      entries: [
        { find: '$components', replacement: path.resolve(__dirname, 'src/components') },
        { find: '$context', replacement: path.resolve(__dirname, 'src/context') },
        { find: '$stores', replacement: path.resolve(__dirname, 'src/stores') },
        { find: '$tabs', replacement: path.resolve(__dirname, 'src/tabs') },
        { find: '$typings', replacement: path.resolve(__dirname, 'src/typings') }
      ]
    }),
    svelte({
      compilerOptions: {
        // enable run-time checks when not in production
        dev: !isProduction
      },
      preprocess: autoPreprocess(svelteConfig.preprocessOptions)
    }),
    typescript(),
    resolve({
      browser: true,
      mainFields: ['svelte', 'module', 'browser', 'main'],
      dedupe: ['svelte']
    }),
    commonjs(),
    babel({
      extensions: ['.js', '.mjs', '.html', '.svelte'],
      runtimeHelpers: true,
      exclude: ['node_modules/@babel/**'],
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead'
          }
        ]
      ],
      plugins: [
        '@babel/plugin-syntax-dynamic-import',
        [
          '@babel/plugin-transform-runtime',
          {
            useESModules: true
          }
        ]
      ]
    }),
    postcss()
  ],
  watch: {
    clearScreen: false
  }
}
