import { IfAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'
import { ActionsController } from '../actions.controller'

export class IfActionHandler implements ActionHandler {
  async handle(ctx: Context, action: IfAction): Promise<void> {
    try {
      // find element exists
      await ctx.page.getElementHandle(action.selector)
    } catch (e) {
      return
    }
    // execute actions
    const actionsController = new ActionsController()
    await actionsController.execute(ctx, action.actions)
  }
}