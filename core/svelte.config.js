const autoPreprocess = require('svelte-preprocess')

const preprocessOptions = {
  scss: { prependData: `@import 'src/global.scss';` },
  typescript: {
    tsconfigFile: './tsconfig.json'
  }
}

module.exports = {
  preprocess: autoPreprocess(preprocessOptions),
  preprocessOptions
}
