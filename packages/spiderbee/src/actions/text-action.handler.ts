import { TextAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class TextActionHandler implements ActionHandler {
  async handle(ctx: Context, action: TextAction): Promise<void> {
    // get elements html
    const elementsText = await ctx.page.getElementsText(action.selector)
    // aggregate text
    const aggregateText = elementsText.reduce((acc, val) => acc += val, '')
      ctx.emitter.emit('data', {
        path: `${ctx.namespace}.${action.resultKey}`,
        value: aggregateText,
      })
    
    console.log('aggregateText => ', aggregateText)
  }
}