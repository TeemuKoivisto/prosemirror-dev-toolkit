import { defineConfig } from 'cypress'
import { initPlugin } from '@frsource/cypress-plugin-visual-regression-diff/plugins'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3300',
    setupNodeEvents(on, config) {
      initPlugin(on, config)
    }
  }
})
