import { writable } from 'svelte/store'
import { ITreeNode, TreeRecursionOpts, ValueType } from './types'

export function createNode(
  index: number,
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null
): ITreeNode {
  const path = parent ? [...parent.path, index] : []
  return {
    id: `[${path.join(',')}]`,
    index,
    key,
    value,
    depth: depth + 1,
    collapsed: true,
    type: getValueType(value),
    path,
    parentId: parent ? parent.id : null,
    children: []
  }
}

export function getValueType(value: any): ValueType {
  if (Array.isArray(value)) {
    return 'array'
  } else if (value instanceof Map) {
    return 'map'
  } else if (value instanceof Set) {
    return 'set'
  } else if (value === null) {
    return 'null'
  } else {
    return typeof value
  }
}

// case 'Object':
//   case 'Error':
//   case 'Array':
//   case 'Iterable':
//   case 'Map':
//   case 'Set':
//   case 'MapEntry':
//   case 'Number':
//     return undefined;
//   case 'String':
//     return raw => `"${raw}"`;
//   case 'Boolean':
//     return raw => (raw ? 'true' : 'false');
//   case 'Date':
//     return raw => raw.toISOString();
//   case 'Null':
//     return () => 'null';
//   case 'Undefined':
//     return () => 'undefined';
//   case 'Function':
//   case 'Symbol':
export function objType(obj: any) {
  const type = Object.prototype.toString.call(obj).slice(8, -1)
  if (type === 'Object') {
    if (typeof obj[Symbol.iterator] === 'function') {
      return 'Iterable'
    }
    return obj.constructor.name
  }
  return type
}

function getChildren(value: any): [string, any][] {
  switch (getValueType(value)) {
    case 'array':
      return value.map((v: any, i: number) => [i.toString(), v])
    case 'map':
      return Array.from(value.entries())
    case 'set':
      return Array.from(value.values()).map((v: any, i: number) => [i.toString(), v])
    case 'object':
      return Object.entries(value)
    default:
      return []
  }
}

export function recurseObjectProperties(
  index: number,
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null,
  treeMap: Map<string, ITreeNode>,
  oldTreeMap: Map<string, ITreeNode>,
  opts: TreeRecursionOpts
): ITreeNode | null {
  if (opts.omitKeys.includes(key) || depth >= opts.maxDepth) {
    return null
  }
  const node = createNode(index, key, value, depth, parent)
  const oldNode = oldTreeMap.get(node.id)
  // Maintain the same expanded/collapsed toggle for a node in this path/id
  if (oldNode) {
    node.collapsed = oldNode.collapsed
  }

  treeMap.set(node.id, node)
  const mappedChildren = opts.mapChildren && opts.mapChildren(value, getValueType(value), node)
  const children = mappedChildren ?? getChildren(value)
  node.children = children
    .map(([key, val], idx) =>
      recurseObjectProperties(idx, key, val, depth + 1, node, treeMap, oldTreeMap, opts)
    )
    .filter(n => n !== null) as ITreeNode[]

  if (opts.shouldExpandNode) {
    node.collapsed = !opts.shouldExpandNode(node)
  }
  return node
}
