import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.name === 'chrome' && browser.isHeadless) {
          launchOptions.args.push('--hide-scrollbars')
          launchOptions.args.push('--high-dpi-support')
          launchOptions.args.push('--window-size=1280,800')
        }
        // launchOptions.args.push('--load-extension=./dist')
        launchOptions.extensions.push(
          '/Users/teemu/git_projects/omat/prosemirror-dev-toolkit/packages/extension/dist'
        )
        return launchOptions
      })
    }
  }
})
