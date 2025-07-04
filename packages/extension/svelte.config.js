import { sveltePreprocess } from 'svelte-preprocess'

const preprocessOptions = {}

export default {
  preprocess: sveltePreprocess(preprocessOptions),
  preprocessOptions
}
