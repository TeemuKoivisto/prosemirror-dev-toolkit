import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('svelte-preprocess/dist/types').AutoPreprocessOptions} */
const preprocessOptions = {
  scss: {
    prependData: `@import 'src/global.scss';`
  }
}

export default {
  preprocess: sveltePreprocess(preprocessOptions),
  preprocessOptions
}
