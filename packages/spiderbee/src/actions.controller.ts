import debug from 'debug'
import { Action } from 'spiderbee-types'
import { Context } from './context.interface'
import { ActionHandler } from './action.handler.interface'
import * as actions from './actions'

import { InvalidActionException } from './exceptions/invalid-action.exception'

export class ActionsController {
  private readonly debug = debug('spiderbee:actions')

  private readonly handlers: Map<string, new () => ActionHandler>

  constructor() {
    this.handlers = new Map()
    this.handlers.set('click', actions.ClickActionHandler)
    this.handlers.set('each', actions.EachActionHandler)
    this.handlers.set('form', actions.FormActionHandler)
    this.handlers.set('links', actions.LinksActionHandler)
    this.handlers.set('loop', actions.LoopActionHandler)
    this.handlers.set('mouse_down', actions.MouseDownActionHandler)
    this.handlers.set('mouse_move', actions.MouseMoveActionHandler)
    this.handlers.set('mouse_up', actions.MouseUpActionHandler)
    this.handlers.set('scroll', actions.ScrollActionHandler)
    this.handlers.set('url', actions.UrlActionHandler)
    this.handlers.set('text', actions.TextActionHandler)
    this.handlers.set('wait', actions.WaitActionHandler)
    this.handlers.set('write', actions.WriteActionHandler)
  }

  async execute(ctx: Context, actions: Action[]): Promise<void> {
    for (const action of actions) {
      let error: Error = null
      let errorCounter = 0
      do {
        try {
          this.debug('executing action: %s', action.type)
          const Handler = this.handlers.get(action.type)
          if (!Handler) {
            throw new InvalidActionException(action.type)
          }
          const handler = new Handler()
          await handler.handle(ctx, action)
          this.debug('completed action: %s', action.type)
        } catch (e) {
          error = e
          errorCounter++
        }
      } while (errorCounter > 0 && errorCounter <= 3)
      if (error && !(action as any).skipIfFails) {
        throw error
      }
    }
  }
}