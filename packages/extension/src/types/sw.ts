import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { InjectState } from './inject'
import { PopUpState } from './pop-up'

export interface GlobalState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  devToolsOpts: DevToolsOpts
}

interface SWMessage {
  source: 'pm-dev-tools'
  origin: 'sw'
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
