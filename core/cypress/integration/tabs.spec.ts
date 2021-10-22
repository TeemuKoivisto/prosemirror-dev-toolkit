import { TextSelection } from "prosemirror-state"

const TEST_TEXT = 'asdf qwer'

describe('# Tabs', () => {
  before(() => {
    cy.visit('/')
  })

  xit('Should render dev-toolkit and allow closing and reopening it', () => {
    cy.get('.__prosemirror-dev-toolkit__').should('have.length', 1)
    cy.devTools().should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.get('button[aria-label="Close dev-toolkit button"]').click()
    cy.devTools().find('.floating-dock').should('have.length', 0)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 0)
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('.floating-dock').should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
  })

  it('STATE tab should allow expanding and collapsing and tree-view nodes', () => {

    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.devTools().find('ul.tabs-menu li button').contains('STATE').should('have.length', 1)
    cy.devTools().find('h2').contains('Current doc').should('have.length', 1)
    cy.devTools().find('h2').contains('Selection').should('have.length', 1)

    // CURRENT DOC
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 2)
    cy.get('button.arrow-btn').first().click()
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 4)
    cy.get('.svelte-tree-view').eq(1).find('li').should('have.length', 6)

    // SELECTION
    cy.get('li').contains('anchor').parent().find('div.node-value').should('have.text', '1')
    cy.get('button.selection-btn').first().click()
    cy.get('li').contains('$anchor').parent().find('button.arrow-btn').click()
    cy.get('.svelte-tree-view').eq(1).find('li').should('have.length', 19)

    // ACTIVE MARKS
    cy.get('div').contains('No active marks').should('have.length', 1)
    
    // DOCUMENT STATS
    cy.get('li').contains('nodeSize:').parent().find('div.node-value').should('have.text', '4')
    cy.get('li').contains('childCount:').parent().find('div.node-value').should('have.text', '1')

    // Insert paragraph with bolded text and set selection inside it
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(1, schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()])))
      tr.setSelection(new TextSelection(tr.doc.resolve(4)))
      view.dispatch(tr)
    })

    cy.get('li').contains('"bold"').parent().find('div.node-key').should('have.text', '0:')
    cy.get('li').contains('nodeSize:').parent().find('div.node-value').should('have.text', '10')
    cy.get('li').contains('childCount:').parent().find('div.node-value').should('have.text', '2')
  })
})
