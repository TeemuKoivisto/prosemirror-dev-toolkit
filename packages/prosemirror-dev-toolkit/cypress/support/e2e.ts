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
Cypress.on('window:before:load', win => {
  const style = win.document.createElement('style')
  style.textContent = `*::-webkit-scrollbar { display: none !important; } * { scrollbar-width: none !important; }`
  win.document.head.appendChild(style)
})
