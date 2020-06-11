import { FormAction } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { WriteActionHandler } from './write-action.handler'
import { ClickActionHandler } from './click-action.handler'
import { Context } from '../context.interface'

export class FormActionHandler implements ActionHandler {
  async handle(ctx: Context, action: FormAction): Promise<void> {
    throw new Error('Method not implemented.')
    for (const input of action.inputs) {
      // write in input
      const writeHandler = new WriteActionHandler()
      // await writeHandler.handle(ctx, input)
    }
    // click submit element
    const clickHandler = new ClickActionHandler()
    // await clickHandler.handle(ctx, action.submit)
  }
}