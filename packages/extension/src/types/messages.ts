export interface Message<
  K extends keyof PopUpMessages & keyof InjectMessages & keyof SWMessages,
  T = (PopUpMessages[K] & InjectMessages[K]) | SWMessages[K]
> {
  type: K
  data: T
}

export type PopUpMessages = {
  open: true
  toggle: true
  badge: true
  reload: true
}

export type InjectMessages = {
  found_instances: number
}

export type SWMessages = {
  current_instances: number
}
