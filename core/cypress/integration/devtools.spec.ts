describe('# DevTools', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should render and allow to be closed / reopened', () => {
    cy.get('.__prosemirror-dev-toolkit__').should('have.length', 1)
    cy.devTools().should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.get('button[aria-label="Close dev-toolkit button"]').click()
    cy.devTools().find('.floating-dock').should('have.length', 0)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 0)
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('.floating-dock').should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.scrollTo('bottom')
    cy.get('.floating-dock').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001
      }
    })
  })
})
