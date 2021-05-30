import { ITreeNode, ValueType, NestableType } from './types'

export const APP_CONTEXT = 'APP_CONTEXT'

function createNode(key: string, value: any, depth: number, parent: ITreeNode | null): ITreeNode {
  return {
    key,
    value,
    id: Math.random().toString() + Math.random().toString(),
    depth: depth + 1,
    collapsed: true,
    recursive: false,
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

export function recurseObjectProperties(
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null,
  treeMap: Map<string, ITreeNode>,
  opts: {
    maxDepth: number
    omitKeys: string[]
    collapseNode?: (n: ITreeNode) => boolean
  }
): ITreeNode | null {
  if (opts.omitKeys.includes(key) || depth >= opts.maxDepth) {
    return null
  }
  const node = createNode(key, value, depth, parent)
  if (node.type === 'map' || node.type === 'object') {
    node.recursive = treeMap.size > 10000
  }
  treeMap.set(node.id, node)
  if (!node.recursive) {
    node.children = getChildren(value)
      .map(([key, val]) => recurseObjectProperties(key, val, depth + 1, node, treeMap, opts))
      .filter(n => n !== null) as ITreeNode[]
  }
  if (opts.collapseNode) {
    node.collapsed = opts.collapseNode(node)
  }
  return node
}
