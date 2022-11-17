import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { FoundInstance } from './inject'
import type { PopUpMessage } from './messages'
import { GlobalState } from './sw'

export type PopUpState = GlobalState & {
  instances: FoundInstance[]
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface PopUpMessageMap {
  'mount-pop-up': PopUpMessage & {
    type: 'mount-pop-up'
    data: undefined
  }
  'update-state': PopUpMessage & {
    type: 'update-state'
    data: DeepPartial<GlobalState>
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
