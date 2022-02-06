import Sinon from 'cypress/types/sinon'
import snapshot0 from '../fixtures/snapshot-0.json'
import snapshot1 from '../fixtures/snapshot-1.json'

const TEST_TEXT = 'asdf qwer'

describe('# Structure tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show the DocView of the current and doc and Node info', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('STRUCTURE').click()
    cy.get('.floating-dock h2').includesStringCount('Current doc').should('equal', 1)
    cy.get('.floating-dock h2').includesStringCount('Node info').should('equal', 1)

    // 6 tree-view nodes should be visible in the 'Node info' panel
    cy.get('.svelte-tree-view').eq(0).find('li').should('have.length', 6)
    cy.get('li').contains('type:').parent().find('div.node-value').should('have.text', '"doc"')
    // There should be 2 nodes in the left panel's DocView
    cy.get('.left-panel').find('.doc-node').should('have.length', 2)
    // The doc node should show 4 as its size
    cy.get('button').contains('doc').parent().find('.number-box').eq(1).should('have.text', '4')
    cy.get('button').contains('paragraph').click()
    // Clicking paragraph node should have changed the right panel's Node info
    cy.get('li')
      .contains('type:')
      .parent()
      .find('div.node-value')
      .should('have.text', '"paragraph"')

    // Insert some content to see if the DocView changes
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      view.dispatch(tr)
    })

    cy.get('.left-panel').find('.doc-node').should('have.length', 4)
    cy.get('button').contains('doc').parent().find('.number-box').eq(1).should('have.text', '15')
    cy.get('button').contains('text - [bold]').should('have.length', 1)

    cy.get('.floating-dock').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.1
      }
    })
  })

  it('Should show the DocView of the current and doc and Node info', () => {
    cy.visit('/', {
      onBeforeLoad(win) {
        // Stub the window console functions. Stubbing returns a mocked value while spy leaves it as it is
        cy.spy(win.console, 'log').as('consoleLog')
        cy.stub(win.console, 'info').as('consoleInfo')
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.devTools().find('ul.tabs-menu li button').contains('STRUCTURE').click()

    // Click the LOG button in the node info
    cy.get('.right-panel button').contains('Log', { matchCase: false }).click()
    cy.get('@consoleInfo').should(
      'be.calledWith',
      '%c [prosemirror-dev-toolkit]: Property added to window._node'
    )
    cy.window().then(window => {
      const { _node } = window
      const spy = window.console.log as Cypress.Agent<Sinon.SinonSpy>
      const doc = spy.getCall(1).args[0].toJSON() || {}
      // The logged node should be an empty doc
      expect(JSON.stringify(doc)).to.be.eq(JSON.stringify(snapshot0))
      expect(JSON.stringify(_node.toJSON())).to.be.eq(JSON.stringify(snapshot0))
    })

    // Insert a paragraph with bolded text. NOTE: needs to wait(100) for some odd reason, it could be the UI
    // doesn't update fast enough which would be weird.
    cy.pmInsParagraphBolded(TEST_TEXT).wait(100)

    cy.get('.right-panel button').contains('Log', { matchCase: false }).click()
    cy.get('@consoleInfo').should(
      'be.calledWith',
      '%c [prosemirror-dev-toolkit]: Property added to window._node'
    )
    cy.window().then(window => {
      const { _node } = window
      const spy = window.console.log as Cypress.Agent<Sinon.SinonSpy>
      const doc = spy.getCall(2).args[0].toJSON() || {}
      // The logged node should now have been updated
      expect(JSON.stringify(doc)).to.be.eq(JSON.stringify(snapshot1))
      expect(JSON.stringify(_node.toJSON())).to.be.eq(JSON.stringify(snapshot1))
    })
    cy.get('@consoleError').should('be.callCount', 0)
  })
})
