import type { InjectMessage } from './messages'
import { GlobalState, InjectData } from './sw'

export interface FoundInstance {
  size: number
  element: string
}
export type InjectState = Omit<GlobalState, 'showOptions' | 'showDebug'> & {
  inject: InjectData
}
export type InjectStatus = 'finding' | 'finished' | 'error'

export interface InjectMessageMap {
  'inject-status': InjectMessage & {
    type: 'inject-status'
    data: InjectStatus
  }
  'inject-found-instances': InjectMessage & {
    type: 'inject-found-instances'
    data: {
      instances: FoundInstance[]
    }
  }
  'update-global-data': InjectMessage & {
    type: 'update-global-data'
    data: Partial<GlobalState>
  }
  'toggle-disable': InjectMessage & {
    type: 'toggle-disable'
    data: undefined
  }
  reload: InjectMessage & {
    type: 'reload'
    data: undefined
  }
}
