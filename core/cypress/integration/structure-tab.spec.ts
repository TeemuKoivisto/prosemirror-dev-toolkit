const TEST_TEXT = 'asdf qwer'

describe('# Structure tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the DocView of the current and doc and Node info', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('STRUCTURE').click()
    cy.get('h2').contains('Current doc').should('have.length', 1)
    cy.get('h2').contains('Node info').should('have.length', 1)

    // Only 2 nodes should be visible in the 'Node info' panel
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 2)
    cy.get('li').contains('type:').parent().find('div.node-value').should('have.text', '"doc"')
    // There should be 2 nodes in the left panel's DocView
    cy.get('.left-panel').find('.doc-node').should('have.length', 2)
    // The doc node should show 4 as its size
    cy.get('button').contains('doc').parent().find('.number-box').eq(1).should('have.text', '4')
    cy.get('button').contains('paragraph').click()
    // Clicking paragraph node should have changed the right panel's Node info
    cy.get('li').contains('type:').parent().find('div.node-value').should('have.text', '"paragraph"')

    // Insert some content to see if the DocView changes
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(1, schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()])))
      view.dispatch(tr)
    })

    cy.get('.left-panel').find('.doc-node').should('have.length', 4)
    cy.get('button').contains('doc').parent().find('.number-box').eq(1).should('have.text', '15')
    cy.get('button').contains('text - [bold]').should('have.length', 1)

    cy.get('.floating-dock').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001,
      },
    })
  })
})
