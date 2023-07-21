// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
import '@frsource/cypress-plugin-visual-regression-diff'

Cypress.Commands.add('interrupt', () => {
  eval("window.top.document.body.querySelector('header button.stop').click()")
})

Cypress.Commands.add('devTools', () => {
  return cy.get('prosemirror-dev-toolkit').shadow()
})

// Reset devTools with applyDevTools and dispatch a complete deletion of the document.
Cypress.Commands.add('resetDoc', () => {
  return cy.window().then(async window => {
    const { applyDevTools, editorView: view } = window
    const tr = view.state.tr
    view.dispatch(tr.delete(1, view.state.doc.nodeSize - 2))
    applyDevTools(view)
  })
})

// This is a bit awkward but didn't find a better way
Cypress.Commands.add('includesStringCount', { prevSubject: true }, (subject: any, str: string) => {
  let count = 0
  return cy
    .wrap(subject)
    .each($element => {
      if ($element.text().includes(str)) count += 1
    })
    .then(() => {
      return count
    })
})

Cypress.Commands.add('pmInsParagraphBolded', (text: string) => {
  return cy.window().then(window => {
    const { editorView: view } = window
    const tr = view.state.tr
    const schema = view.state.schema
    tr.insert(
      1,
      schema.nodes.paragraph.create(null, schema.text(text, [schema.marks.bold.create()]))
    )
    view.dispatch(tr)
  })
})
