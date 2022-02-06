import React, { useMemo } from 'react'
import debounce from 'lodash.debounce'

import { EditorView } from 'prosemirror-view'
import { EditorState } from 'prosemirror-state'
import { applyDevTools as applyDevToolkit } from 'prosemirror-dev-toolkit'
import { applyDevTools } from 'prosemirror-dev-tools'

import { PMEditor } from 'pm/PMEditor'

class EditorStore {

  view?: EditorView
  currentEditorState?: {[key: string]: any}
  localStorageKey: string

  constructor(key: string) {
    this.localStorageKey = key
    if (typeof window !== 'undefined') {
      const existing = localStorage.getItem(this.localStorageKey)
      if (existing && existing !== null && existing.length > 0) {
        let stored = JSON.parse(existing)
        this.currentEditorState = stored
      }
    }
  }

  setEditorView = (view: EditorView) => {
    this.view = view
    if (this.currentEditorState) {
      const state = EditorState.fromJSON(
        {
          schema: this.view.state.schema,
          plugins: this.view.state.plugins,
        },
        this.currentEditorState
      )
      try {
        this.view.updateState(state)
      } catch (err) {
        this.currentEditorState = view.state
      }
    }
  }

  syncCurrentEditorState = () => {
    const newState = this.view!.state.toJSON()
    localStorage.setItem(this.localStorageKey, JSON.stringify(newState))
  }
}

interface Props {
  useDevTools?: boolean
}

export function Editor(props: Props) {
  const { useDevTools } = props
  const editorStore = useMemo(() => new EditorStore(useDevTools ? 'dev-tools' : 'dev-toolkit'), [useDevTools])
  const debouncedSync = useMemo(() => debounce(editorStore.syncCurrentEditorState, 250), [editorStore.syncCurrentEditorState])

  function handleEdit() {
    debouncedSync()
  }
  function handleEditorReady(view: EditorView) {
    editorStore.setEditorView(view)
    if (useDevTools) {
      applyDevTools(view)
    } else {
      applyDevToolkit(view, {
        devToolsExpanded: true,
        buttonPosition: 'bottom-left',
      })
    }
  }
  return (
    <PMEditor
      className="main"
      onEdit={handleEdit}
      onEditorReady={handleEditorReady}
    />
  )
}
