import { Action } from 'spiderbee-types'
import { Context } from './context.interface'

export interface ActionHandler {
  handle(ctx: Context, action: Action): Promise<void>
}