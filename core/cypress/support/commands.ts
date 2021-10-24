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
  return cy.get('.__prosemirror-dev-toolkit__')
})

// Reset devTools with applyDevTools and dispatch a complete deletion of the document.
Cypress.Commands.add('resetDoc', () => {
  return cy.window().then(async (window) => {
    const { applyDevTools, editorView: view } = window
    const tr = view.state.tr
    view.dispatch(tr.delete(1, view.state.doc.nodeSize - 2))
    await applyDevTools(view)
  })
})

// This is a bit awkward but didn't find a better way
Cypress.Commands.add('includesStringCount', { prevSubject: true }, (subject: any, str: string) => {
  let count = 0
  return cy.wrap(subject).each(($element) => {
    if ($element.text().includes(str)) count += 1
  }).then(() => {
    return count
  })
})
