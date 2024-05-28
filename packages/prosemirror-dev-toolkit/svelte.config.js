import autoPreprocess from 'svelte-preprocess'

/** @type {import('svelte-preprocess/dist/types').AutoPreprocessOptions} */
const preprocessOptions = {
  scss: {
    prependData: `@import 'src/global.scss';`
  }
}

export default {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions
}
