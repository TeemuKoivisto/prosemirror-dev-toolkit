import { writable } from 'svelte/store'
import { ITreeNode, TreeRecursionOpts, ValueType } from './types'

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

function createNode(key: string, value: any, depth: number, parent: ITreeNode | null): ITreeNode {
  return {
    key,
    value,
    id: uuidv4(),
    depth: depth + 1,
    collapsed: true,
    type: getValueType(value),
    path: parent ? [...parent.path, parent.id] : [],
    parent: parent ? parent.id : null,
    children: []
  }
}

export function getValueType(value: any): ValueType {
  if (Array.isArray(value)) {
    return 'array'
  } else if (value instanceof Map) {
    return 'map'
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
    case 'object':
      return Object.entries(value)
    default:
      return []
  }
}

function recurseObjectProperties(
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null,
  treeMap: Map<string, ITreeNode>,
  opts: TreeRecursionOpts
): ITreeNode | null {
  if (opts.omitKeys.includes(key) || depth >= opts.maxDepth) {
    return null
  }
  const node = createNode(key, value, depth, parent)
  treeMap.set(node.id, node)
  const mappedChildren = opts.mapChildren && opts.mapChildren(value, getValueType(value), node)
  const children = mappedChildren ?? getChildren(value)
  node.children = children
    .map(([key, val]) => recurseObjectProperties(key, val, depth + 1, node, treeMap, opts))
    .filter(n => n !== null) as ITreeNode[]

  if (opts.shouldExpandNode) {
    node.collapsed = !opts.shouldExpandNode(node)
  }
  return node
}

export function initTreeData(data: any, opts: TreeRecursionOpts) {
  const treeMap = new Map()
  const tree = recurseObjectProperties('root', data, 0, null, treeMap, opts) as ITreeNode
  return {
    treeMapStore: writable<Map<string, ITreeNode | null>>(treeMap),
    treeStore: writable<ITreeNode>(tree)
  }
}
