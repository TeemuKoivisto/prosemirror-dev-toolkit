const autoPreprocess = require('svelte-preprocess')

const preprocessOptions = {
  scss: { prependData: `@import 'src/global.scss';` }
}

module.exports = {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions
}
