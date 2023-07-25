import type { EditorView } from 'prosemirror-view'

import type { InjectState } from '../types'

import { getEditorView, sleep, tryQueryIframe } from './utils'

const MAX_ATTEMPTS = 10

export async function findEditorViews(
  attempts: number,
  state: InjectState
): Promise<EditorView[] | undefined> {
  await sleep(1000 * attempts)
  try {
    const {
      disabled,
      inject: { selector }
    } = state
    if (disabled) {
      return []
    }
    const views = await Promise.all(
      Array.from(document.querySelectorAll(selector)).map(el =>
        getEditorView(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    const iframes = (
      await Promise.all(
        Array.from(document.querySelectorAll('iframe')).map(iframe =>
          tryQueryIframe(iframe, selector)
        )
      )
    ).flat()
    const iframeViews = await Promise.all(
      iframes.map(el =>
        getEditorView(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    const filtered = views.concat(iframeViews).filter(v => v !== undefined) as EditorView[]
    if (filtered.length === 0 && attempts < MAX_ATTEMPTS) {
      return findEditorViews(attempts + 1, state)
    }
    return filtered
  } catch (err) {
    console.error(err)
    return undefined
  }
}
