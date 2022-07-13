/**
 * @jest-environment jsdom
 */

import { render, fireEvent } from '@testing-library/svelte'
import { EditorView } from 'prosemirror-view'
import { vi } from 'vitest'

import DevTools from '../DevTools.svelte'
import { setupEditor } from '$test-utils/setupEditor'

let editorView: EditorView

describe('DevTools.svelte', () => {
  beforeAll(() => {
    const el = document.createElement('div')
    document.body.appendChild(el)
    el.id = 'pm-editor'
    editorView = setupEditor(el)

    vi.stubGlobal('prompt', (str: string) => undefined)
  })

  it('should render', () => {
    const results = render(DevTools, {
      props: {
        view: editorView,
        buttonPosition: 'top-left',
        devToolsExpanded: true
      }
    })

    expect(results.container).toBeInTheDocument()
    expect(results.container).toMatchSnapshot()
  })

  it('should open by clicking the floating button', async () => {
    const results = render(DevTools, { props: { view: editorView } })
    const button = results.container.querySelector('button')
    expect(button).not.toBeNull()

    await fireEvent.click(button as HTMLElement)
    const snapshotsTabBtn = await results.findByText('SNAPSHOTS')
    await fireEvent.click(snapshotsTabBtn as HTMLElement)

    expect(results.container).toBeInTheDocument()
    expect(results.container).toMatchSnapshot()
  })
})
