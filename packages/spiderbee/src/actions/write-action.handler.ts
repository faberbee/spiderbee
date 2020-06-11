import { WriteAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class WriteActionHandler implements ActionHandler {
  async handle(ctx: Context, action: WriteAction): Promise<void> {
    if (action.selector) {
      // get element
      const element = await ctx.page.getElementHandle(action.selector)
      // write on element
      await element.type(action.value)
    } else {
      // write with keyboard
      await ctx.page.getPage().keyboard.type(action.value)
    }
  }
}