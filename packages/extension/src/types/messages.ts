type Origin = 'pop-up' | 'sw' | 'inject'

export interface Message<K, O extends Origin, T> {
  source: 'pm-dev-tools'
  origin: O
  type: K
  data: T
}

// export interface SWMessage<K extends keyof SWMessageMap, T = SWMessageMap[K]> {
//   source: 'pm-dev-tools'
//   type: K
//   data: T
// }
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
  'inject-found-instances': FoundInstance[]
}
