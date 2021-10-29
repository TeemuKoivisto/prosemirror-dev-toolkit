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

import { EditorView } from 'prosemirror-view'
import { Transaction } from 'prosemirror-state'
import { applyDevTools } from '../../src'
import type { Plugin } from '../../src/typings/pm'

import '@testing-library/cypress/add-commands'
import 'cypress-plugin-snapshots/commands'
import 'cypress-file-upload'
import './commands'

declare global {
  interface Window {
    applyDevTools: typeof applyDevTools
    editorView?: EditorView
    _node?: any
    _doc?: { [key: string]: any }
    _tr?: Transaction
    _plugin?: [Plugin | undefined, unknown]
  }
  // eslint-disable-next-line
  namespace Cypress {
    interface Chainable {
      interrupt: () => void
      devTools: () => Cypress.Chainable<JQuery<HTMLElement>>
      resetDoc: () => Cypress.Chainable<JQuery<HTMLElement>>
      includesStringCount: (str: string) => Cypress.Chainable<number>

      // https://github.com/meinaart/cypress-plugin-snapshots
      toMatchSnapshot(
        options?: Partial<{
          ignoreExtralFields: boolean
          ignoreExtraArrayItems: boolean
          normalizeJson: boolean
          replace: any
          name: string
        }>
      ): Chainable<null>

      toMatchImageSnapshot(
        options?: Partial<{
          imageConfig: Partial<{
            createDiffImage: boolean
            threshold: number
            thresholdType: 'percent' | 'pixels'
            resizeDevicePixelRatio: boolean
          }>
          screenshotConfig: Partial<ScreenshotDefaultsOptions>
          name: string
          separator: string
        }>
      ): Chainable<null>
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
})
