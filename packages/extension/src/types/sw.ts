import { Message, FoundInstance } from './messages'

interface SWMessage {
  source: 'pm-dev-tools'
  origin: 'sw'
}

interface PopUpData extends SWMessage {
  type: 'pop-up-data'
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
  'pop-up-data': PopUpData
  'inject-data': InjectData
}
