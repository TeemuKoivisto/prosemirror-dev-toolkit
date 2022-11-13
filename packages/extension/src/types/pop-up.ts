import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { FoundInstance } from './inject'
import type { PopUpMessage } from './messages'
import { GlobalState } from './sw'

export type PopUpState = GlobalState & {
  instances: FoundInstance[]
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
  'reapply-devtools': PopUpMessage & {
    type: 'reapply-devtools'
    data: undefined
  }
  reload: PopUpMessage & {
    type: 'reload'
    data: undefined
  }
}
