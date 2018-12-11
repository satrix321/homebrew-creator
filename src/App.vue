<template>
  <div id="app">
    <div class="main">
      <split :gutterSize="10" class="splitter" @onDrag="splitDrag">
        <split-area class="split-editor" :size="50">
          <the-editor/>
        </split-area>
        <split-area class="split-document" :size="50">
          <the-document :eventBus="documentEventBus"/>
        </split-area>
      </split>
    </div>
  </div>
</template>

<script>
import TheEditor from '@/components/TheEditor';
import TheDocument from '@/components/TheDocument';
import Vue from 'vue';

export default {
  name: 'App',
  components: {
    TheEditor,
    TheDocument
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
@import "@/assets/scss/fonts.scss";
@import "@/assets/scss/print.scss";
body {
  margin: 0px;
  overflow-x: hidden;
}

.splitter {
  height: 100vh !important;
}
</style>