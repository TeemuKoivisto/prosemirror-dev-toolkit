import { DOMSerializer, Node as PMNode } from 'prosemirror-model'
import { EditorView, MarkViewConstructor, NodeView } from 'prosemirror-view'

export class ParagraphView implements NodeView {
  dom: Node
  contentDOM?: HTMLElement
  node: PMNode

  constructor(
    node: PMNode,
    readonly view: EditorView
  ) {
    this.node = node
    this.view = view
    const toDOM = this.node.type.spec.toDOM
    if (!toDOM) {
      throw Error(`No toDOM method provided to node type ${this.node.type}`)
    }
    const { dom: _dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM(this.node))
    contentDOM?.classList.add('paragraph')
    this.contentDOM = contentDOM
    this.dom = _dom
  }

  destroy() {
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild)
    }
  }
}

export const boldView: MarkViewConstructor = (mark, view, inline) => {
  const element = document.createElement('span')
  element.classList.add('bold')
  const content = document.createElement('span')
  content.classList.add('bold-content')
  element.appendChild(content)
  return {
    dom: element,
    contentDOM: content
  }
}
