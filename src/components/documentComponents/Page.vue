<template>
  <div :class="classList">
    <page-header v-if="headerVisible" :pageNumber="pageNumber" :pageTheme="pageTheme"></page-header>
    <div class="page-px-spacer">_</div>
    <div ref="pageContent"></div>
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

export default {
  name: 'Page',
  components: {
    PageHeader,
    PageFooter
  },
  props: ['pageNumber', 'pageTexturesEnabled', 'noteTexturesEnabled', 'pageOptions', 'pageTheme', 'textData'],
  data: function () {
    return {
      classList: [
        'page'
      ],
      headerVisible: true,
      footerVisible: true,

      createdComponents: [],

      PageParagraphClass: Vue.extend(PageParagraph),
      PageThematicBreakClass: Vue.extend(PageThematicBreak),
      PageHeadingClass: Vue.extend(PageHeading)
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
            break;
          }
          case 'table': {
            break;
          }
          case 'blockquote_start': {
            tokenStack.push('blockquote_start');
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
      


      // for (let token of tokens) {
      //   console.log(token);

      //   if (token.type === 'space') continue;
      //   if (token.type === 'paragraph') {
      //     let paragraph = new this.PageParagraphClass();
      //     paragraph.$slots.default = [token.text];
      //     paragraph.$mount();
      //     this.createdComponents.push(paragraph);
      //     this.$refs.pageContent.appendChild(paragraph.$el);
      //   }
      // }


    }
  }
};
</script>

<style lang="scss" scoped>
</style>
