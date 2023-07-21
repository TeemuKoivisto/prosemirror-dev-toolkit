import Sinon from 'cypress/types/sinon'
import snapshot1 from '../fixtures/snapshot-1.json'

import { join } from 'path'

const TEST_TEXT = 'asdf qwer'
const TEST_SNAPSHOT = 'test-snapshot-1'
const TEST_SNAPSHOT_CHANGED = 'changed'

const downloadsFolder = Cypress.config('downloadsFolder')
const getDownloaded = (file: string) => join(downloadsFolder, file)

describe('# Snapshots tab', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  const pages = ['', '/yjs']
  pages.forEach(page => {
    it('Should show snapshots and allow interacting with them, also with yjs', () => {
      cy.visit(page)
      cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
      cy.devTools()
        .find('.floating-dock')
        .find('*')
        .contains('Save snapshots by clicking "Save" button.')
        .should('exist')

      cy.pmInsParagraphBolded(TEST_TEXT)

      // The editor should have 4 elements
      cy.get('.ProseMirror').find('*').should('have.length', 4)
      // It should contain the inserted bold text
      cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)
      // There should exist no snapshots yet
      cy.devTools().find('.right-panel li').should('have.length', 0)

      cy.window().then($win => {
        // This stubs the window prompt which would halt execution otherwise
        cy.stub($win, 'prompt').returns(TEST_SNAPSHOT)
        cy.devTools().find('button').contains('Save').click()
      })
      // There should be now one snapshot
      cy.devTools().find('.right-panel li').should('have.length', 1)
      cy.devTools().find('.right-panel li').includesStringCount(TEST_SNAPSHOT).should('equal', 1)
      // This should open an input to edit the snapshot's name
      cy.devTools().find('.right-panel li').contains(TEST_SNAPSHOT).dblclick()
      cy.devTools()
        .find('.right-panel li')
        .find('input')
        .clear()
        .type(TEST_SNAPSHOT_CHANGED, { force: true }) // https://github.com/cypress-io/cypress/issues/5830#issuecomment-570638375
        .type('{enter}', { force: true })
      // The name should have changed
      cy.devTools().find('.right-panel li').contains(TEST_SNAPSHOT).should('not.exist')
      cy.devTools().find('.right-panel li').contains(TEST_SNAPSHOT_CHANGED).should('exist')

      cy.window().then(window => {
        const { editorView: view } = window
        const tr = view.state.tr
        tr.delete(0, view.state.doc.nodeSize - 2)
        view.dispatch(tr)
      })

      // The editor content was deleted
      cy.get('.ProseMirror').find('*').should('have.length', 2)
      cy.get('.ProseMirror strong').should('have.length', 0)
      cy.devTools().find('button').contains('Show').click()

      // Clicking 'Show' button should replace editor document with the snapshot data
      cy.get('.ProseMirror').find('*').should('have.length', 4)
      cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)

      cy.devTools().find('button').contains('Hide').click()
      cy.get('.ProseMirror strong').should('have.length', 0)

      // 'Restore' should replace the doc permanently with the snapshot doc
      cy.devTools().find('button').contains('Restore').click()
      cy.get('.ProseMirror strong').should('have.length', 1)

      // This exports the snapshot as json
      cy.devTools().find('button').contains('Export').click()
      cy.readFile(getDownloaded(`${TEST_SNAPSHOT_CHANGED}.json`)).should('deep.equal', snapshot1)

      // Upload the snapshot
      cy.devTools()
        .find('.floating-dock input[type="file"]')
        .selectFile('./cypress/fixtures/snapshot-1.json', { force: true })
      cy.devTools().find('.right-panel li').should('have.length', 2)

      // Reset the devTools to see that the snapshots were persisted and contain the old doc
      cy.resetDoc()
      cy.devTools().find('.floating-btn').click()
      cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
      cy.devTools().find('.right-panel li').should('have.length', 2)
      cy.devTools().find('.right-panel li').eq(0).contains('Show').click()
      cy.get('.ProseMirror').find('*').should('have.length', 4)
      cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)

      cy.devTools().find('button').contains('Delete').click()
      cy.devTools().find('.right-panel li').should('have.length', 2)
      cy.devTools().find('button').contains('confirm delete', { matchCase: false }).click()
      cy.devTools().find('.right-panel li').should('have.length', 1)
      cy.devTools()
        .find('.floating-dock')
        .find('*')
        .contains('Save snapshots by clicking "Save" button.')
        .should('not.exist')

      cy.devTools().find('button').contains('Delete').click()
      cy.devTools().find('button').contains('confirm delete', { matchCase: false }).click()
      cy.devTools().find('.right-panel li').should('have.length', 0)
      cy.devTools()
        .find('.floating-dock')
        .find('*')
        .contains('Save snapshots by clicking "Save" button.')
        .should('exist')

      cy.window().then(window => {
        const { editorView: view } = window
        const tr = view.state.tr
        tr.delete(0, view.state.doc.nodeSize - 2)
        view.dispatch(tr)
      })
    })
  })

  it('Should not crash when importing snapshots with malformed data or incompatible schema', () => {
    cy.window().then(window => {
      cy.spy(window.console, 'error').as('consoleError')
    })

    cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
    cy.devTools()
      .find('.floating-dock')
      .find('*')
      .contains('Save snapshots by clicking "Save" button.')
      .should('exist')

    cy.devTools()
      .find('.floating-dock input[type="file"]')
      .selectFile('./cypress/fixtures/snapshot-broken', { force: true })
    cy.devTools().find('.right-panel li').should('have.length', 0)

    cy.devTools()
      .find('.floating-dock input[type="file"]')
      .selectFile('./cypress/fixtures/snapshot-incompatible.json', { force: true })
      .wait(100)
    cy.devTools().find('.right-panel li').should('have.length', 0)

    cy.window().then(window => {
      const spy = window.console.error as Cypress.Agent<Sinon.SinonSpy>
      const firstError = spy.getCall(0).args[0]
      const secondError = spy.getCall(1).args[0]
      expect(firstError).to.be.eq(
        'Failed to import snapshot: SyntaxError: Unterminated string in JSON at position 1'
      )
      expect(secondError).to.be.eq(
        'Failed to import snapshot: RangeError: There is no mark type highlight in this schema'
      )
    })
  })

  it('Should copy doc to clipboard with Copy button', () => {
    cy.window().then(win => {
      cy.stub(win.console, 'warn').as('consoleWarn')
      cy.stub(win.console, 'error').as('consoleError')
      win.navigator.clipboard.writeText('')
    })

    cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
    cy.devTools()
      .find('.floating-dock')
      .find('*')
      .contains('Save snapshots by clicking "Save" button.')
      .should('exist')

    // Hax https://stackoverflow.com/questions/60174546/how-grant-cypress-test-application-some-permissions
    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
        command: 'Browser.grantPermissions',
        params: {
          permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
          origin: window.location.origin
        }
      })
    )

    // Clipboard should be empty
    cy.window()
      .then(win => win.navigator.clipboard.readText())
      .then(text => {
        expect(text).to.eq('')
      })

    cy.devTools().find('button').contains('Copy').click()

    // Clipboard should contain the copied doc
    cy.window()
      .then(win => win.navigator.clipboard.readText())
      .then(text => {
        expect(text).to.eq('{"type":"doc","content":[{"type":"paragraph"}]}')
      })

    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)
  })

  it('Should allow pasting snapshots with Paste snapshot button', () => {
    cy.window().then(win => {
      cy.stub(win.console, 'warn').as('consoleWarn')
      cy.stub(win.console, 'error').as('consoleError')
    })

    cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
    cy.devTools()
      .find('.floating-dock')
      .find('*')
      .contains('Save snapshots by clicking "Save" button.')
      .should('exist')

    // No snapshots
    cy.devTools().find('.right-panel li').should('have.length', 0)
    // Open modal
    cy.devTools().contains('Paste').click()

    // Try adding a broken snapshot
    cy.devTools().find('.paste-modal textarea').type('hello', { force: true })
    // Should not close the modal
    cy.devTools().find('.paste-modal .submit-container button').click()
    cy.devTools().find('.paste-modal').should('not.be.hidden')

    // Add actual snapshot
    cy.devTools()
      .find('.paste-modal textarea')
      .clear()
      .type(JSON.stringify(snapshot1), { parseSpecialCharSequences: false, force: true })

    // Should close the modal and add the snapshot
    cy.devTools().find('.paste-modal .submit-container button').click()
    cy.devTools().find('.paste-modal').should('be.hidden')
    cy.devTools().find('.right-panel li').should('have.length', 1)

    // Should open the modal again
    cy.devTools().find('button').contains('Paste').click()
    // Add the snapshot (should contain the old snapshot actually)
    cy.devTools()
      .find('.paste-modal textarea')
      .clear()
      .type(JSON.stringify(snapshot1), { parseSpecialCharSequences: false, force: true })
    cy.devTools().find('.paste-modal').should('not.be.hidden')

    // Close the modal by clicking outside the form
    cy.devTools().find('.paste-modal .modal-bg').click({ force: true })
    cy.devTools().find('.paste-modal').should('be.hidden')
    cy.devTools().find('.right-panel li').should('have.length', 1)

    // Open the modal and submit the old snapshot
    cy.devTools().find('button').contains('Paste').click()
    cy.devTools().find('.paste-modal .submit-container button').click()
    cy.devTools().find('.paste-modal').should('be.hidden')
    cy.devTools().find('.right-panel li').should('have.length', 2)

    cy.get('@consoleWarn').should('be.callCount', 0)
    cy.get('@consoleError').should('be.callCount', 0)
  })
})
