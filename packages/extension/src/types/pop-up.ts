import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import type { PopUpMessage } from './messages'
import { GlobalState, InjectData } from './sw'

export type PopUpState = GlobalState & {
  inject: InjectData
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface PopUpMessageMap {
  'mount-pop-up': PopUpMessage & {
    type: 'mount-pop-up'
    data: undefined
  }
  'update-global-data': PopUpMessage & {
    type: 'update-global-data'
    data: DeepPartial<GlobalState>
  }
  'update-page-data': PopUpMessage & {
    type: 'update-page-data'
    data: Partial<InjectData>
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
