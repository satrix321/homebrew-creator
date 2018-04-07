import marked from 'marked'

export default function createDocument (rawInput) {
  var pagesRawInput = rawInput.split('\\page')
  var pages = ''
  var pageNum = 1

  for (let i = 0; i < pagesRawInput.length; i++) {
    let page = '<div class="page columns" data-size="A4">'
    let currentIndex = 0

    if (currentIndex < pagesRawInput[i].length) {
      page += marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length))
    }

    page += '<div class="pageFooter ' + (pageNum % 2 === 1 ? 'odd' : 'even') + '"></div>'

    page += '</div>'
    pages += page

    pageNum++
  }

  pages += '<div style="clear: both;"></div>'

  return pages
}
