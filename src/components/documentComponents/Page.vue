<template>
  <div :class="classList">
    <page-header v-if="headerVisible" :pageNumber="pageNumber" :pageTheme="pageTheme"></page-header>
    <div class="page-px-spacer"/>
    <div class="page-content" ref="pageContent"></div>
    <page-footer v-if="footerVisible" :pageNumber="pageNumber" :pageTheme="pageTheme"></page-footer>
  </div>
</template>

<script>
import marked from 'marked';

import PageHeader from '@/components/documentComponents/PageHeader';
import PageFooter from '@/components/documentComponents/PageFooter';

import Vue from 'vue';
import PageParagraph from '@/components/documentComponents/PageParagraph';
import PageThematicBreak from '@/components/documentComponents/PageThematicBreak';
import PageHeading from '@/components/documentComponents/PageHeading';
import PageColumnBreak from '@/components/documentComponents/PageColumnBreak';
import PageNote from '@/components/documentComponents/PageNote';
import PageTable from '@/components/documentComponents/PageTable';
import PageHtml from '@/components/documentComponents/PageHtml';
import PageList from '@/components/documentComponents/PageList';

export default {
  name: 'Page',
  components: {
    PageHeader,
    PageFooter
  },
  props: ['pageNumber', 'pageTexturesEnabled', 'noteTexturesEnabled', 'pageOptions', 'pageTheme', 'textData'],
  data: function () {
    return {
      classList: ['page'],

      headerVisible: true,
      footerVisible: true,

      createdComponents: [],

      PageParagraphClass: Vue.extend(PageParagraph),
      PageThematicBreakClass: Vue.extend(PageThematicBreak),
      PageHeadingClass: Vue.extend(PageHeading),
      PageColumnBreakClass: Vue.extend(PageColumnBreak),
      PageNoteClass: Vue.extend(PageNote),
      PageTableClass: Vue.extend(PageTable),
      PageHtmlClass: Vue.extend(PageHtml),
      PageListClass: Vue.extend(PageList)
    };
  },
  created: function () {
    if (this.pageNumber % 2 === 0) { this.classList.push('is-inverted'); }
    if (this.pageTexturesEnabled) { this.classList.push('is-textured'); }
    if (this.noteTexturesEnabled) { this.classList.push('notes-are-textured'); }
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

      let tokens = marked.lexer(this.textData);
      let tokenStack = [];
      let listTypes = [];
      let componentStack = [];
      componentStack.last = function () {
        if (this.length > 0) {
          return this[this.length - 1];
        }
        return undefined;
      };

      for (let token of tokens) {
        switch (token.type) {
          case 'space': {
            continue;
          }
          case 'hr': {
            let thematicBreak = new this.PageThematicBreakClass();
            this.createdComponents.push(thematicBreak);
            thematicBreak.$mount();
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(thematicBreak.$el);
            } else {
              componentStack.push(thematicBreak);
            }
            break;
          }
          case 'heading': {
            let heading = new this.PageHeadingClass({
              propsData: { depth: token.depth }
            });
            heading.$slots.default = [token.text];
            heading.$mount();
            this.createdComponents.push(heading);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(heading.$el);
            } else {
              componentStack.last().push(heading);
            }
            break;
          }
          case 'code': {
            let columnBreak = new this.PageColumnBreakClass();
            columnBreak.$mount();
            this.createdComponents.push(columnBreak);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(columnBreak.$el);
            } else {
              componentStack.last().push(columnBreak);
            }
            break;
          }
          case 'table': {
            let table = new this.PageTableClass({
              propsData: {
                headers: token.header,
                align: token.align,
                cells: token.cells
              }
            });
            table.$mount();
            this.createdComponents.push(table);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(table.$el);
            } else {
              componentStack.last().push(table);
            }
            break;
          }
          case 'blockquote_start': {
            if (tokenStack.length === 0 || tokenStack[tokenStack.length - 1] !== 'blockquote_start') {
              componentStack.push([]);
            }
            tokenStack.push('blockquote_start');
            break;
          }
          case 'blockquote_end': {
            let startOccurrences = this.countOccurrences(tokenStack, 'blockquote_start');
            if (startOccurrences > 1) {
              let endOccurrences = this.countOccurrences(tokenStack, 'blockquote_end') + 1;
              if (startOccurrences > endOccurrences) {
                tokenStack.push('blockquote_end');
                break;
              } else if (startOccurrences < endOccurrences) {
                console.error('blockquote tags error');
              }
            }

            let tokenPopCount = 0;
            while (tokenPopCount !== startOccurrences) {
              if (tokenStack[tokenStack.length - 1] === 'blockquote_start') {
                tokenPopCount++;
              }
              tokenStack.pop();
            }

            let noteType;
            switch (startOccurrences) {
              case 1: {
                noteType = 'note-primary';
                break;
              }
              case 2: {
                noteType = 'note-secondary';
                break;
              }
              case 3: {
                noteType = 'note-tertiary';
                break;
              }
            }

            let note = new this.PageNoteClass({
              propsData: { 
                noteType: noteType,
                components: componentStack.pop()
              }
            });

            note.$mount();
            this.createdComponents.push(note);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(note.$el);
            } else {
              componentStack.last().push(note);
            }

            break;
          }
          case 'list_start': {
            listTypes.push(token.ordered ? 'ordered' : 'unordered');
            tokenStack.push('list_start');
            componentStack.push([]);
            break;
          }
          case 'list_item_start': {
            tokenStack.push('list_item_start');
            break;
          }
          case 'list_item_end': {
            let tokenPopCount = 0;
            while (tokenPopCount !== 1) {
              if (tokenStack[tokenStack.length - 1] === 'list_item_start') {
                tokenPopCount++;
              }
              tokenStack.pop();
            }
            break;
          }
          case 'list_end': {
            let list = new this.PageListClass({
              propsData: {
                listType: listTypes.pop(),
                listComponents: componentStack.pop()
              }
            });

            let tokenPopCount = 0;
            while (tokenPopCount !== 1) {
              if (tokenStack[tokenStack.length - 1] === 'list_start') {
                tokenPopCount++;
              }
              tokenStack.pop();
            }

            list.$mount();
            this.createdComponents.push(list);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(list.$el);
            } else {
              componentStack.last().push(list);
            }
            break;
          }
          case 'html': {
            let htmlBlock = new this.PageHtmlClass({
              propsData: {
                html: token.text
              }
            });
            htmlBlock.$mount();
            this.createdComponents.push(htmlBlock);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(htmlBlock.$el);
            } else {
              componentStack.last().push(htmlBlock);
            }
            break;
          }
          case 'text' :
          case 'paragraph': {
            let paragraph = new this.PageParagraphClass({
              propsData: { text: token.text }
            });
            paragraph.$mount();
            this.createdComponents.push(paragraph);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(paragraph.$el);
            } else {
              componentStack.last().push(paragraph);
            }
            break;
          }
        }
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
  background-color: white;
  position: relative;
  box-sizing: border-box;
  z-index: 1;
  width: 21cm;
  height: 29.7cm;
  padding: 1cm;

  &.theme-cthulhu-1:not(.title) {
    padding-top: 1.6cm;
  }
  &.theme-cthulhu-2:not(.title) {
    padding-top: 2.5cm;
    padding-left: 1.5cm;
    padding-right: 1.5cm;
    padding-bottom: 2cm;
  }

  &.is-textured {
    background-size: 100% 100%;

    &.theme-default {
      background-image: url('../../assets/images/texture_02.jpg');
    }

    &.theme-cthulhu-1 {
      background-image: url('../../assets/images/texture_cthulhu_01.jpg');
    }

    &.theme-cthulhu-2 {
      background-image: url('../../assets/images/texture_cthulhu_02.jpg');
    }

    &.is-inverted {
      &.theme-default {
        background-image: url('../../assets/images/texture_02.jpg');
      }

      &.theme-cthulhu-1 {
        background-image: url('../../assets/images/texture_cthulhu_01_inverted.jpg');
      }

      &.theme-cthulhu-2 {
        background-image: url('../../assets/images/texture_cthulhu_02_inverted.jpg');
      }
    }
  }

  &.columns-2,
  &.columns-3 {
    .page-content {
      column-fill: auto;
      -webkit-column-gap: 16px;
      -moz-column-gap: 16px;
      column-gap: 16px;  
    }
  }

  &.columns-2 .page-content {
    -moz-column-count: 2 !important;
    -webkit-column-count: 2 !important;
    column-count: 2 !important;
  }

  &.columns-3 .page-content {
    -moz-column-count: 3 !important;
    -webkit-column-count: 3 !important;
    column-count: 3 !important;
  }
}
</style>
