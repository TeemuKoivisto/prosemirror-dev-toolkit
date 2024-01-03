import type { Fragment as Frag, Node as PMNode } from 'prosemirror-model'
import type { Plugin as PMPlugin } from 'prosemirror-state'

export type Plugin = PMPlugin & { key: string }

export type Fragment = Frag & { content: PMNode[] }
