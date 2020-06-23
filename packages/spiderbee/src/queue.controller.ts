import { EventEmitter } from 'events'
import { Config } from 'spiderbee-types'
import { SpiderEmitter } from './spider.emitter.interface'

export class QueueController extends EventEmitter {

  private queue: { id: string, config: Config, emitter: SpiderEmitter, done: () => void }[] = []
  private running: { id: string, config: Config, emitter: SpiderEmitter, done: () => void }[] = []

  constructor(concurrency: number) {
    super()
    setInterval(() => {
      if (this.running.length <= concurrency / 2) {
        const job = this.queue.shift()
        if (job) {
          job.emitter.on('end', () => {
            this.running = this.running.filter(x => x.id !== job.id)
          })
          job.emitter.on('error', () => {
            this.running = this.running.filter(x => x.id !== job.id)
          })
          this.running.push(job)
          this.emit('start', job)
        }
      }
    }, 1000)
  }

  async enqueue(id: string, config: Config, emitter: SpiderEmitter) {
    await new Promise<void>(resolve => {
      this.queue.push({ id, config, emitter, done: resolve })
    })
  }

  on(event: 'start', listener: (job: { id: string, config: Config, emitter: SpiderEmitter, done: () => void }) => void): this {
    return super.on(event, listener)
  }

  emit(event: 'start', job: { id: string, config: Config, emitter: SpiderEmitter, done: () => void }): boolean {
    return super.emit(event, job)
  }
}