import { MouseUpAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class MouseUpActionHandler implements ActionHandler {
  async handle(ctx: Context, action: MouseUpAction): Promise<void> {
    // mouse up
    await ctx.page.getPage().mouse.up()
  }
}