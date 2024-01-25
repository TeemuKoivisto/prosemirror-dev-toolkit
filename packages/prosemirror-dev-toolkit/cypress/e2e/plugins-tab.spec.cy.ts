const TEST_TEXT = 'asdf qwer'

describe('# Plugins tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the default plugins and allow inspecting them', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('PLUGINS').click()
    cy.devTools()
      .find('.floating-dock')
      .includesStringCount('Plugin has no state')
      .should('equal', 1)
    // There should be 9 plugins in total
    cy.devTools().find('.left-panel').find('li').should('have.length', 9)

    cy.devTools().find('li button').contains('HISTORY$').click()
    cy.devTools().find('h2').contains('Plugin state').should('exist')

    // The history plugin's tree-view should show only four nodes
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 4)
    // Clicking expand should auto-expand all nodes
    cy.devTools().find('button').contains('expand').click()
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 9)

    // Dispatch a transaction to see that the history plugin state changes
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(1, schema.nodes.paragraph.create(null, schema.text(TEST_TEXT)))
      view.dispatch(tr)
    })

    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 53)
    cy.devTools().find('button').contains('collapse').click()
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 4)

    // Must change the shown plugin since history plugin contains non-mocked timestamps
    cy.devTools().find('li button').contains('EXAMPLE-PLUGIN$').click()
    cy.devTools()
      .find('.floating-dock')
      .matchImage({
        screenshotConfig: {
          capture: 'viewport'
        },
        maxDiffThreshold: 1,
        diffConfig: {
          threshold: 0.1,
          alpha: 0.2
        }
      })
  })
})
