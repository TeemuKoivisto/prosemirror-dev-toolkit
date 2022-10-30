import { Message, FoundInstance } from './messages'

export type SWMessages = PopUpData | InjectData

type PopUpData = Message<
  'pop-up-data',
  'sw',
  {
    disabled: boolean
    instances: FoundInstance[]
  }
>
type InjectData = Message<
  'inject-data',
  'sw',
  {
    selector: string
    disabled: boolean
  }
>
