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

export interface SWPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'sw'
  type: T
  data: D
}

export interface SWMessageMap {
  'pop-up-state': SWPayload<'pop-up-state', PopUpState>
  'inject-state': SWPayload<'inject-state', InjectState>
  'rerun-inject': SWPayload<'rerun-inject'>
}
