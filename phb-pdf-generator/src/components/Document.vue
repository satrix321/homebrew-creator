<template>
  <div class="documentContainer">
    <div class="dpi"></div>
    <div class="documentToolbar">
      <button class="btn" v-on:click="zoomIn"><Icon name="search-plus"></Icon></button>
      <button class="btn" v-on:click="zoomOut"><Icon name="search-minus"></Icon></button>
    </div>
    <div class="document">
      <div class="spacerBlock"></div>
      <div class="pages" v-html="compiledMarkdown"></div>
      <div class="spacerBlock"></div>
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
      zoom: 100
    }
  },
  computed: {
    compiledMarkdown: function () {
      const pageSplitOptionsRegex = /\\page(?:\[([\w ]*)\])?/g
      const pageSplitRegex = /\\page(?:\[[\w ]*\])?/g

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

      for (let i = 1; i < pagesRawInput.length; i++) {
        let page = ''

        if (pageOptions[i - 1] !== null) {
          page = '<div class="page ' + pageOptions[i - 1] + '"data-size="A4">'
        } else {
          page = '<div class="page" data-size="A4">'
        }

        let currentIndex = 0

        if (currentIndex < pagesRawInput[i].length) {
          page += marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length))
        }

        page += '<div class="pageFooter ' + (pageNum % 2 === 1 ? 'odd' : 'even') + '" data-page="' + pageNum + '"><div class="background"></div><p class="pageNumber">' + pageNum + '</p></div>'

        page += '</div>'
        pages += page

        pageNum++
      }

      pages += '<div style="clear: both;"></div>'

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
        var pagesElement = document.querySelector('.document .pages')
        var pagesHeight = pagesElement.clientHeight

        pagesElement.style['-webkit-transform-origin'] = ''
        pagesElement.style['-moz-transform-origin'] = ''
        pagesElement.style['transform-origin'] = ''
        pagesElement.style['transform'] = ''
        pagesElement.style['height'] = (pagesHeight * 2) + 'px'

        this.zoom = 100
      }
    },
    zoomOut: function () {
      if (this.zoom > 50) {
        var pagesElement = document.querySelector('.document .pages')
        var pagesHeight = pagesElement.clientHeight

        pagesElement.style['-webkit-transform-origin'] = 'top center'
        pagesElement.style['-moz-transform-origin'] = 'top center'
        pagesElement.style['transform-origin'] = 'top center'
        pagesElement.style['transform'] = 'scale(0.5)'
        pagesElement.style['height'] = (pagesHeight / 2) + 'px'

        this.zoom = 50
      }
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Alegreya+Sans+SC');
@import url('https://fonts.googleapis.com/css?family=Source+Serif+Pro');
@import url('https://fonts.googleapis.com/css?family=Cormorant+SC');

.documentContainer {
  background: rgb(204,204,204);
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
  background-color: rgb(65,65,65);
}
.documentToolbar .btn {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: rgb(75,75,75);
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
  background-color: rgb(95,95,95);
  padding: 0 8px 0 8px;
}

/* Document */
.document {
  overflow-y: auto;
  background: rgb(204,204,204);
  position: relative;
  height: calc(100vh - 30px);
  width: 100%;
  background: rgb(204,204,204);
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
  margin-left: auto;
  margin-right: auto;
}
.page[data-size="A4"][data-layout="portrait"] {
  width: 29.7cm;
  height: 21cm;
}
.columns {
  -moz-column-count: 2;
  -webkit-column-count: 2;
  column-count: 2;
}
.columns * {
  margin-top: 0 !important;
}

/* Pages style */
.page {
  background-image: url('../assets/imgs/texture_01.jpg');
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
.page > blockquote {
  margin-left: 0;
  margin-right: 0;
  border-left: 3px solid gray;
  border-right: 3px solid gray;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  background-color: rgb(218, 230, 191);
}
.page > blockquote > blockquote {
  background-color: rgb(220, 207, 172);
  margin: 0;
  overflow: auto;
}
.page > blockquote > blockquote > blockquote {
  background-color: rgb(231, 227, 239);
  margin: 0;
  overflow: auto;
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
  right: 0.5cm;
}
.page > .pageFooter.even > .pageNumber {
  left: 0.5cm;
}

.page > blockquote > table {
  width: 100%;
  margin-bottom: 5px;
  margin-left: 0;
  margin-right: 0;
}
.page > hr {
  display: none;
}

/* monster tables */
.page > blockquote > hr {
  margin-bottom: 0;
}
.page > hr + blockquote {
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
.page > blockquote {
  -webkit-column-break-inside: avoid;
  -moz-column-break-inside: avoid;
  -o-column-break-inside: avoid;
  -ms-column-break-inside: avoid;
  page-break-inside: avoid;
}

</style>
