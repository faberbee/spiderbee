import { LoopAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { ActionsController } from '../actions.controller'
import { Context } from '../context.interface'

export class LoopActionHandler implements ActionHandler {
  async handle(ctx: Context, action: LoopAction): Promise<void> {
    // get actions controller
    const actionsController = new ActionsController()
    // execute actions n times
    for (let t = 0; t < action.times; t++) {
      await actionsController.execute({
        ...ctx,
        namespace: `${ctx.namespace}.${action.resultKey}[${t}]`,
      }, action.actions)
    }
  }
}