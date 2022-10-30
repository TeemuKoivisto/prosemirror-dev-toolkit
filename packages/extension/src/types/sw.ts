import { Message, FoundInstance } from './messages'

export enum SWMessageType {
  popUpData = 'pop-up-data',
  injectData = 'inject-data'
}

interface SWMessage {
  source: 'pm-dev-tools'
  origin: 'sw'
}

interface PopUpData extends SWMessage {
  type: SWMessageType.popUpData
  data: {
    disabled: boolean
    instances: FoundInstance[]
  }
}

interface InjectData extends SWMessage {
  type: 'inject-data'
  data: {
    disabled: boolean
    selector: string
  }
}

export interface SWMessageMap {
  [SWMessageType.popUpData]: PopUpData
  [SWMessageType.injectData]: InjectData
}
