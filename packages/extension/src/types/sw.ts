import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { FoundInstance, InjectState, InjectStatus } from './inject'
import type { SWMessage } from './messages'
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

export interface SWMessageMap {
  'pop-up-state': SWMessage & {
    type: 'pop-up-state'
    data: PopUpState
  }
  'inject-state': SWMessage & {
    type: 'inject-state'
    data: InjectState
  }
  'rerun-inject': SWMessage & {
    type: 'rerun-inject'
    data: undefined
  }
}
