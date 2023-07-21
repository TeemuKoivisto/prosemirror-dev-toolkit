import { defineConfig } from 'cypress'
import getCompareSnapshotsPlugin from 'cypress-image-diff-js/dist/plugin'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3300',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      getCompareSnapshotsPlugin(on, config)
    }
  }
})
