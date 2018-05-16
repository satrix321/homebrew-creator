<template>
  <div class="documentContainer">
    <document-toolbar @zoomChanged="zoomChanged" @setDefaultPagesTexture="setDefaultPagesTexture"></document-toolbar>
    <div class="document">
      <div class="pages" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import '@/assets/scss/print.scss';

import DocumentToolbar from './DocumentToolbar.vue';
import marked from 'marked';
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
  components: {
    DocumentToolbar
  },
  data: function () {
    return {
      pagesTextureUrl: undefined
    };
  },
  computed: {
    compiledMarkdown: function () {
      const pageSplitRegex = /\\page(?:\[[\w ]*\])?/g;
      const preElementRegex = /<pre>[\w\W]*<code>[\w\W]*<\/code>[\w\W]*<\/pre>/g;

      let pagesOptions = this.getPagesOptions(this.rawCode);
      let pagesRawInput = this.rawCode.split(pageSplitRegex);
      let pageNum = 1;

      if (this.pagesTexture && this.pagesTextureFile !== undefined && (this.pagesTextureUrl === undefined || this.pagesTextureFileChanged)) {
        this.loadPagesTexture();
      }

      let spacerBlock = document.createElement('div');
      spacerBlock.className = 'spacerBlock';

      let pages = document.createElement('div');
      pages.appendChild(spacerBlock);

      for (let i = 1; i < pagesRawInput.length; i++) {
        let page = document.createElement('div');
        page.classList.add('page');
        page.dataset.size = 'A4';

        if (this.pagesTexture) page.classList.add('pagesTexture');
        if (this.notesTexture) page.classList.add('notesTexture');
        if (pagesOptions[i - 1] !== null) {
          let classNames = pagesOptions[i - 1].split(' ');
          for (let j = 0; j < classNames.length; j++) {
            page.classList.add(classNames[j]);
          }
        }

        if (this.pagesTexture && this.pagesTextureUrl !== undefined) {
          page.style.backgroundImage = 'url("' + this.pagesTextureUrl + '") !important';
        }

        let pxSpacer = document.createElement('div');
        pxSpacer.className = 'pxSpacer';
        pxSpacer.innerText = '_';

        page.appendChild(pxSpacer);

        let currentIndex = 0;
        if (currentIndex < pagesRawInput[i].length) {
          let pageMarkdownContainer = document.createElement('div');
          let pageMarkdown = marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length));
          pageMarkdown.replace(preElementRegex, "<pre><code></code></pre><div class='pxSpacer'>_</div>");
          pageMarkdownContainer.innerHTML = pageMarkdown;

          let elements = pageMarkdownContainer.querySelectorAll('*[markdown]');
          for (let j = 0; j < elements.length; j++) {
            let innerHTML = elements[j].innerHTML.replace(/&gt;/g, '>');
            elements[j].innerHTML = marked(innerHTML);
          }

          page.innerHTML += pageMarkdownContainer.innerHTML;
        }

        if (!(pagesOptions[i - 1] !== null && pagesOptions[i - 1].includes('title'))) {
          let footer = document.createElement('div');
          footer.classList.add('pageFooter');
          if (pageNum % 2 === 1) {
            footer.classList.add('odd');
          } else {
            footer.classList.add('even');
          }
          footer.dataset.page = pageNum;

          let backgroundElement = document.createElement('div');
          backgroundElement.className = 'background';

          let pageNumberElement = document.createElement('p');
          pageNumberElement.className = 'pageNumber';
          pageNumberElement.innerText = pageNum;

          footer.appendChild(backgroundElement);
          footer.appendChild(pageNumberElement);

          page.appendChild(footer);
        }

        pageNum++;
        pages.appendChild(page);
      }

      pages.appendChild(spacerBlock.cloneNode(true));

      return pages.outerHTML;
    },
    ...mapGetters({
      rawCode: 'rawCode',
      pagesTexture: 'pagesTexture',
      notesTexture: 'notesTexture',
      zoom: 'zoom',
      pagesTextureFile: 'pagesTextureFile',
      pagesTextureFileChanged: 'pagesTextureFileChanged',
      titlePageFont: 'titlePageFont'
    })
  },
  methods: {
    getPagesOptions: function (rawCode) {
      const pageSplitOptionsRegex = /\\page(?:\[([\w ]*)\])?/g;
      let pageOptions = [];
      let pageOptionsIt;

      do {
        pageOptionsIt = pageSplitOptionsRegex.exec(rawCode);
        if (pageOptionsIt) {
          if (pageOptionsIt[1]) {
            pageOptions.push(pageOptionsIt[1]);
          } else {
            pageOptions.push(null);
          }
        }
      } while (pageOptionsIt);

      return pageOptions;
    },
    loadPagesTexture: function () {
      let context = this;
      let reader = new FileReader();

      reader.onload = function (event) {
        context.pagesTextureUrl = event.target.result;
      };

      reader.readAsDataURL(this.pagesTextureFile);
      this.$store.commit('unsetPagesTextureFileChanged');
    },
    zoomChanged: function () {
      let pagesElement = document.querySelector('.document .pages');
      if (this.zoom === 100) {
        pagesElement.style['-webkit-transform-origin'] = '';
        pagesElement.style['-moz-transform-origin'] = '';
        pagesElement.style['transform-origin'] = '';
        pagesElement.style['transform'] = '';
      } else {
        pagesElement.style['-webkit-transform-origin'] = 'top center';
        pagesElement.style['-moz-transform-origin'] = 'top center';
        pagesElement.style['transform-origin'] = 'top center';
        pagesElement.style['transform'] = 'scale(' + (this.zoom / 100).toFixed(2) + ')';
      }
    },
    setDefaultPagesTexture: function () {
      this.$store.commit('setPagesTextureFile', undefined);
      this.pagesTextureUrl = undefined;
    }
  }
};
</script>

<style>
@import url('../assets/scss/fonts.scss');

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
  background-image: url('../assets/imgs/texture_02.jpg');
}
.page h1,
.page h2,
.page h3,
.page h4,
.page h5,
.page h6 {
  font-family: 'headers';
  text-transform: uppercase;
  color: rgb(106, 28, 15);
  margin-bottom: 15px;
}
.page h1 {
  font-size: 21pt;
  font-weight: 600;
}
.page h1::first-letter {
  font-size: 120%;
}
.page h2 {
  font-size: 18pt;
  font-weight: 600;
}
.page h2::first-letter {
  font-size: 120%;
}
.page h3 {
  font-size: 16pt;
  font-weight: 600;
  border-bottom: 1px solid rgb(201, 173, 105);
}
.page h3::first-letter {
  font-size: 120%;
}
.page p,
.page td,
.page li {
  font-family: 'regular-text';
  text-shadow: 0.1px 0.1px #000;
  font-size: 9pt;
  line-height: 1.25;
}
.page > hr {
  display: none !important;
}

/* misc */
.page > pre {
  break-after: column;
}
.page > .pxSpacer {
  height: 1px;
  visibility: hidden;
}
.page > .wideBlock {
  column-span: all;
  -webkit-column-span: all;
}

/* title page */
.page.title > h1,
.page.title > h5 {
  text-align: center;
  font-family: 'titlePage';
  color: rgb(56, 14, 8);
  -webkit-text-shadow: 0 0 10px #fff;
  text-shadow: 0 0 10px #fff;
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
.page > blockquote *:not(blockquote):first-child {
  padding-top: 5px;
}
.page > blockquote *:not(blockquote):last-child {
  margin-bottom: 5px;
}
.page > blockquote h5 {
  font-family: 'headers-blockquotes';
  font-weight: 700;
  margin-bottom: 5px;
  color: black;
}
.page > blockquote p {
  font-family: 'regular-text';
  font-size: 9pt;
}
.page.notesTexture > blockquote.newspaperNote,
.page.notesTexture > blockquote.handwrittenNote {
  background-color: #f4f4e2;
}
.page > blockquote.newspaperNote h5 {
  font-family: 'newspaper-headers';
  text-align: center;
  text-decoration: underline;
  font-size: 18pt;
  text-transform: uppercase;
  color: black;
}
.page > blockquote.newspaperNote p {
  font-family: 'newspaper-text';
  text-align: justify;
  font-size: 12pt;
  color: black;
}
.page > blockquote.handwrittenNote p {
  font-family: 'handwriting';
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
  font-family: 'headers';
  color: rgb(213, 187, 118);
  font-size: 12pt;
}
.page > .pageFooter > .pageNumber {
  left: 20.3cm;
}
.page > .pageFooter.even > .pageNumber {
  left: 0.5cm;
}

/* monster tables */
.page .monsterTable blockquote {
  margin-left: 0;
  margin-right: 0;
  border-left: 3px solid gray;
  border-right: 3px solid gray;
  border-top: 5px solid black;
  border-bottom: 5px solid black;
  page-break-inside: avoid;
}

/* CoC monster table */
.page.notesTexture > .monsterTable.cthulhu > blockquote {
  background-color: #ffbcbc;
}
.page > .monsterTable.cthulhu > blockquote > table {
  width: 100%;
  margin-bottom: 5px;
  margin-left: 0;
  margin-right: 0;
  border-bottom: 1px solid black;
  border-collapse: collapse;
}
.page > .monsterTable.cthulhu > blockquote > table {
  margin-bottom: 0;
}
.page > .monsterTable.cthulhu > blockquote > table th {
  font-size: 10pt;
  font-family: 'headers-blockquotes';
  text-transform: uppercase;
}
.page > .monsterTable.cthulhu > blockquote > table td {
  font-size: 9pt;
  font-family: 'headers-blockquotes';
  padding: 3px 0 3px 0;
}
.page > .monsterTable.cthulhu > blockquote > table:nth-child(1) th {
  padding: 5px 0 5px 0;
}
.page > .monsterTable.cthulhu > blockquote > table:nth-child(1) tbody,
.page > .monsterTable.cthulhu > blockquote > table:nth-child(2) thead {
  display: none;
}
.page > .monsterTable.cthulhu > blockquote > table:nth-child(3) tbody,
.page > .monsterTable.cthulhu > blockquote > table:nth-child(4) tbody {
  border-top: 1px solid black;
}
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(2) tbody tr:nth-child(odd),
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(3) tbody tr:nth-child(odd),
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(4) tbody tr:nth-child(odd) {
  background-color: white;
}
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(2) tbody tr:nth-child(even),
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(3) tbody tr:nth-child(even),
.page.notesTexture > .monsterTable.cthulhu > blockquote > table:nth-child(4) tbody tr:nth-child(even) {
  background-color: rgb(231, 227, 239);
}

/* lists */
.page > ul {
  font-size: 9pt;
  font-family: 'regular-text';
}
.page > ul > li > blockquote {
  margin: 0;
}
.page > ol {
  font-size: 9pt;
  font-family: 'regular-text';
}
</style>
