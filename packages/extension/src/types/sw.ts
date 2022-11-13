import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { InjectState } from './inject'
import type { SWMessage } from './messages'
import { PopUpState } from './pop-up'

export interface GlobalState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  selector: string
  devToolsOpts: DevToolsOpts
}

export interface SWMessageMap {
  'pop-up-data': SWMessage & {
    type: 'pop-up-data'
    data: PopUpState
  }
  'inject-data': SWMessage & {
    type: 'inject-data'
    data: InjectState
  }
  'rerun-inject': SWMessage & {
    type: 'rerun-inject'
    data: undefined
  }
}
