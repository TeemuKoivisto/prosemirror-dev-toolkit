// ***********************************************************
// This example support/e2e.ts is processed and
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

import './commands'

// Hide scrollbars to avoid image snapshot diffs across environments
const HIDE_SCROLLBARS_CSS = `*::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; overflow: -moz-scrollbars-none !important; -ms-overflow-style: none !important; }`

beforeEach(() => {
  cy.document().then(doc => {
    const style = doc.createElement('style')
    style.textContent = HIDE_SCROLLBARS_CSS
    doc.head.appendChild(style)
  })
  // Also inject into the dev-toolkit shadow DOM
  cy.get('prosemirror-dev-toolkit', { timeout: 10000 }).then($el => {
    const shadowRoot = $el[0]?.shadowRoot
    if (shadowRoot) {
      const style = document.createElement('style')
      style.textContent = HIDE_SCROLLBARS_CSS
      shadowRoot.appendChild(style)
    }
  })
})
