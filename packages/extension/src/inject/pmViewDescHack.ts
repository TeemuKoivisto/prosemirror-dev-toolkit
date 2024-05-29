import type { EditorView } from 'prosemirror-view'

import { Result } from '../types/utils'

interface GetEditorViewOptions {
  promises: Promise<Result<EditorView>>[]
  oldFns: Map<HTMLElement, (view: EditorView, pos: number) => void>
  max: number
  controller: AbortController
}

function recurseElementsIntoHackPromises(el: HTMLElement, opts: GetEditorViewOptions) {
  for (const child of el.children) {
    if (child instanceof HTMLElement && child.pmViewDesc?.selectNode) {
      if (
        opts.promises.length < opts.max &&
        child.pmViewDesc &&
        // Skip custom NodeViews since they seem to bug out with the hack
        child.pmViewDesc.constructor.name !== 'CustomNodeViewDesc'
      ) {
        opts.promises.push(runPmViewDescHack(el, child, opts))
        recurseElementsIntoHackPromises(child, opts)
      }
    }
  }
}

async function runPmViewDescHack(
  parent: HTMLElement,
  child: HTMLElement,
  opts: GetEditorViewOptions
): Promise<Result<EditorView>> {
  if (opts.controller.signal.aborted) {
    return { err: 'Finding aborted', code: 400 }
  }
  let oldFn = parent.pmViewDesc?.updateChildren
  // If the same updateChildren is patched twice, the pmViewDesc gets broken. Ups
  const alreadyPatched = opts.oldFns.has(parent)
  if (!alreadyPatched && oldFn) {
    opts.oldFns.set(parent, oldFn)
  } else {
    oldFn = opts.oldFns.get(parent)
  }
  const reset = () => {
    if (!alreadyPatched && parent.pmViewDesc && oldFn) {
      parent.pmViewDesc.updateChildren = oldFn
    }
  }
  setTimeout(
    () => {
      if (child) {
        child.pmViewDesc?.selectNode()
        child.pmViewDesc?.deselectNode()
      }
    },
    Math.floor(Math.random() * 100)
  )

  return new Promise(res => {
    setTimeout(() => {
      reset()
      res({ err: 'Unable to trigger child.pmViewDesc.selectNode', code: 400 })
    }, 1000)
    opts.controller.signal.addEventListener('abort', () => {
      reset()
      res({ err: 'Finding aborted', code: 400 })
    })
    if (!alreadyPatched) {
      // Monkey patch the updateChildren function only once but stay waiting for timeout incase this node's
      // selection hack works
      parent.pmViewDesc!.updateChildren = (view: EditorView, pos: number) => {
        reset()
        res({ data: view })
        // @ts-ignore
        return Function.prototype.bind.apply(oldFn, view, pos)
      }
    }
  })
}

/**
 * Finds elements with pmViewDesc property to try to hack their updateChildren method to retrieve EditorView
 * @param el
 * @returns
 */
export async function getEditorView(el: HTMLElement): Promise<EditorView | undefined> {
  const opts: GetEditorViewOptions = {
    promises: [],
    oldFns: new Map(),
    max: 50,
    controller: new AbortController()
  }
  recurseElementsIntoHackPromises(el, opts)
  const found = await Promise.any(opts.promises)
  if ('data' in found) {
    opts.controller.abort()
    return found.data
  }
  return undefined
}
