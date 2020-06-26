import { parse as parseUrl } from 'url'
import { LinksAction, Action } from 'spiderbee-types'
import { ActionHandler } from '../action.handler.interface'
import * as cheerioHelpers from '../node-element.helpers'
import { Context } from '../context.interface'

export class LinksActionHandler implements ActionHandler {
  async handle(ctx: Context, action: LinksAction): Promise<void> {
    if (!action.multiple) {
      const element = await ctx.page.getElement(action.selector)
      const urls = this.getLinks(ctx, element, action.regex)
      ctx.emitter.emit('data', {
        path: `${ctx.namespace}.${action.resultKey}`,
        value: urls,
      })
      if (action.navigate) {
        await this.navigateUrls(ctx, urls, action.navigate)
      }
    } else {
      const elements = await ctx.page.getElements(action.selector)
      for (const [index, element] of elements.entries()) {
        const urls = this.getLinks(ctx, element, action.regex)
        ctx.emitter.emit('data', {
          path: `${ctx.namespace}.${action.resultKey}[${index}]`,
          value: urls,
        })
        if (action.navigate) {
          await this.navigateUrls(ctx, urls, action.navigate)
        }
      }
    }
  }

  private getLinks(ctx: Context, element: CheerioElement, regex?: string) {
    return [...new Set(cheerioHelpers.linksDOM(element).filter(u => regex ? new RegExp(regex).test(u) : u))]
  }

  private async navigateUrls(ctx: Context, urls: string[], navigate: { noscript?: boolean, actions: Action[] }) {
    for (let url of urls) {
      const pageUrl = parseUrl(ctx.page.getPage().url())
      if (!parseUrl(url).host) {
        url = `${pageUrl.protocol}//${pageUrl.host}${url}`
      }
      await ctx.cluster.execute({
        ...ctx,
        config: { ...navigate, url },
      })
    }
  }
}