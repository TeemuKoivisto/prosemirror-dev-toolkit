import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { Message, FoundInstance } from './messages'
import { GlobalState } from './sw'

export interface PopUpState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  devToolsOpts: DevToolsOpts
  instances: FoundInstance[]
}

interface PopUpMessage {
  source: 'pm-dev-tools'
  origin: 'pop-up'
}

export interface PopUpMessageMap {
  'mount-pop-up': PopUpMessage & {
    type: 'mount-pop-up'
    data: undefined
  }
  'update-state': PopUpMessage & {
    type: 'update-state'
    data: Partial<GlobalState>
  }
  'toggle-disable': PopUpMessage & {
    type: 'toggle-disable'
    data: undefined
  }
  reload: PopUpMessage & {
    type: 'reload'
    data: undefined
  }
}
