import debug from 'debug'
import { Page, ElementHandle } from 'puppeteer'
import cheerio from 'cheerio'
import { SpiderEmitter } from './spider.emitter.interface'
import * as cheerioHelpers from './node-element.helpers'

interface Position {
  x: number;
  y: number;
}

export class PageController {
  private readonly debug = debug('spiderbee:page')

  private url: string
  private page: Page;
  private emitter: SpiderEmitter;
  private $: CheerioStatic;
  private mousePosition: Position;

  constructor(page: Page, emitter: SpiderEmitter) {
    this.page = page
    this.emitter = emitter
    this.mousePosition = { x: 0, y: 0 }
    setInterval(async () => {
      if (this.url !== this.page.url()) {
        this.url = this.page.url()
        await this.loadHtml()
        this.emitter.emit('page', {
          url: this.url,
          html: this.$.html(),
        })
      }
    }, 3000)
  }

  getUrl(): string {
    return this.page.url()
  }

  async navigate(url: string) {
    this.debug('navigating to %s', url)
    await this.page.goto(url, { waitUntil: 'networkidle2' })
    this.url = this.page.url()
    await this.loadHtml()
    this.emitter.emit('page', {
      url: this.url,
      html: this.$.html(),
    })
  }

  async loadHtml() {
    this.debug('loading html')
    this.$ = cheerio.load(await this.page.content())
    this.$('script').remove()
  }

  async getElement(selector: string): Promise<CheerioElement> {
    const element = await this.getElementHandle(selector)
    return this.$(await element.evaluate((node) => node.outerHTML)).get(0)
  }

  async getElementHtml(selector: string): Promise<string> {
    return this.$(await this.getElement(selector)).html()
  }

  async getElementText(selector: string): Promise<string> {
    const element = await this.getElement(selector)
    return cheerioHelpers.getText(element)
  }

  async getElementAttribute(selector: string, attribute: string): Promise<string> {
    return this.$(await this.getElement(selector)).attr(attribute)
  }

  async getElementCenterPosition(selector: string): Promise<Position> {
    const element = await this.getElementHandle(selector)
    const pageFunc = (node: Element) => {
      const { clientWidth: width, clientHeight: height } = node
      const { top, left } = node.getBoundingClientRect()
      return { x: left + width / 2, y: top + height / 2 }
    }
    return element.evaluate(pageFunc)
  }

  async getElements(selector: string): Promise<CheerioElement[]> {
    await this.loadHtml()
    return this.$(selector).get()
  }

  async getElementsHtml(selector: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => this.$(e).html())
  }

  async getElementsText(selector: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => cheerioHelpers.getText(e))
  }

  async getElementsAttribute(selector: string, attribute: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => this.$(e).attr(attribute))
  }

  async getElementsXPath(selector: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => cheerioHelpers.getXPathTo(e))
  }

  async getElementHandle(selector: string): Promise<ElementHandle> {
    const xpath = cheerioHelpers.isXPath(selector)
    this.debug('getting element handle %s xpath: %s', selector, xpath)
    return xpath ?
      await this.page.waitForXPath(selector, { visible: true }) :
      await this.page.waitForSelector(selector, { visible: true })
  }

  getPage(): Page {
    return this.page
  }

  getMousePosition(): Position {
    return this.mousePosition
  }

  async mouseMove(position: Position) {
    await this.page.mouse.move(position.x, position.y)
    this.mousePosition = position
  }
}