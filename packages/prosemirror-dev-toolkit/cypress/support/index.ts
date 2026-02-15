// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

import type { Node as PMNode } from 'prosemirror-model'
import { EditorView } from 'prosemirror-view'
import { Transaction } from 'prosemirror-state'
import { applyDevTools } from '../../src'
import type { Plugin } from '../../src/typings/pm'

import '@testing-library/cypress/add-commands'
import './commands'

declare global {
  interface Window {
    applyDevTools: typeof applyDevTools
    editorView?: EditorView
    _node?: { node: PMNode; pos: number }
    _doc?: { [key: string]: any }
    _trs?: Transaction[]
    _plugin?: [Plugin | undefined, unknown]
  }
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      interrupt: () => void
      devTools: () => Cypress.Chainable<JQuery<HTMLElement>>
      resetDoc: () => void
      includesStringCount: (str: string) => Cypress.Chainable<number>
      pmInsParagraphBolded: (str: string) => Cypress.Chainable<Cypress.AUTWindow>
      hideScrollBars: () => Cypress.Chainable<JQuery<HTMLElement>> // prevSubject: element
    }
  }
}

function abortEarly() {
  if (this.currentTest.state === 'failed') {
    return cy.task('shouldSkip', true)
  }
  cy.task('shouldSkip').then(value => {
    if (value) return cy.interrupt()
  })
}

beforeEach(abortEarly)
afterEach(abortEarly)

before(() => {
  if (Cypress.browser.isHeaded) {
    // Reset the shouldSkip flag at the start of a run, so that it
    //  doesn't carry over into subsequent runs.
    // Do this only for headed runs because in headless runs,
    //  the `before` hook is executed for each spec file.
    cy.task('resetShouldSkipFlag')
  }
  cy.viewport(1280, 800)
})
