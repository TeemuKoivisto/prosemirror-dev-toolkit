import { GlobalState, InjectData } from './sw'

export interface FoundInstance {
  size: number
  element: string
}
export type InjectState = Omit<GlobalState, 'showOptions' | 'showDebug'> & {
  inject: InjectData
}
export type InjectStatus = 'finding' | 'finished' | 'error'

export interface InjectPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'inject'
  type: T
  data: D
}

export interface InjectMessageMap {
  'inject-status': InjectPayload<'inject-status', InjectStatus>
  'inject-found-instances': InjectPayload<'inject-found-instances', { instances: FoundInstance[] }>
  'update-global-data': InjectPayload<'update-global-data', Partial<GlobalState>>
  'toggle-disable': InjectPayload<'toggle-disable'>
  reload: InjectPayload<'reload'>
}
