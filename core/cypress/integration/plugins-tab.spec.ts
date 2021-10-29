const TEST_TEXT = 'asdf qwer'

describe('# Plugins tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the default plugins and allow inspecting them', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('PLUGINS').click()
    cy.get('.floating-dock').includesStringCount('Plugin has no state').should('equal', 1)
    // There should be 9 plugins in total
    cy.get('.left-panel').find('li').should('have.length', 9)

    cy.get('li button').contains('HISTORY$').click()
    cy.get('h2').contains('Plugin state').should('exist')

    // The history plugin's tree-view should show only four nodes
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 4)
    // Clicking expand should auto-expand all nodes
    cy.get('button').contains('expand').click()
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 9)

    // Dispatch a transaction to see that the history plugin state changes
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(1, schema.nodes.paragraph.create(null, schema.text(TEST_TEXT)))
      view.dispatch(tr)
    })

    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 53)
    cy.get('button').contains('collapse').click()
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 4)

    // Must change the shown plugin since history plugin contains non-mocked timestamps
    cy.get('li button').contains('EXAMPLE-PLUGIN$').click()
    cy.get('.floating-dock').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.01
      }
    })
  })
})
