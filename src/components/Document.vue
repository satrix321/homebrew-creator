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
  props: ['widthChange'],
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

    window.onbeforeprint = () => {
      this.$store.commit('document/setOldZoom', this.zoom);
      this.$store.commit('document/setZoom', 100);
      this.zoomChanged();
    };
  },
  watch: {
    widthChange: function () {
      this.checkOverflow();
    }
  },
  computed: {
    ...mapGetters({
      rawCode: 'editor/rawCode',
      pagesTexture: 'document/pagesTexture',
      notesTexture: 'document/notesTexture',
      oldZoom: 'document/oldZoom',
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

      return pages.innerHTML;
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
      if (this.oldZoom > this.zoom) {
        this.documentElement.scrollTo(0, (this.zoom * this.documentElement.scrollTop) / this.oldZoom);
      }

      let pagesElement = document.querySelector('.document .pages');
      if (this.zoom === 100) {
        pagesElement.style['transform'] = '';
        //pagesElement.style.zoom = '100%'; // firefox doesn't support this
      } else {
        pagesElement.style['transform'] = 'scale(' + (this.zoom / 100).toFixed(2) + ')';
        //pagesElement.style.zoom = (this.zoom).toFixed(2) + '%'; // firefox doesn't support this
      }

      if (this.zoom > this.oldZoom) {
        this.documentElement.scrollTo(0, (this.zoom * this.documentElement.scrollTop) / this.oldZoom);
      }

      this.checkOverflow();
    },
    checkOverflow: function () {
      let doc = document.querySelector('.document');

      if (doc.clientWidth !== doc.scrollWidth) {
        if (!doc.classList.contains('overflowFix')) {
          doc.classList.add('overflowFix');
        }
      }
      else if (doc.classList.contains('overflowFix')) {
        doc.classList.remove('overflowFix');
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
    height: calc(100vh - 30px);
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: rgb(204, 204, 204);

    &.overflowFix {
      display: block;

      .pages {
        transform-origin: top left;
      }
    }

    .pages {
      transform-origin: top center;
    }
    
    .page {
      position: relative;
      margin-bottom: 0.5cm;
      box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
      background-color: white;
      position: relative;
      padding: 1cm;
      box-sizing: border-box;
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
        background-image: url('../assets/imgs/texture_01.jpg');
        background-size: 100% 100%;
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
        text-align: justify;
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
    width: 21cm;
    height: 50px;
  }
}

</style>
