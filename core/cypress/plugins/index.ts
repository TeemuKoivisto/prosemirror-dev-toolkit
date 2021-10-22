/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

let shouldSkip = false

/**
 * @type {Cypress.PluginConfig}
 */
export default on => {
  on('task', {
    resetShouldSkipFlag() {
      shouldSkip = false
      return null
    },
    shouldSkip(value) {
      if (value != null) shouldSkip = value
      return shouldSkip
    }
  })
}
