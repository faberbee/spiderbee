import { EventEmitter } from 'events'

export interface SpiderEmitter extends EventEmitter {
  on(event: 'page', listener: (page: { url: string, html: string }) => void): this;
  on(event: 'data', listener: (data: { path: string, value: any }) => void): this;
  on(event: 'error', listener: (err: Error) => void): this;
  on(event: 'end', listener: () => void): this

  emit(event: 'page', page: { url: string, html: string }): boolean;
  emit(event: 'data', data: { path: string, value: any }): boolean;
  emit(event: 'error', err: Error): boolean
  emit(event: 'end'): boolean;
}
