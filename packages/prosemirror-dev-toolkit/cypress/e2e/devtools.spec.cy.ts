const TEST_TEXT = 'asdf qwer'

describe('# DevTools', () => {
  it('Should render and allow to be closed / reopened', () => {
    cy.visit('/')
    cy.get('.__prosemirror-dev-toolkit__').should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.devTools().find('button[aria-label="Close dev-toolkit"]').click()
    cy.devTools().find('.floating-dock').should('have.length', 0)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 0)
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('.floating-dock').should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.scrollTo('bottom')
    // cy.devTools().compareSnapshot('.floating-dock', 0.1)
    // cy.devTools().find('.floating-dock').matchImage()
    cy.devTools()
      .find('.floating-dock')
      .matchImage({
        maxDiffThreshold: 0,
        diffConfig: {
          threshold: 0.0001,
          alpha: 0.2
        }
      })
  })

  // First test the front page where the dispatchTransaction prop is provided incase subscribeToTransactions
  // fails to unsubscribe properly. Then test it without dispatchTransaction in /plain page for the same issues.
  const pages = ['', '/plain']
  pages.forEach(page => {
    it('Should unmount and remount correctly when applyDevTools is called multiple times', () => {
      cy.visit(page)
      cy.devTools().find('ul.tabs-menu li').should('have.length', 6)

      cy.window().then(async window => {
        const { applyDevTools, editorView: view } = window
        applyDevTools(view)
        applyDevTools(view)
      })

      cy.devTools().find('.floating-btn').click()
      cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
      cy.devTools().find('.left-panel').find('li').should('have.length', 0)

      cy.pmInsParagraphBolded(TEST_TEXT)
      cy.devTools().find('.left-panel').find('li').should('have.length', 1)

      cy.pmInsParagraphBolded(TEST_TEXT)
      cy.devTools().find('.left-panel').find('li').should('have.length', 2)

      cy.window().then(async window => {
        const { applyDevTools, editorView: view } = window
        applyDevTools(view)
      })

      cy.devTools().find('.floating-btn').click()
      cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
      cy.devTools().find('.left-panel').find('li').should('have.length', 0)

      cy.pmInsParagraphBolded(TEST_TEXT)
      cy.devTools().find('.left-panel').find('li').should('have.length', 1)
    })
  })

  it('Should unmount without errors or warning when navigating pages', () => {
    cy.visit('/')
    cy.devTools().find('.floating-dock ul.tabs-menu li').should('have.length', 6)

    cy.visit('/plain', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn')
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.devTools().find('.floating-dock ul.tabs-menu li').should('have.length', 6)
    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)

    cy.visit('/', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn')
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.devTools().find('.floating-dock ul.tabs-menu li').should('have.length', 6)
    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)

    cy.visit('/no-editor', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn')
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.get('.__prosemirror-dev-toolkit__').should('have.length', 0)
    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)

    cy.visit('/')
    cy.visit('/plain', {
      onBeforeLoad(win) {
        cy.stub(win.console, 'warn').as('consoleWarn')
        cy.stub(win.console, 'error').as('consoleError')
      }
    })
    cy.devTools().find('.floating-dock ul.tabs-menu li').should('have.length', 6)
    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)

    // Test that transactions trigger properly and history entries are updated
    cy.devTools().find('ul.tabs-menu li button').contains('HISTORY').click()
    cy.devTools().find('.left-panel').find('li').should('have.length', 0)

    cy.pmInsParagraphBolded(TEST_TEXT)
    cy.devTools().find('.left-panel').find('li').should('have.length', 1)
  })
})
