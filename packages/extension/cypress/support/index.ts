// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************
import '@testing-library/cypress/add-commands'
import './commands'

declare global {
  interface Window {
    msgs: any[]
  }
  namespace Cypress {
    interface Chainable {
      devTools: () => Cypress.Chainable<ShadowRoot>
    }
  }
}

before(() => {
  cy.viewport(1280, 800)
})
