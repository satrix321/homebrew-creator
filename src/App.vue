<template>
  <div id="app">
    <div class="main">
      <split ref="split" :gutterSize="10" class="splitter" @onDrag="splitDrag">
        <split-area class="split-editor" :size="startWidths[0]" :min-size="editorPanelMinWidth">
          <the-editor :eventBus="eventBus"/>
        </split-area>
        <split-area class="split-document" :size="startWidths[1]" :min-size="documentPanelMinWidth">
          <the-document :eventBus="eventBus"/>
        </split-area>
      </split>
    </div>
  </div>
</template>

<script>
import TheEditor from '@/components/TheEditor';
import TheDocument from '@/components/TheDocument';
import Vue from 'vue';

// Document panel min width needs to be defined here, otherwise the valuse inside the calc
// function would be undefined during the first calculation.
const editorPanelMinWidth = 300;
const documentPanelMinWidth = 530;

export default {
  name: 'App',
  components: {
    TheEditor,
    TheDocument
  },
  data: function () {
    return {
      eventBus: new Vue(),
      editorPanelMinWidth,
      documentPanelMinWidth,
      startWidths: this.calculatePanelWidths(),
    };
  },
  created: function () {
    window.addEventListener('resize', this.windowResized);
    window.addEventListener('beforeprint', this.onBeforePrint);
  },
  beforeDestroy: function () {
    window.removeEventListener('resize', this.windowResized);
    window.removeEventListener('beforeprint', this.onBeforePrint);
  },
  methods: {
    splitDrag: function () {
      this.eventBus.$emit('resize');
    },
    windowResized: function () {
      this.eventBus.$emit('resize');
      this.startWidths = this.calculatePanelWidths();
    },
    onBeforePrint: function () {
      this.eventBus.$emit('onBeforePrint');
    },
    calculatePanelWidths: function () {
      if (document.body.clientWidth * 0.5 >= documentPanelMinWidth) {
        return [50, 50];
      } else {
        let documentWidth = Math.round((documentPanelMinWidth / document.body.clientWidth) * 100);
        return [100 - documentWidth, documentWidth];
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/fonts.scss";
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  margin: 0px;
  overflow-x: hidden;
}

.splitter {
  height: 100vh !important;
}

@media print {
  @page {
    margin: 0;
  }
  body {
    margin: 0 !important;
    box-shadow: none !important;
    overflow-x: auto !important;
  }
  .split-editor {
    display: none !important;
    height: 0 !important;
    float: none !important;
  }
  .split-document {
    width: 100% !important;
    float: none !important;
  }
  .gutter.gutter-horizontal {
    display: none !important;
    height: 0 !important;
  }
  .split {
    overflow: visible !important;
  }
  ::-webkit-scrollbar {
    display: none;
  }
}
</style>