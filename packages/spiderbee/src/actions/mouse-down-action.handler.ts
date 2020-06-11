import { MouseDownAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class MouseDownActionHandler implements ActionHandler {
  async handle(ctx: Context, action: MouseDownAction): Promise<void> {
    // mouse down
    await ctx.page.getPage().mouse.down()
  }
}