<template>
  <div class="page" :class="classList">
    <page-header v-if="headerVisible" :pageNumber="pageNumber" :pageTheme="pageTheme"></page-header>
    <div class="page__content" ref="pageContent"></div>
    <page-footer v-if="footerVisible" :pageNumber="pageNumber" :pageTheme="pageTheme"></page-footer>
  </div>
</template>

<script>
import parser from '@/modules/parser';

import PageHeader from '@/components/documentComponents/PageHeader';
import PageFooter from '@/components/documentComponents/PageFooter';

export default {
  name: 'PageItem',
  components: {
    PageHeader,
    PageFooter
  },
  props: {
    pageNumber: { type: Number, required: true },
    pageTexturesEnabled: { type: Boolean, required: true },
    noteTexturesEnabled: { type: Boolean, required: true },
    pageTheme: { type: String, required: true },
    textData: { type: String, required: true },
    pageOptions: { type: String, required: false },
    columnCount: { type: Number, required: true },
    isTitlePage: { type: Boolean, required: true }
  },
  data: function () {
    return {
      classList: [],

      headerVisible: true,
      footerVisible: true,

      createdComponents: []
    };
  },
  created: function () {
    if (this.pageTexturesEnabled) { this.classList.push('page--is-textured'); }
    this.classList.push(this.pageTheme);
    if (this.pageOptions) {
      let classNames = this.pageOptions.split(' ');
      this.classList.push(classNames);
      if (classNames.includes('title')) {
        this.headerVisible = false;
        this.footerVisible = false;
      }
    }
  },
  mounted: function () {
    this.compileMarkdown();
  },
  beforeDestroy: function () {
    while (this.createdComponents.length > 0) {
      let component = this.createdComponents.pop();
      component.$destroy();
      component.$el.remove();
    }
  },
  methods: {
    countOccurrences: function (array, item) {
      let occurrences = 0;
      for (let value of array) {
        if (value === item) {
          occurrences++;
        }
      }
      return occurrences;
    },
    compileMarkdown: function () {
      for (let i = 0; i < this.createdComponents.length; i++) {
        this.createdComponents[i].$destroy();
      }
      this.createdComponents = [];

      let result = parser(this.textData, { 
        theme: this.pageTheme,
        noteTexturesEnabled: this.noteTexturesEnabled,
        columnCount: this.columnCount,
        isTitlePage: this.isTitlePage
      });
      this.createdComponents = result.createdComponents;

      for (let component of this.createdComponents) {
        component.$mount();
      }

      for (let outputComponent of result.outputComponents) {
        this.$refs.pageContent.appendChild(outputComponent.$el);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.page {
  position: relative;
  margin-bottom: 0.5cm;
  box-shadow: 0 0 0.5cm rgba(0, 0, 0, 0.5);
  background-color: $page-background-color;
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  width: 21cm;
  height: 29.7cm;
  padding: 1cm;
  
  /deep/ * {
    margin-top: 0 !important;
  }

  .page__content {
    /deep/ .page-wide-block {
      column-span: all;
      -webkit-column-span: all;
    }
  }

  &.theme--cthulhu-1:not(.title) {
    padding-top: 1.6cm;
  }
  &.theme--cthulhu-2:not(.title) {
    padding-top: 2.5cm;
    padding-left: 1.5cm;
    padding-right: 1.5cm;
    padding-bottom: 2cm;
  }

  &.page--is-textured {
    background-size: 100% 100%;

    &.theme--default {
      background-image: url('../../assets/images/texture_02.jpg');
    }

    &.theme--cthulhu-1 {
      background-image: url('../../assets/images/texture_cthulhu_01.jpg');
    }

    &.theme--cthulhu-2 {
      background-image: url('../../assets/images/texture_cthulhu_02.jpg');
    }

    &.page--page--is-inverted {
      &.theme--default {
        background-image: url('../../assets/images/texture_02.jpg');
      }

      &.theme--cthulhu-1 {
        background-image: url('../../assets/images/texture_cthulhu_01_inverted.jpg');
      }

      &.theme--cthulhu-2 {
        background-image: url('../../assets/images/texture_cthulhu_02_inverted.jpg');
      }
    }
  }

  &.columns-2,
  &.columns-3 {
    .page__content {
      column-fill: auto;
      -webkit-column-gap: 16px;
      -moz-column-gap: 16px;
      column-gap: 16px;  
    }
  }

  &.columns-2 .page__content {
    -moz-column-count: 2 !important;
    -webkit-column-count: 2 !important;
    column-count: 2 !important;
  }

  &.columns-3 .page__content {
    -moz-column-count: 3 !important;
    -webkit-column-count: 3 !important;
    column-count: 3 !important;
  }

  .page__content {
    height: 100%;
  }
}

@media print {
  .page {
    box-shadow: none !important;
    -webkit-box-shadow: none !important;
    margin: 0 !important;
    position: relative !important;
    box-shadow: none !important;
    page-break-after: always !important;
    overflow-x: auto !important;
  }
}
</style>
