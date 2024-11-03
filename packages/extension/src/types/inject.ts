import { EditorView } from 'prosemirror-view'
import { GlobalState } from './sw'
import { Result } from './utils'

export interface FoundInstance {
  type: 'view' | 'iframe'
  index: number
  size: number
  element: string
  status: string
}
export type InjectStatus = 'finding' | 'finished' | 'aborted' | 'error'
export type InjectOptions = {
  selected: { type: 'view' | 'iframe'; index: number }
  selector: string
  maxQueriedNodes: number
  skipCustomViews: boolean
}
export interface InjectData {
  status: InjectStatus
  attempt: number
  sleeping: number
  instances: { [key: string]: FoundInstance }
  // views: Map<
  //   number,
  //   {
  //     size: number
  //     element: string
  //     err: string
  //   }
  // >
  // iframes: Map<
  //   number,
  //   {
  //     index: number
  //     size: number
  //     element: string
  //     err: string
  //   }
  // >
}
export interface InjectState {
  global: Pick<GlobalState, 'disabled' | 'devToolsOpts'>
  inject: InjectOptions
  data: InjectData
}
interface Started {
  type: 'sleeping'
  data: {
    attempt: number
    sleeping: number
  }
}
interface Injecting {
  type: 'injecting'
  data: {
    elements: number
    iframes: number
  }
}
interface ViewResult {
  type: 'view-result'
  data: {
    index: number
    size: number
    element: string
    err: string
  }
}
interface IFrameResult {
  type: 'iframe-result'
  data: {
    iframeIndex: number
    index: number
    size: number
    element: string
    err: string
  }
}
interface ViewsDone {
  type: 'views-done'
  data: { failed: number }
}
interface IFramesDone {
  type: 'iframes-done'
  data: { failed: number }
}
interface Error {
  type: 'error'
  data: string
}
interface Finished {
  type: 'finished'
  data: { reason: string }
}
export type InjectEvent =
  | Started
  | Injecting
  | ViewResult
  | IFrameResult
  | ViewsDone
  | IFramesDone
  | Error
  | Finished

export interface InjectPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'inject'
  type: T
  data: D
}

export interface InjectMsgMap2 {
  'inject-status': InjectPayload<'inject-status', InjectStatus>
  'inject-found-instances': InjectPayload<'inject-found-instances', { instances: FoundInstance[] }>
  'update-global-options': InjectPayload<'update-global-options', Partial<GlobalState>>
  'toggle-disable': InjectPayload<'toggle-disable'>
  reload: InjectPayload<'reload'>
}

export type InjectSource = {
  source: 'pm-dev-tools'
  origin: 'inject'
}

export interface InjectMsgMap {
  'inject-progress': InjectSource & {
    type: 'inject-progress'
    data: InjectStatus
  }
  'inject-event': InjectSource & {
    type: 'inject-event'
    data: InjectEvent
  }
  'inject-found': InjectSource & {
    type: 'inject-found'
    data: {
      instances: FoundInstance[]
    }
  }
  'inject-finished': InjectSource & {
    type: 'inject-finished'
    data: undefined
  }
  'inject-errored': InjectSource & {
    type: 'inject-errored'
    data: undefined
  }
}
