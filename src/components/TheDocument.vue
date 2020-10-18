<template>
  <div class="document">
    <the-document-toolbar
      :eventBus="eventBus"
      @zoomChanged="zoomChanged"
      @scrollToCursor="scrollToCursor"
      @getPDF="getPDF"
      @switchView="switchView"
    />
    <div ref="pagesContainer" class="document__pages-container">
      <div @change="checkOverflow" ref="pages" class="document__pages">
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
      </div>
    </div>
  </div>
</template>

<script>
import TheDocumentToolbar from '@/components/TheDocumentToolbar';
import PageItem from '@/components/documentComponents/PageItem';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import { STATE_ENUM } from '@/modules/globals';

import Vue from 'vue';

export default {
  name: 'TheDocument',
  components: {
    TheDocumentToolbar,
    PageItem
  },
  data: function () {
    return {
      pageSplitRegex: /\\page(?:\[[\w -]*\])?/g,
      pages: []
    };
  },
  props: ['eventBus'],
  computed: {
    ...mapGetters({
      editorCurrentPageIndex: 'editor/currentPageIndex',

      rawCode: 'editor/rawCode',

      pageTexturesEnabled: 'document/pageTexturesEnabled',
      noteTexturesEnabled: 'document/noteTexturesEnabled',

      oldZoom: 'document/oldZoom',
      zoom: 'document/zoom',

      state: 'app/state',

      theme: 'document/theme',

      pageHeightPx: 'document/pageHeightPx',
      pageOffsetPx: 'document/pageOffsetPx'
    })
  },
  watch: {
    rawCode: function () { this.createPages(); },
    pageTexturesEnabled: function () { this.createPages(); },
    noteTexturesEnabled: function () { this.createPages(); },
    theme: function () { this.createPages(); },
    state: function () {
      if (this.state === STATE_ENUM.DOCUMENT || this.state === STATE_ENUM.DESKTOP) {
        this.checkOverflow();
      }
    }
  },
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

    this.createPages();
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
          pagesContainer.classList.add('document__pages-container--overflow-fix');
        } else {
          pagesContainer.classList.remove('document__pages-container--overflow-fix');
        }
      }
    },
    scrollToCursor: function () {
      this.$refs.pagesContainer.scrollTo(0, (this.pageHeightPx * this.editorCurrentPageIndex + this.pageOffsetPx) * (this.zoom / 100));
    },
    getPDF: function () {
      window.print();
    },
    switchView: function () {
      this.$emit('switchView');
    }
  }
};
</script>

<style lang="scss">
.document {
  height: 100%;
  overflow: hidden;

  .document__pages-container {
    overflow-y: auto;
    height: calc(100vh - 30px);
    width: 100%;
    display: flex;
    justify-content: center;
    background-color: $document-pages-container-background-color;

    &.document__pages-container--overflow-fix {
      display: block;

      .document__pages {
        transform-origin: top left;
      }
    }

    .document__pages {
      transform-origin: top center;
      max-width: 21cm;
    }
  }
}

@media print {
  .document {
    overflow: visible !important;

    .document__pages-container {
      display: block !important;
      overflow-y: visible !important;
    }
  }
}
</style>
