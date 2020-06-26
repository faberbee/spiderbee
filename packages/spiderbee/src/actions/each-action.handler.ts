import { EachAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'
import { ActionsController } from '../actions.controller'

export class EachActionHandler implements ActionHandler {
  async handle(ctx: Context, action: EachAction): Promise<void> {
    if (!action.infinite) {
      // get elements xpath
      const elementsXPath = await ctx.page.getElementsXPath(action.selector)
      // execute
      await this.execEach(ctx, action, elementsXPath)
    } else {
      // get elements xpath
      let elementsXPath = await ctx.page.getElementsXPath(action.selector)
      // elements xpath accumulator
      const elementsXPathAcc = []
      do {
        // execute
        await this.execEach(ctx, action, elementsXPath)
        // add concat elements to accumulator
        elementsXPathAcc.concat(elementsXPath)
        // find new elements
        elementsXPath = (await ctx.page.getElementsXPath(action.selector))
          .filter(x => !elementsXPathAcc.includes(x))
      } while (elementsXPath.length > 0)
    }
  }

  private async execEach(ctx: Context, action: EachAction, elementsXPath: string[]): Promise<void> {
    // execute actions for each element
    for (const [index, elementXPath] of elementsXPath.entries()) {
      // add selector and xpath to actions with eachSelector flag
      action.actions = action.actions.map(action => (action as any).eachSelector ?
        { ...action, selector: elementXPath, multiple: false } : action)
      // execute actions
      const actionsController = new ActionsController()
      await actionsController.execute({
        ...ctx,
        namespace: `${ctx.namespace}.${action.resultKey}[${index}]`,
      }, action.actions)
    }
  }
}