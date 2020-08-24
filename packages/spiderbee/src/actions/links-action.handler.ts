import { parse as parseUrl, URL } from 'url'
import { LinksAction, Action } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import * as cheerioHelpers from '../node-element.helpers'
import { Context } from '../context.interface'

export class LinksActionHandler implements ActionHandler {

  async handle(ctx: Context, action: LinksAction): Promise<void> {
    // get elements
    const elements = await ctx.page.getElements(action.selector)
    // get url from elements
    const urls = elements.map(e => this.getLinks(ctx, e, action.regex)).reduce((acc, val) => acc.concat(val), [])
    // if should navigate
    if (action.navigate) {
      // iterate urls
      for (const [index, url] of urls.entries()) {
        // navigate
        await ctx.cluster.execute({
          ...ctx,
          namespace: `${ctx.namespace}.${action.resultKey}[${index}]`,
          config: { ...action.navigate, url },
        })
      }
    } else {
      ctx.emitter.emit('data', {
        path: `${ctx.namespace}.${action.resultKey}`,
        value: urls
      })
    }
  }

  private getLinks(ctx: Context, element: CheerioElement, regex?: string) {
    // get unique dom urls
    let urls = cheerioHelpers.linksDOM(element)
    urls = [... new Set(urls)]
    // filter urls by regex
    urls = urls.filter(x => regex ? new RegExp(regex).test(x) : x)
    // remove relative urls
    const { protocol, host } = parseUrl(ctx.page.getUrl())
    urls = urls.map(x => parseUrl(x).host ? new URL(x, `${protocol}//${host}`).toString() : x)
    // return
    return urls
  }
}