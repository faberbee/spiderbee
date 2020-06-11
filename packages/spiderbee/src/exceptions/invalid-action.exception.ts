export class InvalidActionException extends Error {
  constructor(action: string) {
    super(`action '${action}' not found`)
    this.name = this.constructor.name
  }
}