import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { GlobalState } from './sw'

export interface FoundInstance {
  size: number
  element: string
}
export interface InjectState {
  disabled: boolean
  selector: string
  devToolsOpts: DevToolsOpts
}

interface InjectMessage {
  source: 'pm-dev-tools'
  origin: 'inject'
}

export interface InjectMessageMap {
  'inject-status': InjectMessage & {
    type: 'inject-status'
    data: 'started' | 'found-instances' | 'no-instances' | 'error'
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
