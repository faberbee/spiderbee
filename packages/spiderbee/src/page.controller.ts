import debug from 'debug'
import { Page, ElementHandle } from 'puppeteer'

import cheerio from 'cheerio'
import * as cheerioHelpers from './node-element.helpers'

import { SpiderEmitter } from './spider.emitter.interface'

interface Position {
  x: number;
  y: number;
}

export class PageController {
  private readonly debug = debug('spiderbee:page')

  private url: string
  private page: Page;
  private emitter: SpiderEmitter;
  private mousePosition: Position;

  constructor(page: Page, emitter: SpiderEmitter) {
    this.page = page
    this.emitter = emitter
    this.mousePosition = { x: 0, y: 0 }
  }

  getUrl(): string {
    return this.page.url()
  }

  async navigate(url: string): Promise<void> {
    this.debug('navigating to %s', url)
    await this.page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 })
    await this.page.waitFor(3000)
    this.url = this.page.url()
  }

  async getElement(selector: string): Promise<CheerioElement> {
    const element = await this.getElementHandle(selector)
    return cheerio(await element.evaluate((node) => node.outerHTML)).get(0)
  }

  async getElementHtml(selector: string): Promise<string> {
    return cheerio(await this.getElement(selector)).html()
  }

  async getElementText(selector: string): Promise<string> {
    const element = await this.getElement(selector)
    return cheerioHelpers.getText(element)
  }

  async getElementAttribute(selector: string, attribute: string): Promise<string> {
    return cheerio(await this.getElement(selector)).attr(attribute)
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
    const elements = await this.getElementsHandle(selector)
    const elementsHtml = await Promise.all(elements.map(e => e.evaluate((node) => node.outerHTML)))
    return elementsHtml.map(e => cheerio(e).get(0))
  }

  async getElementsHtml(selector: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => cheerio(e).html())
  }

  async getElementsText(selector: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => cheerioHelpers.getText(e))
  }

  async getElementsAttribute(selector: string, attribute: string): Promise<string[]> {
    return (await this.getElements(selector)).map(e => cheerio(e).attr(attribute))
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

  async getElementsHandle(selector: string): Promise<ElementHandle[]> {
    const xpath = cheerioHelpers.isXPath(selector)
    this.debug('getting element handle %s xpath: %s', selector, xpath)
    if (xpath) {
      await this.page.waitForXPath(selector, { visible: true })
    } else {
      await this.page.waitForSelector(selector, { visible: true })
    }
    return xpath ?
      await this.page.$x(selector) :
      await this.page.$$(selector)
  }

  getPage(): Page {
    return this.page
  }

  getMousePosition(): Position {
    return this.mousePosition
  }

  async mouseMove(position: Position): Promise<void> {
    await this.page.mouse.move(position.x, position.y)
    this.mousePosition = position
  }
}