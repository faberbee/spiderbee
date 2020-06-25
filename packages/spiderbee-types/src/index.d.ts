export interface Config {
  id?: string
  url: string
  noscript?: boolean
  actions: Action[]
}

export default JSON

export type Action =
  UrlAction |
  TextAction |
  LinksAction |
  LoopAction |
  EachAction |
  MouseMoveAction |
  MouseDownAction |
  MouseUpAction |
  ClickAction |
  WriteAction |
  WaitAction |
  FormAction |
  ScrollAction

export interface UrlAction {
  type: 'url'
  resultKey: string
}

export interface TextAction {
  type: 'text'
  selector: string
  resultKey: string
  multiple?: boolean
  skipIfFails?: boolean
}

export interface LinksAction {
  type: 'links'
  selector: string
  resultKey: string
  multiple?: boolean
  regex?: string
  navigate?: {
    noscript?: boolean
    actions: Action[]
  }
  skipIfFails?: boolean
}

export interface LoopAction {
  type: 'loop'
  resultKey: string
  times: number
  actions: Action[]
}

export type EachActionTypeAction =
  Exclude<Action, { selector: string }> |
  Extract<Action, { selector: string }> & {
    eachSelector?: boolean
  }

export interface EachAction {
  type: 'each'
  selector: string
  resultKey: string
  infinite?: boolean
  actions: EachActionTypeAction[]
  skipIfFails?: boolean
}

export interface MouseMoveActionMovement {
  type: 'mouse_move'
  movement: {
    x: number
    y: number
  }
}

export interface MouseMoveActionSelector {
  type: 'mouse_move'
  selector: string
  skipIfFails?: boolean
}

export type MouseMoveAction =
  MouseMoveActionMovement |
  MouseMoveActionSelector

export interface MouseDownAction {
  type: 'mouse_down'
}

export interface MouseUpAction {
  type: 'mouse_up'
}

export interface ClickAction {
  type: 'click'
  selector?: string
  skipIfFails?: boolean
}

export interface WriteAction {
  type: 'write'
  selector?: string
  value: string
  skipIfFails?: boolean
}

export interface WaitAction {
  type: 'wait'
  millis: number
}

export interface FormAction {
  type: 'form'
  inputs: WriteAction[]
  submit: ClickAction
}

export interface ScrollAction {
  type: 'scroll'
  selector: string
}