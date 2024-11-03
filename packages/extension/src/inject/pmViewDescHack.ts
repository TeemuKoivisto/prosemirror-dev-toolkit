import type { EditorView } from 'prosemirror-view'

import { InjectOptions, Result } from '../types'

interface GetEditorViewParams {
  promises: Promise<Result<EditorView>>[]
  oldFns: Map<HTMLElement, (view: EditorView, pos: number) => void>
  opts: InjectOptions
  controller: AbortController
}

async function* recurseElementsIntoHackPromises(
  el: HTMLElement,
  params: GetEditorViewParams
): AsyncGenerator<Result<EditorView>, void, unknown> {
  for (const child of el.children) {
    if (child instanceof HTMLElement && child.pmViewDesc?.selectNode) {
      if (
        params.promises.length < params.opts.maxQueriedNodes &&
        child.pmViewDesc &&
        // Skip custom NodeViews since they seem to bug out with the hack
        (!params.opts.skipCustomViews || child.pmViewDesc.constructor.name !== 'CustomNodeViewDesc')
      ) {
        yield runPmViewDescHack(el, child, params)
        yield* recurseElementsIntoHackPromises(child, params)
      }
    }
  }
}

async function runPmViewDescHack(
  parent: HTMLElement,
  child: HTMLElement,
  opts: GetEditorViewParams
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
export async function getEditorView(
  el: HTMLElement,
  opts: InjectOptions
): Promise<Result<EditorView>> {
  const params: GetEditorViewParams = {
    promises: [],
    oldFns: new Map(),
    controller: new AbortController(),
    opts
  }
  const errors = []
  for await (const evt of recurseElementsIntoHackPromises(el, params)) {
    if ('data' in evt) {
      params.controller.abort()
      return evt
    } else {
      errors.push(evt)
    }
  }
  // recurseElementsIntoHackPromises(el, params)
  // try {
  //   const found = await Promise.any(params.promises)
  //   if ('data' in found) {
  //     params.controller.abort()
  //     return found
  //   }
  // } catch (err: any) {
  //   console.log('PROMISES', params.promises)
  //   return { err: err.toString(), code: 400 }
  // }
  if (errors.length === 0) {
    return { err: '0 available nodes found', code: 404 }
  } else {
    return {
      err: `pmViewDesc hack failed ${errors.length} times, last error: ${errors.pop()?.err || '<none>'}`,
      code: 400
    }
  }
}
