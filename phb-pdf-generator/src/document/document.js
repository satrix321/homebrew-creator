import marked from 'marked'

export default function createDocument (rawInput) {
  const noteRegex = />[\s\S]*?(?=[\r\n][^>])/g

  var pagesRawInput = rawInput.split('\\page')
  var pages = ''

  for (let i = 0; i < pagesRawInput.length; i++) {
    let page = '<div class="page columns" data-size="A4">'
    let noteMatches = []
    let match
    let currentIndex = 0

    // notes
    while ((match = noteRegex.exec(pagesRawInput[i])) !== null) {
      noteMatches.push(match)

      let currentPart = pagesRawInput[i].substring(currentIndex, match.index)
      page += marked(currentPart)

      const noteCharRegex = />/g
      let note = match[0].replace(noteCharRegex, '')
      page += '<blockquote>'
      page += marked(note)
      page += '</blockquote>'

      currentIndex = match.index + match[0].length
    }

    if (currentIndex < pagesRawInput[i].length) {
      page += marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length))
    }

    page += '</div>'
    pages += page
  }

  pages += '<div style="clear: both;"></div>'

  return pages
}
