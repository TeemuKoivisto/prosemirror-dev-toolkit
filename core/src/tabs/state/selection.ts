import { Selection } from 'prosemirror-state'

const defaultProperties = ['jsonID', 'empty', 'anchor', 'from', 'head', 'to']
const resolvedPosProperties = ['$anchor', '$head', '$cursor', '$to', '$from']
const resolvedPosSubProperties = ['nodeAfter', 'nodeBefore', 'textOffset']

export function createSelection(selection: Selection) {
  return defaultProperties.reduce((acc, key) => {
    // @ts-ignore
    acc[key] = selection[key]
    return acc
  }, {} as { [key: string]: any })
}

export function createFullSelection(selection: Selection) {
  return defaultProperties.concat(resolvedPosProperties).reduce((acc, key) => {
    // @ts-ignore
    let val = selection[key]
    if (val && resolvedPosProperties.includes(key)) {
      const additionalProperties = {}
      resolvedPosSubProperties.forEach(subKey => {
        // @ts-ignore
        additionalProperties[subKey] = val[subKey]
      })
      val = { ...val, ...additionalProperties }
    }
    acc[key] = val
    return acc
  }, {} as { [key: string]: any })
}
