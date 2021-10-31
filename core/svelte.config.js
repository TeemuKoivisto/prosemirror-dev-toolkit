import autoPreprocess from 'svelte-preprocess'
import { resolve } from 'path'

const preprocessOptions = {
  scss: { prependData: `@import 'src/global.scss';` },
}

export default {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions,
  kit: {
    target: '#svelte',
    vite: {
      resolve: {
        alias: {
          $components: resolve('./src/components'),
          $context: resolve('./src/context'),
          $stores: resolve('./src/stores'),
          $tabs: resolve('./src/tabs'),
          $typings: resolve('./src/typings')
        }
      }
    }
  }
}
