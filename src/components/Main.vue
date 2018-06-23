<template>
  <div class="main">
    <Split ref="split1" :gutterSize="10" style="height: 100vh;" @onDrag="splitDrag">
      <SplitArea class="editorArea" :size="50">
        <Editor></Editor>
      </SplitArea>
      <SplitArea class="documentArea" :size="50">
        <Document :widthChange="widthChange"></Document>
      </SplitArea>
    </Split>
  </div>
</template>

<script>
import Editor from './Editor.vue';
import Document from './Document.vue';

export default {
  name: 'Main',
  components: {
    Editor,
    Document
  },
  data: function () {
    return {
      widthChange: false
    };
  },
  methods: {
    splitDrag: function () {
      this.widthChange = !this.widthChange;
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/fonts.scss";
@import "@/assets/scss/print.scss";
</style>