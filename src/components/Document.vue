<template>
  <div class="documentContainer">
    <document-toolbar @zoomChanged="zoomChanged"></document-toolbar>
    <div class="document">
      <div class="pages" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/print.css'

import DocumentToolbar from './DocumentToolbar.vue'
import marked from 'marked'
import { mapGetters } from 'vuex'

export default {
  name: 'Document',
  components: {
    DocumentToolbar
  },
  computed: {
    compiledMarkdown: function () {
      const pageSplitOptionsRegex = /\\page(?:\[([\w ]*)\])?/g
      const pageSplitRegex = /\\page(?:\[[\w ]*\])?/g
      const preElementRegex = /<pre>[\w\W]*<code>[\w\W]*<\/code>[\w\W]*<\/pre>/g

      var pageOptions = []
      var pageOptionsIt

      do {
        pageOptionsIt = pageSplitOptionsRegex.exec(this.rawCode)
        if (pageOptionsIt) {
          if (pageOptionsIt[1]) {
            pageOptions.push(pageOptionsIt[1])
          } else {
            pageOptions.push(null)
          }
        }
      } while (pageOptionsIt)

      var pagesRawInput = this.rawCode.split(pageSplitRegex)
      var pages = ''
      var pageNum = 1

      pages += '<div class="spacerBlock"></div>'

      for (let i = 1; i < pagesRawInput.length; i++) {
        let page = ''

        page = '<div class="page '

        page += (this.pagesTexture ? 'pagesTexture ' : '')
        page += (this.notesTexture ? 'notesTexture ' : '')

        if (pageOptions[i - 1] !== null) {
          page += pageOptions[i - 1]
        }

        page += '" data-size="A4">'

        page += "<div class='pxSpacer'>_</div>"

        let currentIndex = 0

        if (currentIndex < pagesRawInput[i].length) {
          page += marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length))
        }

        page = page.replace(preElementRegex, "<pre><code></code></pre><div class='pxSpacer'>_</div>")

        if (!(pageOptions[i - 1] !== null && pageOptions[i - 1].includes('title'))) {
          page += '<div class="pageFooter ' + (pageNum % 2 === 1 ? 'odd' : 'even') + '" data-page="' + pageNum + '"><div class="background"></div><p class="pageNumber">' + pageNum + '</p></div>'
          pageNum++
        }

        page += '</div>'

        pages += page
      }

      pages += '<div class="spacerBlock"></div>'

      return pages
    },
    ...mapGetters({
      rawCode: 'rawCode',
      pagesTexture: 'pagesTexture',
      notesTexture: 'notesTexture',
      zoom: 'zoom'
    })
  },
  methods: {
    zoomChanged: function () {
      var pagesElement = document.querySelector('.document .pages')
      if (this.zoom === 100) {
        pagesElement.style['-webkit-transform-origin'] = ''
        pagesElement.style['-moz-transform-origin'] = ''
        pagesElement.style['transform-origin'] = ''
        pagesElement.style['transform'] = ''
      } else {
        pagesElement.style['-webkit-transform-origin'] = 'top center'
        pagesElement.style['-moz-transform-origin'] = 'top center'
        pagesElement.style['transform-origin'] = 'top center'
        pagesElement.style['transform'] = 'scale(' + (this.zoom / 100).toFixed(2) + ')'
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Source+Serif+Pro:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Cormorant+SC:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Lora:400,400i,700,700i');
@import url('https://fonts.googleapis.com/css?family=Caveat:400,700');
@import url('https://fonts.googleapis.com/css?family=Metal+Mania');
@import url('https://fonts.googleapis.com/css?family=Old+Standard+TT:400,400i,700');

.documentContainer {
  height: 100%;
  overflow: hidden;
}

/* Document */
.document {
  overflow-y: auto;
  position: relative;
  height: calc(100vh - 30px);
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: rgb(204, 204, 204);
}
.document .page {
  display: block;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0,0,0,0.5);
}
.spacerBlock {
  width: 100%;
  height: 50px;
}
.page[data-size="A4"] {
  width: 21cm;
  height: 29.7cm;
}
.page[data-size="A4"][data-layout="portrait"] {
  width: 29.7cm;
  height: 21cm;
}

/* Columns */
.columns {
  -moz-column-count: 2 !important;
  -webkit-column-count: 2 !important;
  column-count: 2 !important;
  column-fill: auto;
  -webkit-column-gap: 16px;
  -moz-column-gap: 16px;
  column-gap: 16px;
}
.columns > blockquote {
  border-top-style: inset;
}

/* Pages */
.page {
  background-color: white;
  position: relative;
  padding-left: 1cm;
  padding-right: 1cm;
  padding-top: 1cm;
  padding-bottom: 1cm;
  box-sizing: border-box;
  text-align: left;
  margin: 0;
  height: 100%;
  z-index: 1;
}
.page * {
  margin-top: 0 !important;
}
.page.pagesTexture {
  background-image: url('../assets/imgs/texture_01.jpg');
}
.page > h1,
.page > h2,
.page > h3,
.page > h4,
.page > h5,
.page > h6 {
  font-family: 'Cormorant SC', serif;
  text-transform: uppercase;
  color: rgb(106, 28, 15);
  margin-bottom: 15px;
}
.page > h1 {
  font-size: 21pt;
  font-weight: 600;
}
.page > h1::first-letter {
  font-size: 120%;
}
.page > h2 {
  font-size: 18pt;
  font-weight: 600;
}
.page > h2::first-letter {
  font-size: 120%;
}
.page > h3 {
  font-size: 16pt;
  font-weight: 600;
  border-bottom: 1px solid rgb(201, 173, 105);
}
.page > h3::first-letter {
  font-size: 120%;
}
.page > p {
  font-family: 'Source Serif Pro', serif;
  font-size: 9pt;
  line-height: 1.25;
}
.page > hr {
  display: none !important;
}
.page > pre {
  break-after: column;
}
.page > .pxSpacer {
  height: 1px;
  visibility: hidden;
}
.page.title > h1,
.page.title > h5 {
  text-align: center;
  font-family: 'Metal Mania', cursive;
  color: rgb(56, 14, 8);
  text-shadow: 0 0 2px #fff;
  -moz-text-shadow: 0 0 2px #fff;
  -webkit-text-shadow: 0 0 2px #fff;
}
.page.title > h1 {
  font-size: 70pt;
}
.page.title > h5 {
  font-size: 18pt;
}

/* images */
.absoluteImage {
  position: absolute;
  z-index: -1;
}
.absoluteImage.fullPageImage {
  left: 0cm;
  top: 0cm;
  width: 21cm;
  height: 29.7cm;
}

/* notes */
.page > blockquote {
  margin-left: 0;
  margin-right: 0;
  border-left: 3px solid gray;
  border-right: 3px solid gray;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  page-break-inside: avoid;
}
.page.notesTexture > blockquote {
  background-color: rgb(218, 230, 191);
}
.page > blockquote > blockquote {
  margin: 0;
  overflow: auto;
}
.page.notesTexture > blockquote > blockquote {
  background-color: rgb(220, 207, 172);
}
.page > blockquote > blockquote > blockquote {
  margin: 0;
  overflow: auto;
}
.page.notesTexture > blockquote > blockquote > blockquote {
  background-color: rgb(231, 227, 239);
}
.page > blockquote > *:not(blockquote),
.page > blockquote > blockquote > *:not(blockquote),
.page > blockquote > blockquote > blockquote > *:not(blockquote) {
  margin-left: 10px;
  margin-right: 10px;
}
.page > blockquote *:not(blockquote):last-child {
  margin-bottom: 5px;
}
.page > blockquote h5 {
  padding-top: 5px;
}
.page > blockquote h5 {
  font-family: 'Alegreya Sans SC';
  font-size: 11pt;
  font-weight: 700;
  margin-bottom: 5px;
}
.page > blockquote p {
  font-family: 'Source Serif Pro', serif;
  font-size: 9pt;
}
.page.notesTexture > blockquote.newspaperNote,
.page.notesTexture > blockquote.handwrittenNote {
  background-color: #f4f4e2;
}
.page > blockquote.newspaperNote h5 {
  font-family: 'Lora', serif;
  text-align: center;
  text-decoration: underline;
  font-size: 18pt;
  text-transform: uppercase;
  color: black;
}
.page > blockquote.newspaperNote p {
  font-family: 'Old Standard TT', serif;
  text-align: justify;
  font-size: 12pt;
  color: black;
}
.page > blockquote.handwrittenNote p {
  font-family: 'Caveat', cursive;
  font-size: 12pt;
  color: black;
}

/* footer */
.page > .pageFooter {
  position: absolute;
  bottom: 0;
  left: 0;
}
.page > .pageFooter > .background {
  position: absolute;
  width: 21cm;
  height: 1cm;
  bottom: 0;
  left: 0;
  background-image: url('../assets/imgs/footer_01.png');
  background-size: 21cm 1cm;
}
.page > .pageFooter.even > .background {
  -moz-transform: scaleX(-1);
  -o-transform: scaleX(-1);
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
}
.page > .pageFooter > .pageNumber {
  position: absolute;
  bottom: 0;
  font-family: 'Alegreya Sans SC';
  color: rgb(213, 187, 118);
}
.page > .pageFooter > .pageNumber {
  left: 20.3cm;
}
.page > .pageFooter.even > .pageNumber {
  left: 0.5cm;
}

/* monster tables */
.page > blockquote > hr {
  margin-bottom: 0;
}
.page.notesTexture > hr + blockquote {
  background-color: #ffbcbc;
}
.page > hr + blockquote > table > thead > tr > th {
  font-size: 12pt;
  font-family: 'Alegreya Sans SC';
}
.page > hr + blockquote > table > tbody > tr > td {
  font-size: 9pt;
  font-family: 'Alegreya Sans SC';
}
.page > blockquote > table {
  width: 100%;
  margin-bottom: 5px;
  margin-left: 0;
  margin-right: 0;
}
.page > blockquote table {
  margin-bottom: 0;
}
.page > blockquote hr {
  margin: 0;
}

/* lists */
.page > ul {
  font-size: 9pt;
  font-family: 'Source Serif Pro', serif;
}
.page > ul > li > blockquote {
  margin: 0;
}
.page > ol {
  font-size: 9pt;
  font-family: 'Source Serif Pro', serif;
}
</style>
