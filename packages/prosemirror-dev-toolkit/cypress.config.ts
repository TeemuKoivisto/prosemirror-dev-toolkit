import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/dist/plugin'
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3300',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      getCompareSnapshotsPlugin(on, config)
      initPlugin(on, config)
      // initPlugin(on, {
      //   ...config,
      //   env: {
      //     // pluginVisualRegressionUpdateImages: true,
      //     // pluginVisualRegressionForceDeviceScaleFactor
      //     pluginVisualRegressionMaxDiffThreshold: 0,
      //     pluginVisualRegressionDiffConfig: {
      //       threshold: 0.0001,
      //       alpha: 0.2,
      //     },
      //     // pluginVisualRegression: {
      //     //   maxDiffThreshold: 0,
      //     //   diffConfig: {
      //     //     threshold: 0.0001,
      //     //     alpha: 0.2
      //     //   }
      //     // }
      //   }
      // })
    }
  }
})
