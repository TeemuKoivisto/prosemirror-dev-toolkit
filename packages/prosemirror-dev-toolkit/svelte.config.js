import { sveltePreprocess } from 'svelte-preprocess'

/** @type {import('svelte-preprocess/dist/types').AutoPreprocessOptions} */
const preprocessOptions = {
  scss: {
    prependData: `@use 'src/global.scss' as *;`
  }
}

export default {
  preprocess: sveltePreprocess(preprocessOptions),
  preprocessOptions
}
