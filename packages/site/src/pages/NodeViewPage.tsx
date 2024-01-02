import React, { useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'
import { Node as PMNode, Schema } from 'prosemirror-model'

const schema = new Schema({
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
    },
    button: {
      group: 'block',
      atom: true,
      attrs: { label: { default: '' } },
      parseDOM: [{ tag: 'button' }],
      toDOM() {
        return ['button']
      }
    }
  }
})

function buttonView(node: PMNode, view: EditorView, getPos: () => number | undefined) {
  const button = document.createElement('button')
  button.textContent = node.attrs.label || 'Default'
  button.onclick = () => {
    const pos = getPos()
    console.log('clicked ', pos)
    if (pos !== undefined) {
      const tr = view.state.tr.setNodeAttribute(pos, 'label', 'Changed ' + pos)
      view.dispatch(tr)
    }
  }

  return {
    dom: button,
    update(n: PMNode) {
      console.log('ran update')
      button.textContent = n.attrs.label
      return true
    }
  }
}

export function NodeViewPage() {
  const editorDOMRef = useRef(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useLayoutEffect(() => {
    const doc = schema.nodes.doc.create(undefined, [
      schema.nodes.paragraph.create(),
      schema.nodes.button.create()
    ])

    const state = EditorState.create({
      schema,
      doc,
      plugins: exampleSetup({ schema })
    })
    const editorViewDOM = editorDOMRef.current
    if (editorViewDOM) {
      editorViewRef.current = new EditorView(
        { mount: editorViewDOM },
        {
          state,
          nodeViews: {
            button: buttonView
          }
        }
      )
      applyDevToolkit(editorViewRef.current, {
        devToolsExpanded: true
      })
    }
    return () => {
      editorViewRef.current?.destroy()
    }
  }, [])

  return (
    <Container>
      <header>
        <h1>
          <a href="https://teemukoivisto.github.io/prosemirror-dev-toolkit">
            prosemirror-dev-toolkit
          </a>
        </h1>
        <p>This editor uses NodeViews which sometimes tend to flake with the Chrome extension</p>
      </header>
      <div className="pm-editor" ref={editorDOMRef} />
    </Container>
  )
}

const Container = styled.div``
