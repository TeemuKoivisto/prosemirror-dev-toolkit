import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { FoundInstance, InjectState, InjectStatus } from './inject'
import { PopUpState } from './pop-up'

export interface GlobalState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  devToolsOpts: DevToolsOpts
}
export interface PageData {
  inject: InjectData
  pagePort?: chrome.runtime.Port
  popUpPort?: chrome.runtime.Port
}
export interface InjectData {
  instance: number
  selector: string
  status: InjectStatus
  instances: FoundInstance[]
}

export interface SWPayload<T, D> {
  source: 'pm-dev-tools'
  origin: 'sw'
  type: T
  data: D
}
export type SWMessage =
  | SWPayload<'pop-up-state', PopUpState>
  | SWPayload<'inject-state', InjectState>
  | SWPayload<'rerun-inject', undefined>
