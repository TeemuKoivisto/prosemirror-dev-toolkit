import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { Message, FoundInstance } from './messages'
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

interface PopUpData extends SWMessage {
  type: 'pop-up-data'
  data: PopUpState
}

interface InjectData extends SWMessage {
  type: 'inject-data'
  data: {
    disabled: boolean
    selector: string
  }
}

export interface SWMessageMap {
  'pop-up-data': PopUpData
  'inject-data': InjectData
}
