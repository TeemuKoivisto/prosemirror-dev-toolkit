import { Selection } from 'prosemirror-state'

const reducedProperties = ['jsonID', 'empty', 'anchor', 'from', 'head', 'to']

const allProperties = ['$anchor', '$head', '$cursor', '$to', '$from']

export function createSelection(selection: Selection) {
  return reducedProperties.reduce((acc, key) => {
    // @ts-ignore
    acc[key] = selection[key]
    return acc
  }, {} as { [key: string]: any })
}

export function createFullSelection(selection: Selection) {
  return reducedProperties.concat(allProperties).reduce((acc, key) => {
    // @ts-ignore
    acc[key] = selection[key]
    return acc
  }, {} as { [key: string]: any })
}
