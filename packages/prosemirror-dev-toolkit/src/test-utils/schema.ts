import { NodeSpec, Schema } from 'prosemirror-model'

export const schema = new Schema({
  nodes: {
    doc: {
      content: 'block+'
    },
    /// An inline image (`<img>`) node. Supports `src`,
    /// `alt`, and `href` attributes. The latter two default to the empty
    /// string.
    image: {
      inline: true,
      attrs: {
        src: { validate: 'string' },
        alt: { default: null, validate: 'string|null' },
        title: { default: null, validate: 'string|null' }
      },
      group: 'inline',
      draggable: true,
      parseDOM: [
        {
          tag: 'img[src]',
          getAttrs(dom: HTMLElement) {
            return {
              src: dom.getAttribute('src'),
              title: dom.getAttribute('title'),
              alt: dom.getAttribute('alt')
            }
          }
        }
      ],
      toDOM(node) {
        const { src, alt, title } = node.attrs
        return ['img', { src, alt, title }]
      }
    } as NodeSpec,
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
