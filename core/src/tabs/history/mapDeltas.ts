import type { Delta } from 'jsondiffpatch'
import { ITreeNode, ValueType } from 'src/svelte-tree-view/types'

function postprocessValue(value: any) {
  if (value && value._t === 'a') {
    const res: { [key: string]: string | string[] } = {}
    for (const key in value) {
      if (key !== '_t') {
        if (key[0] === '_' && !value[key.substr(1)]) {
          res[key.substr(1)] = value[key]
        } else if (value['_' + key]) {
          res[key] = [value['_' + key][0], value[key][0]]
        } else if (!value['_' + key] && key[0] !== '_') {
          res[key] = value[key]
        }
      }
    }
    return res
  }
  return value
}

export function mapDiffValuesToChildren(
  val: any,
  type: ValueType,
  _parent: ITreeNode
): [string, any][] | undefined {
  if (type !== 'array') return
  return []
}

/**
 * Magic function to transform jsondiffpatch array deltas
 * https://github.com/benjamine/jsondiffpatch/blob/master/docs/deltas.md
 * https://benjamine.github.io/jsondiffpatch/demo/index.html
 */
export function transformArrayDelta(delta: Delta) {
  const isObject = !Array.isArray(delta) && typeof delta === 'object'
  const isArrayDelta = isObject && delta._t === 'a'
  // The DiffValue component handles all other diffs well, object or text,
  // and therefore we don't have to anything
  if (!isArrayDelta) return delta
  // If the value is an array delta all of its values are kinda funky and need massaging
  const transformed = {}
  for (const key in delta) {
    // Skip the identifiers and leave them out from the result
    if (key === '_t') continue
    // Remove or move operation is indicated by an underscore before the index eg '_2'
    const removeOrMove = key.substr(0) === '_'
    // Remove operation is defined by two 0s in its delta [{ <deleted> }, 0, 0]
    const wasRemove = delta[key][1] === 0 && delta[key][2] === 0
    if (removeOrMove && wasRemove) {
      // stuff
    } else if (removeOrMove && !wasRemove) {
      // Move operation is almost the same as remove, except its value is empty and the second number
      // points to the moved index eg ["", 6, 3] AND the third value is always '3'
      // stuff
    } else {
      // If neither remove or move, the operation has to be an insert which payload
      // is only the inserted value eg [{ <inserted> }]
    }
  }
  return transformed
}
