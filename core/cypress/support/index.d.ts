// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable {
    devTools: () => Cypress.Chainable<JQuery<HTMLElement>>
    resetDoc: () => Cypress.Chainable<JQuery<HTMLElement>>
    includesStringCount: (str: string) => Promise<number>
  }
}
