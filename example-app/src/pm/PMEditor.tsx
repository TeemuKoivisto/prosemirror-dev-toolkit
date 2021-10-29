import React, { useLayoutEffect, useRef } from 'react'
import { EditorView } from 'prosemirror-view'
import { EditorState, Transaction } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'

import { schema } from './schema'
import { examplePlugin } from './example-plugin'

import './editor.css'
import './prosemirror-example-setup.css'
import './menu.css'

interface EditorProps {
  className?: string
  onEditorReady?: (view: EditorView) => void
  onEdit?: (state: EditorState) => void
}

export function PMEditor(props: EditorProps) {
  const { className = '' } = props
  const editorDOMRef = useRef(null)
  const editorViewRef = useRef<EditorView | null>(null)

  useLayoutEffect(() => {
    const state = createEditorState()
    const editorViewDOM = editorDOMRef.current
    if (editorViewDOM) {
      editorViewRef.current = createEditorView(editorViewDOM, state)
      props.onEditorReady && props?.onEditorReady(editorViewRef.current)
    }
    return () => {
      editorViewRef.current?.destroy()
    }
  // eslint-disable-next-line
  }, [])

  function createEditorState() {
    return EditorState.create({
      schema,
      plugins: exampleSetup({ schema }).concat(examplePlugin()),
    })
  }

  function createEditorView(element: HTMLDivElement, state: EditorState) {
    const view = new EditorView({ mount: element }, {
      state,
      dispatchTransaction,
    })
    return view
  }

  function dispatchTransaction(transaction: Transaction) {
    if (!editorViewRef.current) {
      return
    }
    const editorState = editorViewRef.current.state.apply(transaction)
    editorViewRef.current.updateState(editorState)
    if (props.onEdit) {
      props.onEdit(editorState)
    }
  }

  return (
    <div id="example-editor" ref={editorDOMRef} className={className}/>
  )
}
