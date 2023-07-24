import { GlobalState, InjectData } from './sw'

export interface FoundInstance {
  size: number
  element: string
}
export type InjectState = Omit<GlobalState, 'showOptions' | 'showDebug'> & {
  inject: InjectData
}
export type InjectStatus = 'finding' | 'finished' | 'error'

export interface InjectPayload<T, D> {
  source: 'pm-dev-tools'
  origin: 'inject'
  type: T
  data: D
}
export type InjectMessage =
  | InjectPayload<'inject-status', InjectStatus>
  | InjectPayload<
      'inject-found-instances',
      {
        instances: FoundInstance[]
      }
    >
  | InjectPayload<'update-global-data', Partial<GlobalState>>
  | InjectPayload<'toggle-disable', undefined>
  | InjectPayload<'reload', undefined>
