import { AsyncQueue } from '../utils/AsyncQueue'
import { getEditorView } from './pmViewDescHack'
import { sleep, tryQueryIframe } from './utils'

import type { InjectEvent, InjectState, Result } from '../types'
import { EditorView } from 'prosemirror-view'

interface FoundView {
  type: 'found-view'
  result: Result<EditorView>
  data:
    | {
        type: 'view'
        index: number
      }
    | {
        type: 'iframe'
        iframeIndex: number
        index: number
      }
}
interface Abort {
  type: 'abort'
}

const MAX_ATTEMPTS = 10
const TIMEOUT = 4
const SLEEP = 1000

export async function* findAllEditorViews(
  state: InjectState,
  controller?: AbortController,
  attempts = 0
): AsyncGenerator<InjectEvent | FoundView | Abort, void, unknown> {
  yield { type: 'sleeping', data: { attempt: attempts, sleeping: SLEEP * attempts } }
  await sleep(1000 * attempts)

  if (state.global.disabled) {
    yield { type: 'finished', data: { reason: 'disabled' } }
    return
  }
  const queue = new AsyncQueue<InjectEvent | FoundView | Abort>(TIMEOUT)
  const { selector } = state.inject
  const elements: HTMLElement[] = Array.from(document.querySelectorAll(selector))
  const iframeEls: HTMLIFrameElement[] = Array.from(document.querySelectorAll('iframe'))
  let done = elements.length === 0 && iframeEls.length === 0
  let tryAgain = true
  let viewsFailed = -1
  let iframesFailed = -1

  controller?.signal.addEventListener('abort', () => {
    queue.push({
      type: 'abort'
    })
  })

  Promise.all(
    elements.map(async (el, idx) => {
      queue.push({
        type: 'view-instance',
        data: {
          type: 'view',
          iframeIndex: 0,
          index: idx,
          size: el.innerHTML.length,
          element: el.innerHTML.slice(0, 100),
          status: 'injecting',
          err: ''
        }
      })
      const res = await getEditorView(el, state.inject)
      queue.push({
        type: 'found-view',
        result: res,
        data: {
          type: 'view',
          index: idx
        }
      })
      return res
    })
  )
    .then(all => {
      viewsFailed = all.filter(f => 'err' in f).length
      if (viewsFailed > 0 && iframesFailed > 0) {
        queue.push({
          type: 'finished',
          data: { reason: '' }
        })
      }
    })
    .catch(err => {
      queue.push({
        type: 'error',
        data: 'Finding views failed: ' + err.toString()
      })
    })

  Promise.all(
    iframeEls.map(async (iframe, i) => {
      const found = await tryQueryIframe(iframe, selector)
      return Promise.all(
        found.map(async (el, j) => {
          queue.push({
            type: 'view-instance',
            data: {
              type: 'iframe',
              iframeIndex: i,
              index: j,
              size: el.innerHTML.length,
              element: el.innerHTML.slice(0, 100),
              status: 'injecting',
              err: ''
            }
          })
          const res = await getEditorView(el, state.inject)
          queue.push({
            type: 'found-view',
            result: res,
            data: {
              type: 'iframe',
              iframeIndex: i,
              index: j
            }
          })
          return res
        })
      )
    })
  )
    .then(all => {
      iframesFailed = all.flat().filter(f => 'err' in f).length
      if (viewsFailed > 0 && iframesFailed > 0) {
        queue.push({
          type: 'finished',
          data: { reason: '' }
        })
      }
    })
    .catch(err => {
      queue.push({
        type: 'error',
        data: 'Finding iframe views failed: ' + err.toString()
      })
    })

  while (!done) {
    const msg = await queue.next()
    if (msg) {
      yield msg
      done = msg.type === 'finished' || msg.type === 'error'
      tryAgain = msg.type !== 'finished' && msg.type !== 'abort'
    } else {
      queue.push({
        type: 'error',
        data: `findEditorViews timeouted after ${TIMEOUT} seconds`
      })
    }
  }

  if (tryAgain && attempts < MAX_ATTEMPTS) {
    yield* findAllEditorViews(state, controller, attempts + 1)
  }
}
