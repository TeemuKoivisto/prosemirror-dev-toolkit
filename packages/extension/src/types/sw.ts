import type { DevToolsOpts } from 'prosemirror-dev-toolkit'
import { InjectData, InjectState } from './inject'
import { PopUpState } from './pop-up'

export interface GlobalState {
  disabled: boolean
  showOptions: boolean
  showDebug: boolean
  devToolsOpts: DevToolsOpts
}
export interface PageData {
  injectData: InjectData
  pagePort?: chrome.runtime.Port
  popUpPort?: chrome.runtime.Port
}

export interface SWPayload<T, D = undefined> {
  source: 'pm-dev-tools'
  origin: 'sw'
  type: T
  data: D
}

type SwSource = {
  source: 'pm-dev-tools'
  origin: 'sw'
}

export type SwToInjectMsg = RunInjectMsg | RerunInjectMsg | AbortInjectMsg
export type RunInjectMsg = SwSource & {
  type: 'run-inject'
  data: InjectState
}
export type RerunInjectMsg = SwSource & {
  type: 'rerun-inject'
}
export type AbortInjectMsg = SwSource & {
  type: 'abort-inject'
}

export type SwMessage =
  | SWPayload<'pop-up-state', PopUpState>
  | RunInjectMsg
  | RerunInjectMsg
  | AbortInjectMsg

export interface SWMessageMap {
  'pop-up-state': SWPayload<'pop-up-state', PopUpState>
  'run-inject': SwSource & {
    type: 'run-inject'
    data: InjectState
  }
  'rerun-inject': SwSource & {
    type: 'rerun-inject'
    data: undefined
  }
  'abort-inject': SwSource & {
    type: 'abort-inject'
    data: undefined
  }
}
