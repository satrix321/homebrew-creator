<template>
  <div class="document">
    <document-toolbar 
      @zoomChanged="zoomChanged"
      @scrollToCursor="scrollToCursor"
      @getPDF="getPDF"/>
    <div ref="pagesContainer" class="document-pages-container">
      <div @change="checkOverflow" ref="pages" class="document-pages"></div>
    </div>
  </div>
</template>

<script>
import DocumentToolbar from '@/components/DocumentToolbar';
import _ from 'lodash';
import { mapGetters } from 'vuex';

import Vue from 'vue';
import Spacer from '@/components/documentComponents/Spacer';
import Page from '@/components/documentComponents/Page';

export default {
  name: 'DocumentItem',
  components: {
    DocumentToolbar
  },
  data: function () {
    return {
      createdComponents: [],

      SpacerClass: Vue.extend(Spacer),
      PageClass: Vue.extend(Page)
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
  watch: {
    rawCode: function () {
      while (this.createdComponents.length > 0) {
        let component = this.createdComponents.pop();
        component.$destroy();
        component.$el.remove();
      }

      if (this.$refs.pages) {
        const pageSplitRegex = /\\page(?:\[[\w -]*\])?/g;
        const preElementRegex = /<pre>[\w\W]*<code>[\w\W]*<\/code>[\w\W]*<\/pre>/g;

        let pagesOptions = this.getPagesOptions(this.rawCode);
        let pagesRawInput = this.rawCode.split(pageSplitRegex);

        if (this.pageTexturesEnabled && this.pageTextureFile !== undefined && this.pageTextureFileChanged) {
          this.loadPagesTexture();
        }

        let pages = document.createElement('div');

        let spacerComponent = new this.SpacerClass();
        spacerComponent.$mount();
        this.createdComponents.push(spacerComponent);
        pages.appendChild(spacerComponent.$el);

        for (let pageNumber = 1; pageNumber < pagesRawInput.length; pageNumber++) {
          let page = new this.PageClass({
            propsData: { 
              pageNumber: pageNumber,
              pageTexturesEnabled: this.pageTexturesEnabled,
              noteTexturesEnabled: this.noteTexturesEnabled,
              pageOptions: pagesOptions[pageNumber - 1],
              pageTheme: this.theme,
              textData: pagesRawInput[pageNumber].substring(0, pagesRawInput[pageNumber].length)
            }
          });
          page.$slots.default = [ 'Click me!' ];
          page.$mount();
          this.createdComponents.push(page);
          pages.appendChild(page.$el);
        }

        spacerComponent = new this.SpacerClass();
        spacerComponent.$mount();
        this.createdComponents.push(spacerComponent);
        pages.appendChild(spacerComponent.$el);
        
        this.$refs.pages.innerHTML = pages.innerHTML;
      }
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
@import "@/assets/scss/modules/document.scss";
</style>
