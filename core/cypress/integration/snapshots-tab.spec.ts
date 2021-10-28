import snapshot1 from '../fixtures/snapshot-1.json'

import { join } from 'path'

const TEST_TEXT = 'asdf qwer'
const TEST_SNAPSHOT = 'test-snapshot-1'
const TEST_SNAPSHOT_CHANGED = 'changed'

const downloadsFolder = Cypress.config('downloadsFolder')
const getDownloaded = (file: string) => join(downloadsFolder, file)

describe('# Snapshots tab', () => {
  before(() => {
    cy.visit('/')
  })

  it('Should show snapshots and allow interacting with them', () => {
    cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
    cy.get('*')
      .contains('Save snapshots by clicking "Save snapshot" button.')
      .should('exist')

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

    // The editor should have 4 elements
    cy.get('.ProseMirror').find('*').should('have.length', 4)
    // It should contain the inserted bold text
    cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)
    // There should exist no snapshots yet
    cy.get('.right-panel li').should('have.length', 0)

    cy.window().then($win => {
      // This stubs the window prompt which would halt execution otherwise
      cy.stub($win, 'prompt').returns(TEST_SNAPSHOT)
      cy.get('button').contains('Save snapshot').click()
    })
    // There should be now one snapshot
    cy.get('.right-panel li').should('have.length', 1)
    cy.get('.right-panel li').includesStringCount(TEST_SNAPSHOT).should('equal', 1)
    // This should open an input to edit the snapshot's name
    cy.get('.right-panel li').contains(TEST_SNAPSHOT).dblclick()
    cy.get('.right-panel li').find('input').clear().type(TEST_SNAPSHOT_CHANGED).type('{enter}')
    // The name should have changed
    cy.get('.right-panel li').contains(TEST_SNAPSHOT).should('not.exist')
    cy.get('.right-panel li').contains(TEST_SNAPSHOT_CHANGED).should('exist')

    cy.window().then(window => {
      const { editorView: view } = window
      const tr = view.state.tr
      tr.delete(0, view.state.doc.nodeSize - 2)
      view.dispatch(tr)
    })

    // The editor content was deleted
    cy.get('.ProseMirror').find('*').should('have.length', 2)
    cy.get('.ProseMirror strong').should('have.length', 0)
    cy.get('button').contains('Show').click()

    // Clicking 'Show' button should replace editor document with the snapshot data
    cy.get('.ProseMirror').find('*').should('have.length', 4)
    cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)

    cy.get('button').contains('Hide').click()
    cy.get('.ProseMirror strong').should('have.length', 0)

    // 'Restore' should replace the doc permanently with the snapshot doc
    cy.get('button').contains('Restore').click()
    cy.get('.ProseMirror strong').should('have.length', 1)

    // This exports the snapshot as json
    cy.get('button').contains('Export').click()
    cy.readFile(getDownloaded(`${TEST_SNAPSHOT_CHANGED}.json`)).should('deep.equal', snapshot1)

    // Upload the snapshot
    cy.get('.floating-dock input[type="file"]').attachFile('snapshot-1.json')
    cy.get('.right-panel li').should('have.length', 2)

    // Reset the devTools to see that the snapshots were persisted and contain the old doc
    cy.resetDoc()
    cy.devTools().find('.floating-btn').click()
    cy.devTools().find('ul.tabs-menu li button').contains('SNAPSHOTS').click()
    cy.get('.right-panel li').should('have.length', 2)
    cy.get('.right-panel li').eq(0).contains('Show').click()
    cy.get('.ProseMirror').find('*').should('have.length', 4)
    cy.get('.ProseMirror strong').includesStringCount(TEST_TEXT).should('equal', 1)

    cy.get('button').contains('Delete').click()
    cy.get('.right-panel li').should('have.length', 2)
    cy.get('button').contains('confirm delete', { matchCase: false }).click()
    cy.get('.right-panel li').should('have.length', 1)

    cy.get('button').contains('Delete').click()
    cy.get('button').contains('confirm delete', { matchCase: false }).click()
    cy.get('.right-panel li').should('have.length', 0)

    // I have to select only the main section without the tab list since there's some weird bug with Cypress
    // https://github.com/cypress-io/cypress/issues/8415
    cy.get('.floating-dock .container section').toMatchImageSnapshot({
      imageConfig: {
        threshold: 0.001
      },
    })
  })
})
