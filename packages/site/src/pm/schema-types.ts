import { Schema } from 'prosemirror-model'

export type ExampleSchema = Schema<Nodes, Marks>
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
