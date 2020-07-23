import debug from 'debug'
import { EventEmitter } from 'events'
import { createHash } from 'crypto'
import { Cluster } from 'puppeteer-cluster'
import { LaunchOptions } from 'puppeteer'
import { Config } from 'spiderbee-types'
import { validate } from 'spiderbee-validator'
import { Context } from './context.interface'
import { ActionsController } from './actions.controller'
import { ClusterJobData } from './cluster-job-data.interface'
import { SpiderEmitter } from './spider.emitter.interface'
import { PageController } from './page.controller'
import { QueueController } from './queue.controller'

const createId = (config: Config) => createHash('sha256')
  .update(Buffer.from(JSON.stringify(config)))
  .update(Buffer.from(Date.now().toString()))
  .digest('hex').substring(0, 32)

export interface SpiderbeeOptions {
  maxConcurrency?: number
  puppeteerOptions?: LaunchOptions
  puppeteer?: any
}

export class Spiderbee extends EventEmitter {
  private readonly debug = debug('spiderbee:core')

  private readonly cluster: Cluster<ClusterJobData, void>

  private readonly jobs: Map<string, SpiderEmitter>

  private readonly queue: QueueController

  private constructor(cluster: Cluster, concurrency: number) {
    super()
    this.cluster = cluster
    this.jobs = new Map()
    this.queue = new QueueController(concurrency)
    this.init()
    this.debug('started')
  }

  private init() {
    this.cluster.task(async ({ page, data: { id, config, emitter, namespace } }) => {
      this.debug('task started')
      const pageController = new PageController(page, emitter)
      await pageController.navigate(config.url)
      const context: Context = {
        cluster: this.cluster,
        page: pageController,
        id,
        emitter,
        namespace,
      }
      const actionsController = new ActionsController()
      await actionsController.execute(context, config.actions)
    })

    this.queue.on('start', async ({ id, config, emitter, done }) => {
      try {
        this.debug(`executing job: ${id}`)
        // execute job
        await this.cluster.execute({ id, config, emitter, namespace: '$' })
        // end job
        emitter.emit('end')
        this.debug(`completed job: ${id}`)
      } catch (e) {
        // emit error
        emitter.emit('error', e)
        this.debug(`failed job: ${id}`)
      } finally {
        this.jobs.delete(id)
        done()
      }
    })
  }

  static async launch(options: SpiderbeeOptions): Promise<Spiderbee> {
    const cluster = await Cluster.launch({
      concurrency: Cluster.CONCURRENCY_PAGE,
      maxConcurrency: options.maxConcurrency || 4,
      puppeteerOptions: options.puppeteerOptions,
      puppeteer: options.puppeteer,
      timeout: 2147483647,
    })
    return new Spiderbee(cluster, options.maxConcurrency || 4)
  }

  async execute(config: Config, callback: (spider: SpiderEmitter, id: string) => void): Promise<void> {
    // validate config
    const errors = await validate(config)
    if (errors.length > 0) {
      throw errors
    }
    // initialize
    const id = config.id ? config.id : createId(config)
    const emitter = new EventEmitter()
    // creating the job
    this.jobs.set(id, emitter)
    // return emitter in callback
    callback(emitter, id)
    // enqueue job
    await this.queue.enqueue(id, config, emitter)
  }

  async idle(): Promise<void> {
    return this.cluster.idle()
  }

  async close(): Promise<void> {
    return this.cluster.close()
  }

  connect(id: string): SpiderEmitter {
    return this.jobs.get(id)
  }
}
