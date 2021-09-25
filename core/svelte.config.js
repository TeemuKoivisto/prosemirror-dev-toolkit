import autoPreprocess from 'svelte-preprocess'
import { resolve } from 'path'

const preprocessOptions = {
  scss: { prependData: `@import 'src/global.scss';` },
  typescript: {
    tsconfigFile: './tsconfig.json'
  }
}

export default {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions,
  kit: {
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $stores: resolve('./src/stores'),
          $tabs: resolve('./src/tabs'),
          $typings: resolve('./src/typings')
        }
      }
    }
  }
}
