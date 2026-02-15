import { DiffPatcher } from 'jsondiffpatch'
import { diff_match_patch } from '@dmsnell/diff-match-patch'

const diffPatcher = new DiffPatcher({
  arrays: { detectMove: false, includeValueOnMove: false },
  textDiff: { diffMatchPatch: diff_match_patch, minLength: 1 }
})

export function diff(inputA: any, inputB: any) {
  return diffPatcher.diff(inputA, inputB)
}
