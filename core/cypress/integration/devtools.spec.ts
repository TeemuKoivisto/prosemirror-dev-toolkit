const TEST_TEXT = 'asdf qwer'

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

  it('Should unmount and remount correctly when applyDevTools is called multiple times', () => {
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)

    cy.window().then(async window => {
      const { applyDevTools, editorView: view } = window
      await applyDevTools(view)
      await applyDevTools(view)
    })

    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.get('.left-panel').find('li').should('have.length', 0)

    cy.window().then(async window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      view.dispatch(tr)
    })

    cy.get('.left-panel').find('li').should('have.length', 1)

    cy.window().then(async window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      view.dispatch(tr)
    })

    cy.get('.left-panel').find('li').should('have.length', 2)

    cy.window().then(async window => {
      const { applyDevTools, editorView: view } = window
      await applyDevTools(view)
    })

    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.get('.left-panel').find('li').should('have.length', 0)

    cy.window().then(async window => {
      const { editorView: view } = window
      const tr = view.state.tr
      const schema = view.state.schema
      tr.insert(
        1,
        schema.nodes.paragraph.create(null, schema.text(TEST_TEXT, [schema.marks.bold.create()]))
      )
      view.dispatch(tr)
    })

    cy.get('.left-panel').find('li').should('have.length', 1)
  })
})
