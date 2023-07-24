import { GlobalState, InjectData } from './sw'

export interface PopUpPayload<T, D> {
  source: 'pm-dev-tools'
  origin: 'pop-up'
  type: T
  data: D
}

export type PopUpState = GlobalState & {
  inject: InjectData
}

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type PopUpMessage =
  | PopUpPayload<'mount-pop-up', undefined>
  | PopUpPayload<'mount-pop-up', undefined>
  | PopUpPayload<'update-global-data', DeepPartial<GlobalState>>
  | PopUpPayload<'update-page-data', Partial<InjectData>>
  | PopUpPayload<'toggle-disable', undefined>
  | PopUpPayload<'reapply-devtools', undefined>
  | PopUpPayload<'open-in-window', undefined>
