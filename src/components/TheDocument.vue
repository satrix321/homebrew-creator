<template>
  <div class="document">
    <the-document-toolbar 
      @zoomChanged="zoomChanged"
      @scrollToCursor="scrollToCursor"
      @getPDF="getPDF"/>
    <div ref="pagesContainer" class="document-pages-container">
      <div @change="checkOverflow" ref="pages" class="document-pages">
        <spacer-item/>
        <page-item v-for="page in pages" :key="page.key"
          :pageNumber="page.pageNumber"
          :pageTexturesEnabled="page.pageTexturesEnabled"
          :noteTexturesEnabled="page.noteTexturesEnabled"
          :pageOptions="page.pageOptions"
          :pageTheme="page.pageTheme"
          :textData="page.textData"
          :columnCount="page.columnCount"
          :isTitlePage="page.isTitlePage"
        />
        <spacer-item/>
      </div>
    </div>
  </div>
</template>

<script>
import TheDocumentToolbar from '@/components/TheDocumentToolbar';
import SpacerItem from '@/components/documentComponents/SpacerItem';
import PageItem from '@/components/documentComponents/PageItem';
import _ from 'lodash';
import { mapGetters } from 'vuex';

import Vue from 'vue';

export default {
  name: 'TheDocument',
  components: {
    TheDocumentToolbar,
    SpacerItem,
    PageItem
  },
  data: function () {
    return {
      pageSplitRegex: /\\page(?:\[[\w -]*\])?/g,
      pages: []
    };
  },
  props: ['eventBus'],
  mounted: function () {
    // calculate current page on scroll
    let pagesContainer = this.$refs.pagesContainer;
    pagesContainer.onscroll = _.debounce(() => {
      let pageNumber = parseInt((pagesContainer.scrollTop / this.pageHeightPx) * (100 / this.zoom));
      this.$store.commit('document/setCurrentPageIndex', pageNumber);
    }, 100);

    if (this.eventBus) {
      this.eventBus.$on('resize', () => {
        this.checkOverflow();
      });

      this.eventBus.$on('onBeforePrint', () => {
        this.$store.commit('document/setDefaultZoom');
        this.zoomChanged();
      });
    } else {
      console.error('event bus (Main <-> Document) not instantiated');
    }
  },
  computed: {
    ...mapGetters({
      editorCurrentPageIndex: 'editor/currentPageIndex',

      rawCode: 'editor/rawCode',

      pageTexturesEnabled: 'document/pageTexturesEnabled',
      noteTexturesEnabled: 'document/noteTexturesEnabled',

      oldZoom: 'document/oldZoom',
      zoom: 'document/zoom',

      theme: 'document/theme',

      pageHeightPx: 'document/pageHeightPx',
      pageOffsetPx: 'document/pageOffsetPx'
    })
  },
  watch: {
    rawCode: function () { this.createPages(); },
    pageTexturesEnabled: function () { this.createPages(); },
    noteTexturesEnabled: function () { this.createPages(); },
    theme: function () { this.createPages(); }
  },
  methods: {
    createPages: function () {
      const pagesOptions = this.getPagesOptions(this.rawCode);
      const pagesRawInput = this.rawCode.split(this.pageSplitRegex);
      const numberOfPages = pagesRawInput.length - 1;

      while (numberOfPages < this.pages.length) {
        this.pages.pop();
      }

      let pageNumber = 1;
      while (pageNumber < pagesRawInput.length) {

        let columnCount = 1;
        let isTitlePage = false;
        if (pagesOptions[pageNumber - 1]) {
          let columnsOption = pagesOptions[pageNumber - 1].match(/columns-([0-9])/);
          if (columnsOption) {
            columnCount = Number(columnsOption[1]);
          }

          isTitlePage = pagesOptions[pageNumber - 1].match(/title/) ? true : false;
        }

        let page = {
          pageNumber: pageNumber,
          pageTexturesEnabled: this.pageTexturesEnabled,
          noteTexturesEnabled: this.noteTexturesEnabled,
          pageOptions: pagesOptions[pageNumber - 1],
          pageTheme: this.theme,
          textData: pagesRawInput[pageNumber].substring(0, pagesRawInput[pageNumber].length),
          columnCount: columnCount,
          isTitlePage: isTitlePage
        };
        page.key = JSON.stringify(page);

        if (!this.pages[pageNumber - 1] || this.pages[pageNumber - 1].key !== page.key) {
          Vue.set(this.pages, pageNumber - 1, page);
        }

        pageNumber++;
      }

      this.checkOverflow();
    },
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
    zoomChanged: function () {
      let pagesContainer = this.$refs.pagesContainer;
      let pages = this.$refs.pages;

      if (this.oldZoom > this.zoom) {
        pagesContainer.scrollTo(0, (this.zoom * pagesContainer.scrollTop) / this.oldZoom);
      }

      if (this.zoom === 100) {
        pages.style['transform'] = '';
      } else {
        pages.style['transform'] = 'scale(' + (this.zoom / 100).toFixed(2) + ')';
      }

      if (this.zoom > this.oldZoom) {
        pagesContainer.scrollTo(0, (this.zoom * pagesContainer.scrollTop) / this.oldZoom);
      }

      this.checkOverflow();
    },
    checkOverflow: function () {
      let pagesContainer = this.$refs.pagesContainer;
      if (pagesContainer) {
        if (pagesContainer.clientWidth < pagesContainer.scrollWidth) {
          if (!pagesContainer.classList.contains('document-overflow-fix')) {
            pagesContainer.classList.add('document-overflow-fix');
          }
        } else if (pagesContainer.classList.contains('document-overflow-fix')) {
          pagesContainer.classList.remove('document-overflow-fix');
        }
      }
    },
    scrollToCursor: function () {
      this.$refs.pagesContainer.scrollTo(0, (this.pageHeightPx * this.editorCurrentPageIndex + this.pageOffsetPx) * (this.zoom / 100));
    },
    getPDF: function () {
      window.print();
    }
  }
};
</script>

<style lang="scss">
.document {
  height: 100%;
  overflow: hidden;

  .document-pages-container {
    overflow-y: auto;
    height: calc(100vh - 30px);
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: rgb(204, 204, 204);

    &.document-overflow-fix {
      display: block;

      .document-pages {
        transform-origin: top left;
      }
    }

    .document-pages {
      transform-origin: top center;
      max-width: 21cm;
    }
  }
}
</style>
