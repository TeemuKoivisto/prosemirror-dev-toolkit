import inject1 from '../fixtures/inject1.json'

describe('# DevTools', () => {
  it('Should render and allow to be closed / reopened', () => {
    cy.visit('/')
    cy.window().then(async window => {
      cy.stub(window.console, 'warn').as('consoleWarn')
      cy.stub(window.console, 'error').as('consoleError')
      window.msgs = []
      window.addEventListener('message', event => {
        console.log('msg', event)
        if (
          typeof event.data !== 'object' ||
          !('source' in event.data) ||
          event.data.source !== 'pm-dev-tools'
        ) {
          return
        }
        window.msgs.push(event.data)
      })
      const el = window.parent.document.querySelector('prosemirror-dev-toolkit') as HTMLElement
      expect(el).to.not.be.null
      el.shadowRoot.querySelector('button').click()
    })
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)
    cy.devTools().find('button[aria-label="Close dev-toolkit"]').click()
    cy.devTools().find('.floating-dock').should('have.length', 0)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 0)
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('.floating-dock').should('have.length', 1)
    cy.devTools().find('ul.tabs-menu li').should('have.length', 6)

    // cy.window().then(async window => {
    //   cy.writeFile('menu.json', JSON.stringify(window.msgs))
    // })

    // cy.fixture('inject.json').then((inject) => {
    //   cy.window().then(async window => {
    //     expect(window.msgs, 'the same data').to.deep.equal(inject)
    //   })
    // })

    cy.window().its('msgs').should('deep.equal', inject1)

    cy.window().then(async window => {
      window.msgs.forEach((msg, idx) => {
        expect(msg).to.deep.equal(inject1[idx])
      })
      expect(window.msgs).to.deep.equal(inject1)
    })
    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)

    // expect(msgs).to.deep.equal(inject1)
    // expect(true).to.be.false

    // cy.devTools()
    //   .find('.floating-dock')
    //   .matchImage({
    //     screenshotConfig: {
    //       capture: 'viewport'
    //     },
    //     maxDiffThreshold: 0,
    //     diffConfig: {
    //       threshold: 0.0001,
    //       alpha: 0.2
    //     }
    //   })
  })
})
