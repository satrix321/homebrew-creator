<template>
  <div class="documentContainer">
    <div class="dpi"></div>
    <div class="documentToolbar">
      <button class="btn" v-on:click="zoomIn"><Icon name="search-plus"></Icon></button>
      <button class="btn" v-on:click="zoomOut"><Icon name="search-minus"></Icon></button>
      <button class="btn" v-bind:class="{btnClicked: backgroundImage}" v-on:click="togglePageBackground"><Icon name="image"></Icon></button>
      <button class="btn" v-bind:class="{btnClicked: notesBackground}" v-on:click="toggleNotesBackground"><Icon name="file"></Icon></button>
      <button class="btn btnRight">Zoom {{zoom}}%</button>
    </div>
    <div class="document">
      <div class="pages" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import '@/assets/css/print.css'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'
import marked from 'marked'
import { mapGetters } from 'vuex'

export default {
  name: 'Document',
  components: {
    Icon
  },
  data: function () {
    return {
      zoom: 100,
      backgroundImage: true,
      notesBackground: true
    }
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

        page += (this.backgroundImage ? 'backgroundImage ' : '')
        page += (this.notesBackground ? 'notesBackground ' : '')

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

        page += '<div class="pageFooter ' + (pageNum % 2 === 1 ? 'odd' : 'even') + '" data-page="' + pageNum + '"><div class="background"></div><p class="pageNumber">' + pageNum + '</p></div>'

        page += '</div>'
        pages += page

        pageNum++
      }

      pages += '<div class="spacerBlock"></div>'

      return pages
    },
    ...mapGetters({
      rawCode: 'rawCode'
    })
  },
  methods: {
    getDPI: function () {
      var dpiDiv = document.getElementById('dpi')
      var dpiX = dpiDiv.offsetWidth
      var dpiY = dpiDiv.offsetHeight
      return { dpiX, dpiY }
    },
    zoomIn: function () {
      if (this.zoom < 100) {
        let newZoom = this.zoom + 10

        var pagesElement = document.querySelector('.document .pages')

        if (newZoom === 100) {
          pagesElement.style['-webkit-transform-origin'] = ''
          pagesElement.style['-moz-transform-origin'] = ''
          pagesElement.style['transform-origin'] = ''
          pagesElement.style['transform'] = ''
        } else {
          pagesElement.style['-webkit-transform-origin'] = 'top center'
          pagesElement.style['-moz-transform-origin'] = 'top center'
          pagesElement.style['transform-origin'] = 'top center'
          pagesElement.style['transform'] = 'scale(' + (newZoom / 100).toFixed(2) + ')'
        }

        this.zoom = newZoom
      }
    },
    zoomOut: function () {
      if (this.zoom > 50) {
        let newZoom = this.zoom - 10

        var pagesElement = document.querySelector('.document .pages')

        pagesElement.style['-webkit-transform-origin'] = 'top center'
        pagesElement.style['-moz-transform-origin'] = 'top center'
        pagesElement.style['transform-origin'] = 'top center'
        pagesElement.style['transform'] = 'scale(' + (newZoom / 100).toFixed(2) + ')'

        this.zoom = newZoom
      }
    },
    togglePageBackground: function () {
      this.backgroundImage = !this.backgroundImage
    },
    toggleNotesBackground: function () {
      this.notesBackground = !this.notesBackground
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Alegreya+Sans+SC:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Source+Serif+Pro:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');
@import url('https://fonts.googleapis.com/css?family=Cormorant+SC:100,100i,300,300i,400,400i,500,500i,700,700i,800,800i,900,900i');

.documentContainer {
  height: 100%;
  overflow: hidden;
}
.documentContainer > .dpi {
  height: 1in;
  left: -100%;
  position: absolute;
  top: -100%;
  width: 1in;
  display: none;
}

/* Document toolbar */
.documentToolbar {
  height: 30px;
  width: 100%;
  background-color: rgb(65, 65, 65);
}
.documentToolbar .btn {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: rgb(75, 75, 75);
  outline: none;
  float: left;
}
.documentToolbar .btn:hover {
  background-color: rgb(115, 115, 115);
  cursor: pointer;
}
.documentToolbar .btn::-moz-focus-inner {
   border: 0;
}
.documentToolbar .btn:active {
  background-color: rgb(95, 95, 95);
  padding: 0 8px 0 8px;
}
.documentToolbar .btn.btnClicked {
  background-color: rgb(25, 25, 25);
}
.documentToolbar .btn.btnClicked:hover {
  background-color: rgb(115, 115, 115);
}
.documentToolbar .btn.btnRight {
  float: right;
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
.columns {
  -moz-column-count: 2 !important;
  -webkit-column-count: 2 !important;
  column-count: 2 !important;
  column-fill: auto;
}
.columns * {
  margin-top: 0 !important;
}
.columns > blockquote {
  border-top-style: inset;
}

/* Pages style */
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
}
.page.backgroundImage {
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

/* notes */
.page > blockquote {
  margin-left: 0;
  margin-right: 0;
  border-left: 3px solid gray;
  border-right: 3px solid gray;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
}
.page.notesBackground > blockquote {
  background-color: rgb(218, 230, 191);
}
.page > blockquote > blockquote {
  margin: 0;
  overflow: auto;
}
.page.notesBackground > blockquote > blockquote {
  background-color: rgb(220, 207, 172);
}
.page > blockquote > blockquote > blockquote {
  margin: 0;
  overflow: auto;
}
.page.notesBackground > blockquote > blockquote > blockquote {
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
.page.notesBackground > hr + blockquote {
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
</style>
