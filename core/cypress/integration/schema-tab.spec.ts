describe('# Schema tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the current schema nodes and marks', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('SCHEMA').click()
    cy.get('h2').contains('Nodes').should('have.length', 1)
    cy.get('h2').contains('Marks').should('have.length', 1)

    // There should be 9 nodes on the left panel
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 9)
    // There should be 4 marks on the right panel
    cy.get('.svelte-tree-view').eq(1).find('li').should('have.length', 4)

    cy.get('li').contains('doc:').parent().find('div.node-value').should('have.text', ' {} 11 keys')
    cy.get('li').contains('doc:').parent().find('button.arrow-btn').click()

    // Having opened the doc: node, there should be a lot more nodes visible
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 21)
    cy.get('li').contains('paragraph:').parent().find('button.arrow-btn').click()
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 33)
    // As we are preventing circular prevention the second 'schema: ' property should contain 'circular'
    // instead of a normal node
    cy.get('li').contains('circular').parent().find('div.node-key').should('have.text', 'schema:')

    // Click a node open in the right panel
    cy.get('li').contains('code:').parent().find('button.arrow-btn').click()
    cy.get('.svelte-tree-view').eq(1).find('li').should('have.length', 12)
    // The schema property here should not be effected by the left panel
    cy.get('.svelte-tree-view')
      .eq(1)
      .find('li')
      .contains('schema:')
      .parent()
      .find('div.node-value')
      .should('have.text', ' {} 7 keys')

    cy.get('.floating-dock').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001
      }
    })
  })
})
