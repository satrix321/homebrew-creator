import marked from 'marked'

export default function createDocument (rawInput) {
  var pagesRawInput = rawInput.split('\\page')
  var pages = ''

  for (let i = 0; i < pagesRawInput.length; i++) {
    let page = '<div class="page" data-size="A4"><div class="columns">'
    page += marked(pagesRawInput[i], { sanitize: true })
    page += '</div></div>'
    pages += page
  }

  pages += '<div style="clear: both;"></div>'

  return pages
}
