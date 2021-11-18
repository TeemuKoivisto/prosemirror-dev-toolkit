import autoPreprocess from 'svelte-preprocess'

const preprocessOptions = {
  scss: { prependData: `@import 'src/global.scss';` }
}

export default {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions,
}
