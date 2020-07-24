import cheerio from 'cheerio'

export function walkDOM(node: CheerioElement, func: (node: CheerioElement) => void): void {
  func(node)
  node = node.firstChild
  while (node) {
    walkDOM(node, func)
    node = node.nextSibling
  }
}

export function isTextNode(node: CheerioElement): boolean {
  return node.type === 'text' && !(/script|style/.test(node.parentNode.tagName))
}

export function getText(element: CheerioElement): string {
  const txtElms = []
  walkDOM(element, function (node) {
    if (isTextNode(node)) {
      const txtCnt = node.data.trim()
      if (txtCnt !== '') {
        txtElms.push(txtCnt)
      }
    }
  })
  return txtElms.join(' \n\n ')
}

function linkTargetChecker(node: CheerioElement): boolean {
  const hrefTarget = ['[href^="/"]', '[href^=".."]', '[href^="http://"]', '[href^="https://"]']
  const $ = cheerio.load(node)

  for (const target in hrefTarget) return ($('a').is(target)) ? true : false
}

export function linksDOM(node: CheerioElement): string[] {
  const $ = cheerio.load(node)
  if (linkTargetChecker(node)) {
    return $('a').get().map(e => $(e).attr('href'))
  }
}

export function isXPath(selector: string): boolean {
  return /^(((HTML\/)|(id\(\"[\w\-]*\"\)))([\w]*(\[([\d]*)\])?\/?)*)$/.test(selector)
}

export function getXPathTo(node: CheerioElement): string {
  if (node.attribs['id'])
    return `id("${node.attribs['id']}")`
  if (!node.parent)
    return node.tagName.toUpperCase()

  let ix = 0
  const siblings = node.parent.children
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i]
    if (sibling === node)
      return `${getXPathTo(node.parentNode)}/${node.tagName.toUpperCase()}[${(ix + 1)}]`
    if (sibling.type === 'tag' && sibling.tagName === node.tagName)
      ix++
  }
}

// TODO: not finished
// function getByXPath(xpath: string): CheerioElement {
//   const xpathEl = xpath.split("/");
//   let node: Cheerio = this.$('*')
//   for (var i = 0; i < xpathEl.length; i++) {
//     if (/\[([\d]*)\]/.test(xpathEl[i])) {
//       const selector = xpathEl[i].replace(/\[([\d]*)\]/, '')
//       const index = parseInt(xpathEl[i].replace(/[\w\[\]]/, ''))
//       node = node.children(selector).eq(index)
//     } else {
//       node = node.children(xpathEl[i])
//     }
//   }
//   return node.get(0);
// }