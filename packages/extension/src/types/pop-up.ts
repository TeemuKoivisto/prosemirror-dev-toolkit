import { GlobalState, InjectData } from './sw'

export type PopUpState = GlobalState & {
  inject: InjectData
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export interface PopUpPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'pop-up'
  type: T
  data: D
}
export interface PopUpMessageMap {
  'mount-pop-up': PopUpPayload<'mount-pop-up'>
  'update-global-data': PopUpPayload<'update-global-data', DeepPartial<GlobalState>>
  'update-page-data': PopUpPayload<'update-page-data', Partial<InjectData>>
  'toggle-disable': PopUpPayload<'toggle-disable'>
  'reapply-devtools': PopUpPayload<'reapply-devtools'>
  'open-in-window': PopUpPayload<'open-in-window'>
}
