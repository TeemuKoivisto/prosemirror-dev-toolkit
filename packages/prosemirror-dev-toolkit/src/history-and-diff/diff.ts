import { DiffPatcher } from 'jsondiffpatch'

const diffPatcher = new DiffPatcher({
  arrays: { detectMove: false, includeValueOnMove: false },
  textDiff: { minLength: 1 }
})

export function diff(inputA: any, inputB: any) {
  return diffPatcher.diff(inputA, inputB)
}
