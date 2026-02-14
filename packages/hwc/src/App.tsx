import React, { forwardRef, useMemo, useRef, useState } from 'react'
import { EditorState, Plugin, PluginKey, Transaction } from 'prosemirror-state'
import { schema } from 'prosemirror-schema-basic'
import {
  NodeViewComponentProps,
  ProseMirror,
  ProseMirrorDoc,
  reactKeys,
  useEditorEffect,
  useEditorEventCallback,
  useEditorState
} from '@handlewithcare/react-prosemirror'
import { exampleSetup } from 'prosemirror-example-setup'
import { Schema } from 'prosemirror-model'
import { addListNodes } from 'prosemirror-schema-list'
import { Decoration, DecorationSet } from 'prosemirror-view'

import { applyDevTools } from 'prosemirror-dev-toolkit'

import './styles.css'

const purplePlugin = new Plugin({
  props: {
    decorations(state) {
      return DecorationSet.create(state.doc, [
        Decoration.inline(0, state.doc.content.size, {
          style: 'color: purple'
        })
      ])
    }
  }
})
const Paragraph = forwardRef<HTMLParagraphElement, NodeViewComponentProps>(function Paragraph(
  { children, nodeProps, ...props },
  ref
) {
  const onClick = useEditorEventCallback(view => view.dispatch(view.state.tr.deleteSelection()))

  return (
    <p {...props} ref={ref} style={{ fontSize: '18px', color: 'red' }}>
      {children}
    </p>
  )
})

const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, 'paragraph block*', 'block'),
  marks: schema.spec.marks
})

function DevTools() {
  const applied = useRef(false)

  useEditorEffect(view => {
    if (!view || applied.current) return

    applyDevTools(view, { devToolsExpanded: true })

    applied.current = true
    console.log('apply', view)
  })

  return null
}
export default function ProseMirrorEditor() {
  const state = useMemo(() => {
    return EditorState.create({
      schema: mySchema,
      plugins: [reactKeys(), ...exampleSetup({ schema: mySchema })]
    })
  }, [])
  const [editorState, setEditorState] = useState(state)

  return (
    <ProseMirror
      state={editorState}
      nodeViews={{
        paragraph: Paragraph
      }}
      dispatchTransaction={tr => {
        console.log('was', tr)
        setEditorState(s => s.apply(tr))
      }}
    >
      <ProseMirrorDoc as={<div id="editor" className="editor-content" />} />
      <DevTools />
    </ProseMirror>
  )
}
