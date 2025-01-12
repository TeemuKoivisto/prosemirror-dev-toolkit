import React, { useRef } from 'react'
import styled from 'styled-components'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'

import { schema } from 'pm/schema'
import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { exampleSetup } from 'prosemirror-example-setup'
import { boldView, ParagraphView } from 'pm/custom-views'

export function CustomViewsPage() {
  const editorDOMRef = useRef<HTMLDivElement | null>(null)
  const editorViewRef = useRef<EditorView | null>(null)

  React.useLayoutEffect(() => {
    const state = EditorState.create({
      doc: schema.topNodeType.create(undefined, [
        schema.nodes.paragraph.create(undefined, schema.text('hello', [schema.marks.bold.create()]))
      ]),
      schema,
      plugins: exampleSetup({ schema })
    })
    const editorViewDOM = editorDOMRef.current
    if (editorViewDOM) {
      editorViewRef.current = new EditorView(
        { mount: editorViewDOM },
        {
          state,
          markViews: {
            bold: boldView
          },
          nodeViews: {
            // paragraph: (n, v) => new ParagraphView(n, v)
          }
        }
      )
      // applyDevToolkit(editorViewRef.current, {
      //   devToolsExpanded: true
      // })
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
        <p>
          This editor uses custom NodeViews and MarkViews in tests to see whether they are injected correctly.
        </p>
      </header>
      <div className="pm-editor custom-views" ref={editorDOMRef} />
    </Container>
  )
}

const Container = styled.div``
