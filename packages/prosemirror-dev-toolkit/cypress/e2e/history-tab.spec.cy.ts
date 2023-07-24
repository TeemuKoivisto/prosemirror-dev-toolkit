import { TextSelection } from 'prosemirror-state'

const TEST_TEXT = 'asdf qwer'

describe('# History tab', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('Should track transactions and show diffs', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.devTools().find('*').contains('Docs are equal.').should('exist')
    // Left panel with the entries should be empty
    cy.devTools().find('.left-panel').find('li').should('have.length', 0)

    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      tr.setSelection(new TextSelection(tr.doc.resolve(4)))
      tr.setMeta('hello', { recipient: 'world' })
      view.dispatch(tr)
    })

    // Should show now the dispatched transaction as a history entry
    cy.devTools().find('.left-panel').find('li').should('have.length', 1)
    cy.devTools().find('h2').contains('Doc diff').should('exist')
    cy.devTools().find('span').contains('{"type":"paragr…r"}]}').should('exist')

    // SELECTION DIFF
    cy.devTools().find('h2').contains('Selection diff').should('exist')
    cy.devTools()
      .find('li')
      .contains('anchor:')
      .parent()
      .find('div.node-value')
      .should('have.text', '1 => 4')

    // TRANSACTION
    cy.devTools().find('h2').contains('Transaction').should('exist')
    cy.devTools().find('button').contains('show').click()
    // Expanding the transaction tree-view should show a lot of nodes
    cy.devTools().find('.svelte-tree-view').eq(2).find('li').should('have.length', 15)
    cy.devTools()
      .find('li')
      .contains('docChanged:')
      .parent()
      .find('div.node-value')
      .should('have.text', 'true')
    cy.devTools().find('li').contains('meta:').parent().find('button.arrow-btn').click()
    cy.devTools().find('li').contains('hello:').parent().find('button.arrow-btn').click()
    cy.devTools()
      .find('li')
      .contains('recipient:')
      .parent()
      .find('div.node-value')
      .should('have.text', '"world"')

    // Replaces some of the old content to generate a diff with deletion, update and insertion
    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.replaceWith(1, 8, schema.nodes.paragraph.create(null, schema.text('qwer asdf')))
      view.dispatch(tr)
    })

    // There should be one more history entry
    cy.devTools().find('.left-panel').find('li').should('have.length', 2)
    // There should be no history entry groups
    cy.devTools().find('.left-panel').find('li').contains('[1]').should('not.exist')
    cy.devTools().find('span.deleted').contains('[{"type":"bold"}]').should('exist')
    cy.devTools()
      .find('.svelte-tree-view')
      .eq(0)
      .find('li')
      .contains('text:')
      .parent()
      .find('div.node-value')
      .invoke('text')
      .then(text => {
        // Replace non-breaking space (&nbsp;) with normal white-space
        expect(text.replace(/\u00a0/g, ' ')).equal('asdf qwerqwer asdf')
      })

    cy.devTools()
      .find('.svelte-tree-view')
      .eq(0)
      .find('li')
      .contains('2:')
      .parent()
      .find('div.node-value')
      .should('have.text', '{"type":"paragr…r"}]}')

    // Snapshot only the right panel since the left contains unmocked timestamps
    cy.devTools().find('.right-panel').scrollTo('top')
    cy.devTools()
      .find('.right-panel')
      .matchImage({
        maxDiffThreshold: 0,
        diffConfig: {
          threshold: 0.0001,
          alpha: 0.2
        }
      })
  })

  it('Should group selection transactions and allow inspecting them', () => {
    cy.wait(100)
    cy.resetDoc()
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.devTools().find('.left-panel').find('li').should('have.length', 0)

    // Dispatches one empty transaction on empty doc to see the first entry is correctly grouped
    // The next transaction changes the document and the third should create a selection diff
    cy.window().then(window => {
      const { editorView: view } = window
      view.dispatch(view.state.tr)
      let tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      tr.setSelection(new TextSelection(tr.doc.resolve(4)))
      view.dispatch(tr)
      tr = view.state.tr
      tr.setSelection(new TextSelection(tr.doc.resolve(4), tr.doc.resolve(10)))
      view.dispatch(tr)
    })

    cy.devTools().find('.left-panel').find('li').should('have.length', 3)
    // SHould be two groups with 1 entry each
    cy.devTools().find('.left-panel li').includesStringCount('[1]').should('equal', 2)

    // The group dropdown should not open when clicked
    cy.devTools().find('.left-panel').find('li').contains('[1]').click()
    cy.devTools().find('.left-panel').find('li').should('have.length', 3)

    // Clicking the second entry should show both a doc and selection diff
    cy.devTools().find('.left-panel').find('li').eq(1).click()
    cy.devTools().find('h2').contains('Doc diff', { matchCase: false }).should('exist')
    cy.devTools().find('h2').contains('Selection diff', { matchCase: false }).should('exist')

    // Change the selection again
    cy.window()
      .then(window => {
        const { editorView: view } = window
        const tr = view.state.tr
        tr.setSelection(new TextSelection(tr.doc.resolve(1), tr.doc.resolve(10)))
        view.dispatch(view.state.tr)
        // NOTE: it seems the includesStringCount command doesn't work as intended or that between dispatching
        // a transaction and Cypress test executing the test is run in parallel, thus you have to setTimeout(() => x, 0)
        // in order to let the ProseMirror flush the update.
      })
      .wait(0)

    // The selection should be grouped with the current group, thus items should stay same
    cy.devTools().find('.left-panel').find('li').should('have.length', 3)
    cy.devTools().find('.left-panel li').includesStringCount('[2]').should('equal', 1)
    cy.devTools().find('.left-panel li').includesStringCount('[1]').should('equal', 1)
    cy.devTools().find('.left-panel').find('li').contains('[2]').click()
    cy.devTools().find('h2').contains('Doc diff').should('not.exist')

    // The best way I could come up to check whether the dropdown shows it's opened
    cy.devTools().find('.left-panel li .expanded').should('have.length', 1)
    // Now 5 entries with the group opened
    cy.devTools().find('.left-panel').find('li').should('have.length', 5)
    cy.devTools().find('.left-panel').find('li').eq(2).click()
    // Should show a selection diff
    cy.devTools().find('h2').contains('Doc diff', { matchCase: false }).should('not.exist')
    cy.devTools().find('h2').contains('Selection diff', { matchCase: false }).should('exist')
    cy.devTools().find('h2').contains('Selection content', { matchCase: false }).should('exist')
    cy.devTools()
      .find('.right-panel')
      .matchImage({
        maxDiffThreshold: 0,
        diffConfig: {
          threshold: 0.0001,
          alpha: 0.2
        }
      })

    cy.window().then(window => {
      const { editorView: view } = window
      let tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      view.dispatch(tr)
      tr = view.state.tr
    })

    // The group should stay expanded
    cy.devTools().find('.left-panel').find('li').should('have.length', 6)
    cy.devTools().find('h2').contains('Doc diff', { matchCase: false }).should('exist')
    cy.devTools().find('h2').contains('Selection diff', { matchCase: false }).should('exist')
    cy.devTools().find('h2').contains('Selection content', { matchCase: false }).should('exist')
    cy.devTools()
      .find('.right-panel')
      .matchImage({
        maxDiffThreshold: 0,
        diffConfig: {
          threshold: 0.0001,
          alpha: 0.2
        }
      })
  })
})
