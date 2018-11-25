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
      PageNoteClass: Vue.extend(PageNote)
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
      // const preElementRegex = /<pre>[\w\W]*<code>[\w\W]*<\/code>[\w\W]*<\/pre>/g;
      // let pageMarkdown = marked(this.textData);
      
      // pageMarkdown.replace(preElementRegex, '<pre><code></code></pre><div class=\'page-px-spacer\'>_</div>');
      // this.$refs.pageContent.innerHTML = pageMarkdown;

      // let elements = this.$refs.pageContent.querySelectorAll('*[markdown]');
      // for (let i = 0; i < elements.length; i++) {
      //   let innerHTML = elements[i].innerHTML.replace(/&gt;/g, '>');
      //   elements[i].innerHTML = marked(innerHTML);
      // }

      // let blockquotesLevel1 = this.$refs.pageContent.querySelectorAll(':scope > blockquote');
      // for (let i = 0; i < blockquotesLevel1.length; i++) {
      //   let blockquotesLevel2 = blockquotesLevel1[i].querySelectorAll(':scope > blockquote');
      //   if (blockquotesLevel2.length > 0) {
      //     for (let j = 0; j < blockquotesLevel2.length; j++) {
      //       let blockquotesLevel3 = blockquotesLevel2[j].querySelectorAll(':scope > blockquote');
      //       if (blockquotesLevel3.length > 0) {
      //         for (let k = 0; k < blockquotesLevel3.length; k++) {
      //           blockquotesLevel3[k].classList.add('note-tertiary');
      //         }
      //       } else {
      //         blockquotesLevel2[j].classList.add('note-secondary');
      //       }
      //     }
      //   } else {
      //     blockquotesLevel1[i].classList.add('note-primary');
      //   }
      // }

      let tokens = marked.lexer(this.textData);
      let tokenStack = [];

      console.table(tokens);

      let componentStack = [];
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
              componentStack.push(heading);
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
              componentStack.push(columnBreak);
            }
            break;
          }
          case 'table': {
            break;
          }
          case 'blockquote_start': {
            tokenStack.push('blockquote_start');
            break;
          }
          case 'blockquote_end': {
            let startOccurrences = this.countOccurrences(tokenStack, 'blockquote_start');
            if (startOccurrences > 1) {
              let endOccurrences = this.countOccurrences(tokenStack, 'blockquote_end') + 1;
              console.log(startOccurrences);
              console.log(endOccurrences);
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
                components: componentStack 
              }
            });

            note.$mount();
            this.createdComponents.push(note);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(note.$el);
            } else {
              componentStack.push(note);
            }

            break;
          }
          case 'list_start': {
            tokenStack.push('list_start');
            break;
          }
          case 'list_item_start': {
            tokenStack.push('list_item_start');
            break;
          }
          case 'html': {
            break;
          }
          case 'paragraph': {
            let paragraph = new this.PageParagraphClass();
            paragraph.$slots.default = [token.text];
            paragraph.$mount();
            this.createdComponents.push(paragraph);
            if (tokenStack.length === 0) {
              this.$refs.pageContent.appendChild(paragraph.$el);
            } else {
              componentStack.push(paragraph);
            }
            break;
          }
          case 'text': {
            break;
          }
        }
      }

    }
  }
};
</script>

<style lang="scss" scoped>
</style>
