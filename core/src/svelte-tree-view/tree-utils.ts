import { ITreeNode, ValueType } from './types'

export const APP_CONTEXT = 'APP_CONTEXT'

function createNode(key: string, value: any, depth: number, parent: ITreeNode | null): ITreeNode {
  return {
    key,
    value,
    id: Math.random().toString() + Math.random().toString(),
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
  if (Array.isArray(value)) {
    return value.map((v, i) => [i.toString(), v])
  } else if (value instanceof Map) {
    return Array.from(value.entries())
  } else if (typeof value === 'object') {
    return Object.entries(value)
  } else {
    return []
  }
}

export function recurseObjectProperties(
  key: string,
  value: any,
  depth: number,
  parent: ITreeNode | null,
  treeMap: Map<string, ITreeNode>,
  collapseNode?: (n: ITreeNode) => boolean
): ITreeNode {
  const node = createNode(key, value, depth, parent)
  treeMap.set(node.id, node)
  node.children = getChildren(value).map(([key, val]) =>
    recurseObjectProperties(key, val, depth + 1, node, treeMap, collapseNode)
  )
  if (collapseNode) {
    node.collapsed = collapseNode(node)
  }
  return node
}
