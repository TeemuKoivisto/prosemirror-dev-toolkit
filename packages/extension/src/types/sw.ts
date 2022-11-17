import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { InjectState, InjectStatus } from './inject'
import type { SWMessage } from './messages'
import { PopUpState } from './pop-up'

export interface GlobalState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  selector: string
  injectStatus: InjectStatus
  devToolsOpts: DevToolsOpts
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
