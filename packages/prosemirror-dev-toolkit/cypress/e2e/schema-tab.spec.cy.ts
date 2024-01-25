describe('# Schema tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the current schema nodes and marks', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('SCHEMA').click()
    cy.devTools().find('.floating-dock').includesStringCount('Nodes').should('equal', 1)
    cy.devTools().find('.floating-dock').includesStringCount('Marks').should('equal', 1)

    // There should be 9 nodes on the left panel
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 9)
    // There should be 4 marks on the right panel
    cy.devTools().find('.svelte-tree-view').eq(1).find('li').should('have.length', 4)

    cy.devTools()
      .find('li')
      .contains('doc:')
      .parent()
      .find('div.node-value')
      .should('have.text', ' {} 11 keys')
    cy.devTools().find('li').contains('doc:').parent().find('button.arrow-btn').click()

    // Having opened the doc: node, there should be a lot more nodes visible
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 21)
    cy.devTools().find('li').contains('paragraph:').parent().find('button.arrow-btn').click()
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 33)
    // As we are preventing circular prevention the second 'schema: ' property should contain 'circular'
    // instead of a normal node
    cy.devTools()
      .find('li')
      .contains('circular')
      .parent()
      .find('div.node-key')
      .should('have.text', 'schema:')

    // Click a node open in the right panel
    cy.devTools().find('li').contains('code:').parent().find('button.arrow-btn').click()
    cy.devTools().find('.svelte-tree-view').eq(1).find('li').should('have.length', 12)
    // The schema property here should not be effected by the left panel
    cy.devTools()
      .find('.svelte-tree-view')
      .eq(1)
      .find('li')
      .contains('schema:')
      .parent()
      .find('div.node-value')
      .should('have.text', ' {} 7 keys')

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
