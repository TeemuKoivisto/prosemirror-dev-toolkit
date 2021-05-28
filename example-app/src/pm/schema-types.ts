import {
  Fragment,
  Mark as ProsemirrorMark,
  MarkType,
  Node as ProsemirrorNode,
  NodeType,
  ResolvedPos,
  Schema,
  Slice,
} from 'prosemirror-model'
import { EditorState, NodeSelection, Plugin, TextSelection, Transaction } from 'prosemirror-state'
import { EditorView, NodeView } from 'prosemirror-view'

export type Marks = 'bold' | 'code' | 'italic' | 'link'

export type Nodes =
  | 'blockquote'
  | 'code_block'
  | 'doc'
  | 'hard_break'
  | 'heading'
  | 'horizontal_rule'
  | 'image'
  | 'paragraph'
  | 'text'
