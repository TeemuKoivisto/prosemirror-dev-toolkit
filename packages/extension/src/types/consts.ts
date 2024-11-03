import { InjectOptions, InjectState } from './inject'
import { PopUpState } from './pop-up'
import { GlobalState } from './sw'

export const PAGE_PORT = 'pm-devtools-page'
export const POP_UP_PORT = 'pm-devtools-pop-up'

export const DEFAULT_INJECT_OPTIONS: InjectOptions = {
  selected: { type: 'view', index: 0 },
  selector: '.ProseMirror',
  maxQueriedNodes: 50,
  skipCustomViews: true
}

export const DEFAULT_GLOBAL_OPTIONS = {
  disabled: false,
  devToolsOpts: {
    devToolsExpanded: false,
    buttonPosition: 'bottom-right' as const
  }
}

export const DEFAULT_INJECT_DATA = {
  status: 'finding' as const,
  attempt: 0,
  sleeping: 0,
  instances: {}
}

export const DEFAULT_INJECT_STATE: InjectState = {
  global: DEFAULT_GLOBAL_OPTIONS,
  inject: DEFAULT_INJECT_OPTIONS,
  data: DEFAULT_INJECT_DATA
}

export const DEFAULT_GLOBAL_STATE: GlobalState = {
  ...DEFAULT_GLOBAL_OPTIONS,
  showOptions: false,
  showDebug: false
}

export const DEFAULT_POP_UP_STATE: PopUpState = {
  global: DEFAULT_GLOBAL_STATE,
  inject: DEFAULT_INJECT_OPTIONS,
  data: DEFAULT_INJECT_DATA
}
