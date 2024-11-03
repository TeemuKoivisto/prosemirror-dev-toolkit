import { InjectData, InjectOptions } from './inject'
import { GlobalState } from './sw'
import { DeepPartial } from './utils'

export type PopUpState = {
  global: GlobalState
  inject: InjectOptions
  data: InjectData
}

export interface PopUpPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'pop-up'
  type: T
  data: D
}
export interface PopUpMessageMap {
  'mount-pop-up': PopUpPayload<'mount-pop-up'>
  'update-global-options': PopUpPayload<'update-global-options', DeepPartial<GlobalState>>
  'update-inject-options': PopUpPayload<'update-inject-options', Partial<InjectOptions>>
  'toggle-disable': PopUpPayload<'toggle-disable'>
  'reapply-devtools': PopUpPayload<'reapply-devtools'>
  'open-in-window': PopUpPayload<'open-in-window'>
}
