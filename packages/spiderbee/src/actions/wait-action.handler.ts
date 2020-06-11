import { WaitAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class WaitActionHandler implements ActionHandler {
  async handle(ctx: Context, action: WaitAction): Promise<void> {
    await ctx.page.getPage().waitFor(action.millis)
  }
}