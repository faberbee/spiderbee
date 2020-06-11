import { MouseMoveAction, MouseMoveActionMovement, MouseMoveActionSelector } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import { Context } from '../context.interface'

export class MouseMoveActionHandler implements ActionHandler {
  async handle(ctx: Context, action: MouseMoveAction): Promise<void> {
    if ((action as MouseMoveActionSelector).selector) {
      // element position
      const position = await ctx.page.getElementCenterPosition((action as MouseMoveActionSelector).selector)
      // move mouse
      await ctx.page.mouseMove(position)
    } else if ((action as MouseMoveActionMovement).movement) {
      // get mouse position
      const mousePosition = ctx.page.getMousePosition()
      // get movement
      const movement = (action as MouseMoveActionMovement).movement
      // new position
      const position = { x: mousePosition.x + movement.x, y: mousePosition.y + movement.y }
      // move mouse
      await ctx.page.mouseMove(position)
    }
  }
}