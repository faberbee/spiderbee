import { Cluster } from 'puppeteer-cluster'
import { ClusterJobData } from './cluster-job-data.interface'
import { PageController } from './page.controller'
import { SpiderEmitter } from './spider.emitter.interface'

export interface Context {
  cluster: Cluster<ClusterJobData, void>;
  page: PageController;
  id: string;
  emitter: SpiderEmitter;
  namespace: string;
}