<template>
  <div ref="content">
  </div>
</template>

<script>
import parser from '@/modules/parser';

export default {
  name: 'PageHtml',
  props: {
    html: { type: String, required: true },
    theme: { type: String, required: true },
    noteTexturesEnabled: { type: Boolean, required: true }
  },
  data: function () {
    return {
      createdComponents: []
    };
  },
  mounted: function () {
    this.$refs.content.innerHTML = this.html;
    let markdownBlocks = this.$refs.content.querySelectorAll('[markdown="1"]');
    for (let block of markdownBlocks) {
      let result = parser(block.innerHTML, {
        theme: this.theme, 
        noteTexturesEnabled: this.noteTexturesEnabled
      });
      this.createdComponents = result.createdComponents;

      for (let component of this.createdComponents) {
        component.$mount();
      }

      block.innerHTML = '';
      for (let outputComponent of result.outputComponents) {
        block.appendChild(outputComponent.$el);
      }
    }
  },
  destroyed: function () {
    for (let i = 0; i < this.createdComponents.length; i++) {
      this.createdComponents[i].$destroy();
    }
    this.createdComponents = [];
  }
};
</script>

<style lang="scss" scoped>
</style>
