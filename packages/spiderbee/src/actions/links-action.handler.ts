import { parse as parseUrl } from 'url'
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
    // iterate urls
    for (let [index, url] of urls.entries()) {
      if (action.navigate) {
        // check relative urls
        if (!parseUrl(url).host) {
          const pageUrl = parseUrl(ctx.page.getPage().url())
          url = `${pageUrl.protocol}//${pageUrl.host}${url}`
        }
        // navigate
        await ctx.cluster.execute({
          ...ctx,
          namespace: `${ctx.namespace}.${action.resultKey}[${index}]`,
          config: { ...action.navigate, url },
        })
      }
    }
  }

  private getLinks(ctx: Context, element: CheerioElement, regex?: string) {
    return [...new Set(cheerioHelpers.linksDOM(element).filter(u => regex ? new RegExp(regex).test(u) : u))]
  }
}