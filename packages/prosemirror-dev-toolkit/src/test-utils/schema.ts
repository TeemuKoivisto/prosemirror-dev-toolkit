import { Schema } from 'prosemirror-model'

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    paragraph: {
      content: 'inline*',
      group: 'block',
      parseDOM: [{ tag: 'p' }],
      toDOM() {
        return ['p', 0]
      }
    },
    text: {
      group: 'inline'
    }
  },
  marks: {
    italic: {
      parseDOM: [{ tag: 'i' }, { tag: 'em' }, { style: 'font-style=italic' }],
      toDOM() {
        return ['em', 0]
      }
    },
    bold: {
      parseDOM: [
        { tag: 'strong' },
        // This works around a Google Docs misbehavior where
        // pasted content will be inexplicably wrapped in `<b>`
        // tags with a font-weight normal.
        {
          tag: 'b',
          getAttrs: p => {
            const node = p as HTMLElement
            return node.style.fontWeight != 'normal' && null
          }
        },
        {
          style: 'font-weight',
          getAttrs: p => {
            const value = p as string
            return /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null
          }
        }
      ],
      toDOM() {
        return ['strong', 0]
      }
    }
  }
})
