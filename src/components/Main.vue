<template>
  <div class="main">
    <split :gutterSize="10" style="height: 100vh;" @onDrag="splitDrag">
      <split-area class="split-editor" :size="50">
        <editor-item/>
      </split-area>
      <split-area class="split-document" :size="50">
        <document-item :eventBus="documentEventBus"/>
      </split-area>
    </split>
  </div>
</template>

<script>
import EditorItem from '@/components/Editor';
import DocumentItem from '@/components/Document';
import Vue from 'vue';

export default {
  name: 'Main',
  components: {
    EditorItem,
    DocumentItem
  },
  data: function () {
    return {
      documentEventBus: new Vue()
    };
  },
  created: function () {
    window.addEventListener('resize', this.windowResized);
    window.onbeforeprint = this.onBeforePrint;
  },
  methods: {
    splitDrag: function () {
      this.documentEventBus.$emit('resize');
    },
    windowResized: function () {
      this.documentEventBus.$emit('resize');
    },
    onBeforePrint: function () {
      this.documentEventBus.$emit('onBeforePrint');
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/base/fonts.scss";
@import "@/assets/scss/base/print.scss";
</style>