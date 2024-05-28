import { TextSelection } from 'prosemirror-state'

const TEST_TEXT = 'asdf qwer'

describe('# State tab', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should allow expanding and collapsing and tree-view nodes', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('STATE').should('have.length', 1)
    cy.devTools().find('.floating-dock h2').includesStringCount('Current doc').should('equal', 1)
    cy.devTools().find('.floating-dock h2').includesStringCount('Selection').should('equal', 1)

    // CURRENT DOC
    // Only "type": "doc" and "content" should be visible in left panel
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 2)
    cy.devTools().find('button.arrow-btn').first().click()
    cy.devTools().find('.svelte-tree-view').eq(0).find('li').should('have.length', 4)

    // SELECTION
    // In selection panel six items should be visible in the tree-view
    cy.devTools().find('.svelte-tree-view').eq(1).find('li').should('have.length', 6)
    cy.devTools()
      .find('li')
      .contains('anchor')
      .parent()
      .find('.node-value')
      .should('have.text', '1')
    cy.devTools().find('button.selection-btn').first().click()
    // Having opened the selection dropdown clicking $anchor should expand even more nodes
    cy.devTools().find('li').contains('$anchor').parent().find('button.arrow-btn').click()
    cy.devTools().find('.svelte-tree-view').eq(1).find('li').should('have.length', 19)

    // ACTIVE MARKS
    cy.devTools().find('div').contains('No active marks').should('have.length', 1)

    // DOCUMENT STATS
    cy.devTools()
      .find('li')
      .contains('nodeSize:')
      .parent()
      .find('.node-value')
      .should('have.text', '4')
    cy.devTools()
      .find('li')
      .contains('childCount:')
      .parent()
      .find('.node-value')
      .should('have.text', '1')

    // Insert paragraph with bolded text and set selection inside it
    cy.window()
      .then(window => {
        const { editorView: view } = window
        const tr = view.state.tr
        const schema = view.state.schema
        tr.insert(
          1,
          schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
        )
        tr.setSelection(new TextSelection(tr.doc.resolve(4)))
        view.dispatch(tr)
      })
      .wait(0)

    cy.devTools().find('.svelte-tree-view').eq(1).find('li').should('have.length', 19)
    cy.devTools().find('li').contains('"bold"').parent().find('.node-key').should('have.text', '0:')
    cy.devTools()
      .find('li')
      .contains('nodeSize:')
      .parent()
      .find('.node-value')
      .should('have.text', '15')
    cy.devTools()
      .find('li')
      .contains('childCount:')
      .parent()
      .find('.node-value')
      .should('have.text', '2')

    cy.devTools()
      .find('.floating-dock')
      .matchImage({
        screenshotConfig: {
          capture: 'viewport'
        },
        maxDiffThreshold: 0.001,
        diffConfig: {
          threshold: 0.01,
          alpha: 0.2
        }
      })
  })
})
