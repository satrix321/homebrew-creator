<template>
  <div class="documentContainer">
    <document-toolbar 
      @zoomChanged="zoomChanged" 
      @setDefaultPagesTexture="setDefaultPagesTexture"
      @scrollToCursor="scrollToCursor"
    ></document-toolbar>
    <div class="document">
      <div class="pages" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import DocumentToolbar from './DocumentToolbar.vue';
import marked from 'marked';
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'Document',
  components: {
    DocumentToolbar
  },
  data: function () {
    return {
      pagesTextureUrl: undefined,
      documentElement: undefined
    };
  },
  mounted: function () {
    this.documentElement = document.querySelector('.document');
    this.documentElement.onscroll = _.debounce(() => {
      let pageNumber = parseInt((this.documentElement.scrollTop / this.pageHeight) * (100 / this.zoom));
      this.$store.commit('document/setCurrentPage', pageNumber);
    }, 500);
  },
  computed: {
    ...mapGetters({
      rawCode: 'editor/rawCode',
      pagesTexture: 'document/pagesTexture',
      notesTexture: 'document/notesTexture',
      zoom: 'document/zoom',
      pagesTextureFile: 'document/pagesTextureFile',
      pagesTextureFileChanged: 'document/pagesTextureFileChanged',
      editorCurrentPage: 'editor/currentPage',
      pageHeight: 'document/pageHeight',
      pageOffset: 'document/pageOffset'
    }),
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
          page.style.backgroundImage = 'url(\'' + this.pagesTextureUrl + '\')';
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
    }
  },
  methods: {
    getPagesOptions: function (code) {
      const pageSplitOptionsRegex = /\\page(?:\[([\w ]*)\])?/g;
      let pageOptions = [];
      let pageOptionsIt;

      do {
        pageOptionsIt = pageSplitOptionsRegex.exec(code);
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
      this.$store.commit('document/unsetPagesTextureFileChanged');
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
      this.$store.commit('document/setPagesTextureFile', undefined);
      this.pagesTextureUrl = undefined;
    },
    scrollToCursor: function () {
      this.documentElement.scrollTo(0, (this.pageHeight * this.editorCurrentPage + this.pageOffset) * (this.zoom / 100));
    }
  }
};
</script>

<style lang="scss">
.documentContainer {
  height: 100%;
  overflow: hidden;

  .document {
    overflow-y: auto;
    position: relative;
    height: calc(100vh - 30px);
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: rgb(204, 204, 204);

    .page {
      display: block;
      margin: 0 0 0.5cm 0;
      box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
      background-color: white;
      position: relative;
      padding-left: 1cm;
      padding-right: 1cm;
      padding-top: 1cm;
      padding-bottom: 1cm;
      box-sizing: border-box;
      text-align: left;
      height: 100%;
      z-index: 1;

      &[data-size="A4"] {
        width: 21cm;
        height: 29.7cm;

        &[data-layout="portrait"] {
          width: 29.7cm;
          height: 21cm;
        }
      }

      &.page.pagesTexture {
        background-image: url('../assets/imgs/texture_02.jpg');
      }

      * {
        margin-top: 0 !important;
      }

      &.columns {
        -moz-column-count: 2 !important;
        -webkit-column-count: 2 !important;
        column-count: 2 !important;
        column-fill: auto;
        -webkit-column-gap: 16px;
        -moz-column-gap: 16px;
        column-gap: 16px;
        >blockquote {
          border-top-style: inset;
        }
      }

      p,
      td {
        font-family: 'regular-text';
        text-shadow: 0.1px 0.1px #000;
        font-size: 9pt;
        line-height: 1.25;
      }

      > hr {
        display: none !important;
      }

      > pre {
        break-after: column;
      }

      > .pxSpacer {
        height: 1px;
        visibility: hidden;
      }

      > .wideBlock {
        column-span: all;
        -webkit-column-span: all;
      }

      @import "@/assets/scss/document/_headers.scss";

      @import "@/assets/scss/document/_lists.scss";
      
      @import "@/assets/scss/document/_titlePages.scss";

      @import "@/assets/scss/document/_images.scss";

      @import "@/assets/scss/document/_notes.scss";

      @import "@/assets/scss/document/_footer.scss";

      @import "@/assets/scss/document/_monsterTables.scss";
    }
  }

  .spacerBlock {
    width: 100%;
    height: 50px;
  }
}

</style>
