import { TextSelection } from 'prosemirror-state'

const TEST_TEXT = 'asdf qwer'

describe('# History tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should track transactions and show diffs', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.get('*').contains('Docs are equal.').should('have.length', 1)
    // Left panel with the entries should be empty
    cy.get('.left-panel').find('li').should('have.length', 0)

    cy.window().then(window => {
      const { editorView: view } = window
      // TODO this is because the first history entry is always set as selection so need two transactions
      // to show diff...
      view.dispatch(view.state.tr)
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

    // Should show now the dispatched transaction as history entry
    cy.get('.left-panel').find('li').should('have.length', 2)
    cy.get('h2').contains('Doc diff').should('have.length', 1)
    cy.get('span').contains('{"type":"paragr…r"}]}').should('have.length', 1)

    // SELECTION DIFF
    cy.get('h2').contains('Selection diff').should('have.length', 1)
    cy.get('li').contains('anchor:').parent().find('div.node-value').should('have.text', '1 => 4')

    // TRANSACTION
    cy.get('h2').contains('Transaction').should('have.length', 1)
    cy.get('button').contains('show').click()
    // Expanding the transaction tree-view should show a lot of nodes
    cy.get('.svelte-tree-view').eq(2).find('li').should('have.length', 15)
    cy.get('li').contains('docChanged:').parent().find('div.node-value').should('have.text', 'true')
    cy.get('li').contains('meta:').parent().find('button.arrow-btn').click()
    cy.get('li').contains('hello:').parent().find('button.arrow-btn').click()
    cy.get('li')
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
    cy.get('.left-panel').find('li').should('have.length', 3)
    cy.get('span.deleted').contains('[{"type":"bold"}]').should('have.length', 1)
    cy.get('.svelte-tree-view')
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

    cy.get('.svelte-tree-view')
      .eq(0)
      .find('li')
      .contains('2:')
      .parent()
      .find('div.node-value')
      .should('have.text', '{"type":"paragr…r"}]}')

    // Snapshot only the right panel since the left contains unmocked timestamps
    cy.get('.right-panel').scrollTo('top')
    cy.get('.right-panel').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001
      }
    })
  })

  it('Should group selection transactions and allow inspecting them', () => {
    // Must reload page since the old devTools can't be unmounted by closing it
    // NOR by running applyDevTools again - TODO perhaps..?
    cy.reload()
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.get('.left-panel').find('li').should('have.length', 0)

    cy.window().then(window => {
      const { editorView: view } = window
      view.dispatch(view.state.tr)
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

    cy.get('.left-panel').find('li').should('have.length', 2)

    // TODO dispatch selection transactions
  })
})
