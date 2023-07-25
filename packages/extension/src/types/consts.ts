import { InjectState } from './inject'
import { PopUpState } from './pop-up'
import { GlobalState, InjectData } from './sw'

export const PAGE_PORT = 'pm-devtools-page'
export const POP_UP_PORT = 'pm-devtools-pop-up'

export const DEFAULT_INJECT_DATA: InjectData = {
  instance: 0,
  selector: '.ProseMirror',
  status: 'finding' as const,
  instances: []
}

const DEFAULT_STATE = {
  disabled: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right' as const
  }
}

export const DEFAULT_INJECT_STATE: InjectState = {
  ...DEFAULT_STATE,
  inject: DEFAULT_INJECT_DATA
}

export const DEFAULT_GLOBAL_STATE: GlobalState = {
  ...DEFAULT_STATE,
  showOptions: false,
  showDebug: false
}

export const DEFAULT_POP_UP_STATE: PopUpState = {
  ...DEFAULT_GLOBAL_STATE,
  inject: DEFAULT_INJECT_DATA
}
