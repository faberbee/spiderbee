import { EachAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'
import { ActionsController } from '../actions.controller'

export class EachActionHandler implements ActionHandler {
  async handle(ctx: Context, action: EachAction): Promise<void> {
    // get element xpath
    const elementsXPath = await ctx.page.getElementsXPath(action.selector)
    // execute actions for each element
    for (const [index, elementXPath] of elementsXPath.entries()) {
      // add selector and xpath to actions with eachSelector flag
      action.actions = action.actions.map(action => (action as any).eachSelector ? { ...action, selector: elementXPath, multiple: false } : action)
      // execute actions
      const actionsController = new ActionsController()
      await actionsController.execute({
        ...ctx,
        namespace: `${ctx.namespace}.${action.resultKey}[${index}]`,
      }, action.actions)
    }
  }
}