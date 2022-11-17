import type { InjectMessage } from './messages'
import { GlobalState } from './sw'

export interface FoundInstance {
  size: number
  element: string
}
export type InjectState = Omit<GlobalState, 'showOptions' | 'showDebug'>
export type InjectStatus = 'finding' | 'found-instances' | 'no-instances' | 'error'

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
  'update-state': InjectMessage & {
    type: 'update-state'
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
