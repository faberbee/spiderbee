import { UrlAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class UrlActionHandler implements ActionHandler {
  async handle(ctx: Context, action: UrlAction): Promise<void> {
    ctx.emitter.emit('data', {
      path: `${ctx.namespace}.${action.resultKey}`,
      value: ctx.page.getUrl(),
    })
  }
}