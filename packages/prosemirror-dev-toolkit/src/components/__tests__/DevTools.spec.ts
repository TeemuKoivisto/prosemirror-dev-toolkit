import { render, fireEvent } from '@testing-library/svelte'
import { EditorView } from 'prosemirror-view'
import { vi } from 'vitest'

import DevTools from '../DevTools.svelte'
import { setupEditor } from '$test-utils/setupEditor'

describe('DevTools component', () => {
  let editor: EditorView
  const div = document.createElement('div')
  div.id = 'pm-editor'
  document.body.appendChild(div)
  // polyfillDom()

  beforeAll(() => {
    vi.stubGlobal('prompt', (str: string) => undefined)
  })

  afterEach(() => {
    if (editor) {
      editor.destroy()
    }
    vi.restoreAllMocks()
  })

  it('should render', () => {
    editor = setupEditor(div)
    const results = render(DevTools, {
      props: {
        view: editor,
        buttonPosition: 'top-left',
        devToolsExpanded: true
      }
    })

    expect(results.container).toBeInTheDocument()
    expect(document.body).toMatchSnapshot()
  })

  it('should open by clicking the floating button', async () => {
    editor = setupEditor(div)
    const results = render(DevTools, { props: { view: editor } })
    const button = results.container.querySelector('button')
    expect(button).not.toBeNull()

    await fireEvent.click(button as HTMLElement)
    const snapshotsTabBtn = await results.findByText('SNAPSHOTS')
    await fireEvent.click(snapshotsTabBtn as HTMLElement)

    expect(results.container).toBeInTheDocument()
    expect(document.body).toMatchSnapshot()
  })
})
