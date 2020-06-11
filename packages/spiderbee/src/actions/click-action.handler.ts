import { ClickAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class ClickActionHandler implements ActionHandler {
  async handle(ctx: Context, action: ClickAction): Promise<void> {
    if (action.selector) {
      // get element
      const element = await ctx.page.getElementHandle(action.selector)
      // click
      await element.click({ delay: 80 })
    } else {
      // get page
      const page = ctx.page.getPage()
      // click on page
      await page.mouse.down()
      await page.waitFor(80)
      await page.mouse.up()
    }
  }
}