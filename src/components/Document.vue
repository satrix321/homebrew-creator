<template>
  <div class="document">
    <document-toolbar 
      @zoomChanged="zoomChanged" 
      @setDefaultPagesTexture="setDefaultPagesTexture"
      @toggleDefaultTheme="toggleDefaultTheme"
      @toggleCthulhuTheme="toggleCthulhuTheme"
      @scrollToCursor="scrollToCursor"/>
    <div ref="pagesContainer" class="document-pages-container">
      <div @change="checkOverflow" ref="pages" class="document-pages" v-html="compiledMarkdown"></div>
    </div>
  </div>
</template>

<script>
import DocumentToolbar from './DocumentToolbar.vue';
import marked from 'marked';
import _ from 'lodash';
import { mapGetters } from 'vuex';

export default {
  name: 'DocumentItem',
  components: {
    DocumentToolbar
  },
  data: function () {
    return {
      pagesTextureUrl: undefined,
      documentElement: undefined
    };
  },
  props: ['eventBus'],
  mounted: function () {
    let pagesContainer = this.$refs.pagesContainer;
    pagesContainer.onscroll = _.debounce(() => {
      let pageNumber = parseInt((pagesContainer.scrollTop / this.pageHeight) * (100 / this.zoom));
      this.$store.commit('document/setCurrentPage', pageNumber);
    }, 500);

    if (this.eventBus) {
      this.eventBus.$on('resize', () => {
        this.checkOverflow();
      });

      this.eventBus.$on('onBeforePrint', () => {
        this.$store.commit('document/setOldZoom', this.zoom);
        this.$store.commit('document/setZoom', 100);
        this.zoomChanged();
      });
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
      theme: 'document/theme',
      editorCurrentPage: 'editor/currentPage',
      pageHeight: 'document/pageHeight',
      pageOffset: 'document/pageOffset'
    }),
    compiledMarkdown: function () {
      const pageSplitRegex = /\\page(?:\[[\w -]*\])?/g;
      const preElementRegex = /<pre>[\w\W]*<code>[\w\W]*<\/code>[\w\W]*<\/pre>/g;

      let pagesOptions = this.getPagesOptions(this.rawCode);
      let pagesRawInput = this.rawCode.split(pageSplitRegex);
      let pageNum = 1;

      if (this.pagesTexture && this.pagesTextureFile !== undefined && (this.pagesTextureUrl === undefined || this.pagesTextureFileChanged)) {
        this.loadPagesTexture();
      }

      let spacer = document.createElement('div');
      spacer.className = 'document-pages-spacer';

      let pages = document.createElement('div');
      pages.appendChild(spacer);

      for (let i = 1; i < pagesRawInput.length; i++) {
        let page = document.createElement('div');
        page.classList.add('page');
        if (i % 2 === 0) {
          page.classList.add('is-inverted');
        }

        if (this.pagesTexture) page.classList.add('is-textured');
        if (this.notesTexture) page.classList.add('notes-are-textured');
        if (pagesOptions[i - 1] !== null) {
          let classNames = pagesOptions[i - 1].split(' ');
          for (let j = 0; j < classNames.length; j++) {
            if (classNames[j].length > 0) {
              page.classList.add(classNames[j]);
            }
          }
        }
        page.classList.add(this.theme);

        if (this.pagesTexture && this.pagesTextureUrl !== undefined) {
          page.style.backgroundImage = 'url(\'' + this.pagesTextureUrl + '\')';
        }

        if (!(pagesOptions[i - 1] !== null && pagesOptions[i - 1].includes('title'))) {
          let header = document.createElement('div');
          header.classList.add('page-header');

          let backgroundElement = document.createElement('div');
          backgroundElement.classList.add(this.theme);
          backgroundElement.classList.add('is-textured');

          header.appendChild(backgroundElement);

          page.appendChild(header);
        }

        let pxSpacer = document.createElement('div');
        pxSpacer.className = 'page-px-spacer';
        pxSpacer.innerText = '_';

        page.appendChild(pxSpacer);

        let currentIndex = 0;
        if (currentIndex < pagesRawInput[i].length) {
          let pageMarkdownContainer = document.createElement('div');
          let pageMarkdown = marked(pagesRawInput[i].substring(currentIndex, pagesRawInput[i].length));
          pageMarkdown.replace(preElementRegex, "<pre><code></code></pre><div class='page-px-spacer'>_</div>");
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
          footer.classList.add('page-footer');
          if (pageNum % 2 === 1) {
            footer.classList.add('is-odd');
          } else {
            footer.classList.add('is-even');
          }
          footer.dataset.page = pageNum;

          let backgroundElement = document.createElement('div');
          backgroundElement.classList.add(this.theme);
          backgroundElement.classList.add('is-textured');

          let pageNumberElement = document.createElement('p');
          pageNumberElement.classList.add(this.theme);
          pageNumberElement.classList.add('page-number');
          pageNumberElement.innerText = pageNum;

          footer.appendChild(backgroundElement);
          footer.appendChild(pageNumberElement);

          page.appendChild(footer);
        }

        pageNum++;
        pages.appendChild(page);
      }

      pages.appendChild(spacer.cloneNode(true));

      return pages.innerHTML;
    }
  },
  methods: {
    getPagesOptions: function (code) {
      const pageSplitOptionsRegex = /\\page(?:\[([\w -]*)\])?/g;
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
      let pagesContainer = this.$refs.pagesContainer;
      let pages = this.$refs.pages;

      if (this.oldZoom > this.zoom) {
        pagesContainer.scrollTo(0, (this.zoom * pagesContainer.scrollTop) / this.oldZoom);
      }

      if (this.zoom === 100) {
        pages.style['transform'] = '';
        //pages.style.zoom = '100%'; // firefox doesn't support this
      } else {
        pages.style['transform'] = 'scale(' + (this.zoom / 100).toFixed(2) + ')';
        //pages.style.zoom = (this.zoom).toFixed(2) + '%'; // firefox doesn't support this
      }

      if (this.zoom > this.oldZoom) {
        pagesContainer.scrollTo(0, (this.zoom * pagesContainer.scrollTop) / this.oldZoom);
      }

      this.checkOverflow();
    },
    checkOverflow: function () {
      let pagesContainer = this.$refs.pagesContainer;

      if (pagesContainer.clientWidth !== pagesContainer.scrollWidth) {
        if (!pagesContainer.classList.contains('document-overflow-fix')) {
          pagesContainer.classList.add('document-overflow-fix');
        }
      }
      else if (pagesContainer.classList.contains('document-overflow-fix')) {
        pagesContainer.classList.remove('document-overflow-fix');
      }
    },
    setDefaultPagesTexture: function () {
      this.$store.commit('document/setPagesTextureFile', undefined);
      this.pagesTextureUrl = undefined;
    },
    scrollToCursor: function () {
      this.$refs.pagesContainer.scrollTo(0, (this.pageHeight * this.editorCurrentPage + this.pageOffset) * (this.zoom / 100));
    },
    toggleDefaultTheme: function () {
      this.$store.commit('document/setTheme', 'theme-default');
    },
    toggleCthulhuTheme: function () {
      this.$store.commit('document/setTheme', 'theme-cthulhu');
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/modules/document.scss";
</style>
