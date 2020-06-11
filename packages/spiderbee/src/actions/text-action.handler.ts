import { TextAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class TextActionHandler implements ActionHandler {
  async handle(ctx: Context, action: TextAction): Promise<void> {
    if (!action.multiple) {
      // get element text
      const elementText = await ctx.page.getElementText(action.selector)
      // emit event
      ctx.emitter.emit('data', {
        path: `${ctx.namespace}.${action.resultKey}`,
        value: elementText,
      })
    } else {
      // get elements html
      const elementsText = await ctx.page.getElementsText(action.selector)
      // for each html element
      for (const [index, elementText] of elementsText.entries()) {
        // emit event
        ctx.emitter.emit('data', {
          path: `${ctx.namespace}.${action.resultKey}[${index}]`,
          value: elementText,
        })
      }
    }
  }
}