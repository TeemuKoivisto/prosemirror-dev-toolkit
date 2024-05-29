import type { EditorView } from 'prosemirror-view'

import type { InjectState } from '../types'

import { AsyncQueue } from './AsyncQueue'
import { tryPmViewDescHack } from './tryPmViewDescHack'
import { sleep, tryQueryIframe } from './utils'

const MAX_ATTEMPTS = 10

interface FoundEditorView {
  type: 'found-editor'
  data: EditorView
}
interface FoundIframeEditor {
  type: 'found-iframe-editor'
  data: EditorView
}
interface Errored {
  type: 'error'
  err: string
}
interface Finished {
  type: 'finished'
}
type Evt = FoundEditorView | FoundIframeEditor | Errored | Finished

async function findIframeEditorViews(selector: string) {
  const els = await Promise.all(
    Array.from(document.querySelectorAll('iframe')).map(iframe => tryQueryIframe(iframe, selector))
  )
  return els.flat().map(el => el as HTMLElement)
}

async function* findEditorViewsGen(
  selector: string,
  controller: AbortController
): AsyncGenerator<Evt, void, unknown> {
  const queue = new AsyncQueue<Evt>(1000)
  let done = false

  controller.signal.addEventListener('abort', () => {
    queue.push({ type: 'finished' })
  })

  const views = Array.from(document.querySelectorAll(selector)).map(el =>
    tryPmViewDescHack(el as HTMLElement)
      .then(res => {
        if (res) {
          queue.push({ type: 'found-editor', data: res })
        }
        return res
      })
      .catch(err => {
        return undefined
      })
  )
  const iframes = findIframeEditorViews(selector).then(els =>
    els.map(el =>
      tryPmViewDescHack(el)
        .then(res => {
          if (res) {
            queue.push({ type: 'found-iframe-editor', data: res })
          }
          return res
        })
        .catch(err => {
          return undefined
        })
    )
  )
  Promise.allSettled([...views, iframes]).then(() => {
    queue.push({ type: 'finished' })
  })
  while (!done) {
    const msg = await queue.next()
    if (msg) {
      yield msg
      done = msg.type === 'finished'
    } else {
      queue.push({
        type: 'error',
        err: 'Finding editor views timeouted'
      })
    }
  }
}

async function find(state: InjectState, attempts = 0) {
  await sleep(1000 * attempts)
  try {
    const {
      disabled,
      inject: { selector }
    } = state
    if (disabled) {
      return []
    }
    const viewEls = Array.from(document.querySelectorAll(selector))
    const iframeEls = Array.from(document.querySelectorAll('iframe'))
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export async function findEditorViews(
  state: InjectState,
  attempts = 0
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
    console.log('start')
    // const views: any[] = []
    const views = await Promise.all(
      Array.from(document.querySelectorAll(selector)).map(el =>
        tryPmViewDescHack(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    console.log('views', views)
    const iframes = (
      await Promise.all(
        Array.from(document.querySelectorAll('iframe')).map(iframe =>
          tryQueryIframe(iframe, selector)
        )
      )
    ).flat()
    console.log('iframes', iframes)
    const iframeViews = await Promise.all(
      iframes.map(el =>
        tryPmViewDescHack(el as HTMLElement).catch(err => {
          return undefined
        })
      )
    )
    console.log('wut')
    const filtered = views.concat(iframeViews).filter((v): v is EditorView => v !== undefined)
    if (filtered.length === 0 && attempts < MAX_ATTEMPTS) {
      console.log('try again?')
      return findEditorViews(state, attempts + 1)
    }
    return filtered
  } catch (err) {
    console.error(err)
    return undefined
  }
}
