// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

Cypress.Commands.add('devTools', () => {
  return cy.window().then(async window => {
    const el = window.parent.document.querySelector('prosemirror-dev-toolkit') as HTMLElement
    return el.shadowRoot
  })
})
