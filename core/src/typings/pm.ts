import { Fragment as Frag, Node as PMNode } from 'prosemirror-model'
import { Plugin as Plug } from 'prosemirror-state'

export type Plugin = Plug & { key: string }

export type Fragment = Frag & { content: PMNode[] }