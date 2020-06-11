import { Config } from 'spiderbee-types'
import { SpiderEmitter } from './spider.emitter.interface'

export interface ClusterJobData {
  id: string
  config: Config
  emitter: SpiderEmitter
  namespace: string
}