import autoPreprocess from 'svelte-preprocess'

const preprocessOptions = {}

export default {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions
}
