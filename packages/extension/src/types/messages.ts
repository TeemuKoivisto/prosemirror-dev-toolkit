export interface SWMessage<K extends keyof SWMessageMap, T = SWMessageMap[K]> {
  source: 'pm-dev-tools'
  type: K
  data: T
}
// export interface Message<
//   K = string extends keyof PopUpMessages & keyof InjectMessages & keyof SWMessages,
//   T = (PopUpMessages[K] & InjectMessages[K]) | SWMessages[K]
// > {
//   source: 'pm-dev-tools'
//   type: K
//   data: T
// }

export type PopUpMessages = {
  'mount-pop-up': true
  'toggle-disable': true
  badge: true
  reload: true
}

export type FoundInstance = {
  size: number
  classes: string[]
}
export type InjectMessages = {
  found_instances: FoundInstance[]
}

export interface Message<K = string, T = any> {
  source: 'pm-dev-tools'
  type: K
  data: T
}

export type SWMessages = InitPopUp | InitInject
type InitPopUp = Message<
  'init-pop-up',
  {
    disabled: boolean
    instances: FoundInstance[]
  }
>
type InitInject = Message<
  'init-inject',
  {
    selector: string
    disabled: boolean
  }
>

export type SWMessageMap = {
  'init-pop-up': {
    disabled: boolean
    instances: FoundInstance[]
  }
  'init-inject': {
    selector: string
    disabled: boolean
  }
}
