import { DiffPatcher, Delta } from 'jsondiffpatch'

const diffPatcher = new DiffPatcher({
  arrays: { detectMove: false, includeValueOnMove: false },
  textDiff: { minLength: 1 }
})

class IdleScheduler {
  task = undefined

  request() {
    this.cancel()
    // @ts-ignore
    const request = window.requestIdleCallback || window.requestAnimationFrame
    return new Promise(resolve => request(resolve))
  }

  cancel() {
    // @ts-ignore
    const cancel = window.cancelIdleCallback || window.cancelAnimationFrame
    if (this.task) {
      cancel(this.task)
    }
  }
}

const scheduler = new IdleScheduler()

export async function diff(id: string, inputA: any, inputB: any) {
  await scheduler.request()
  return {
    id,
    delta: diffPatcher.diff(inputA, inputB)
  }
}
