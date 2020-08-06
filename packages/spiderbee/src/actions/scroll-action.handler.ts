import { ScrollAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class ScrollActionHandler implements ActionHandler {
  async handle(ctx: Context, action: ScrollAction): Promise<void> {
    await ctx.page.scrollElement(action.selector)
  }
}