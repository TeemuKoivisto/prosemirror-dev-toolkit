import { GlobalState } from './sw'

export interface FoundInstance {
  type: 'view' | 'iframe'
  iframeIndex: number
  index: number
  size: number
  element: string
  status: string
  err: string
}
export type InjectStatus = 'sleeping' | 'injecting' | 'finished' | 'stopped' | 'error'
export type InjectOptions = {
  selectedId: string
  selector: string
  maxQueriedNodes: number
  skipCustomViews: boolean
}
export interface InjectData {
  status: InjectStatus
  attempt: number
  sleeping: number
  instances: { [key: string]: FoundInstance }
}
export interface InjectState {
  global: Pick<GlobalState, 'disabled' | 'devToolsOpts'>
  inject: InjectOptions
  data: InjectData
}
interface Sleeping {
  type: 'sleeping'
  data: {
    attempt: number
    sleeping: number
  }
}
interface Started {
  type: 'injecting'
  data: {
    views: number
    iframes: number
  }
}
interface ViewInstance {
  type: 'view-instance'
  data: FoundInstance
}
interface ViewResult {
  type: 'view-result'
  data: FoundInstance
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
  data: undefined
}
export type InjectEvent =
  | Sleeping
  | Started
  | ViewInstance
  | ViewResult
  | ViewsDone
  | IFramesDone
  | Error
  | Finished

export type InjectSource = {
  source: 'pm-dev-tools'
  origin: 'inject'
}
export type InjectMsg = InjectSource & InjectEvent
