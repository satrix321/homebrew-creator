<template>
  <div id="app">
    <div class="main">
      <the-loader />
      <split ref="split" :gutterSize="gutterSize" class="splitter" @onDrag="splitDrag">
        <split-area class="split-editor" :size="editor.percentWidth" :min-size="editor.minWidth">
          <the-editor :eventBus="eventBus" @switchView="switchToDocument"/>
        </split-area>
        <split-area class="split-document" :size="document.percentWidth" :min-size="document.minWidth">
          <the-document :eventBus="eventBus" @switchView="switchToEditor"/>
        </split-area>
      </split>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { displayBreakpoint, DISPLAY_STATE } from '@/modules/globals';
import TheEditor from '@/components/TheEditor';
import TheDocument from '@/components/TheDocument';
import TheLoader from '@/components/TheLoader';

export default {
  name: 'App',
  components: {
    TheEditor,
    TheDocument,
    TheLoader,
  },
  data() {
    return {
      eventBus: new Vue(),
      editor: {
        defaultMinWidth: 300,
        minWidth: 300,
        percentWidth: 50,
      },
      document: {
        defaultMinWidth: 540,
        minWidth: 540,
        percentWidth: 50,
      },
      gutterSize: 10,
      defaultGutterSize: 10,
    };
  },
  computed: {
    ...mapGetters({
      state: 'app/displayState',
    }),
  },
  created() {
    window.addEventListener('beforeprint', this.onBeforePrint);
    window.addEventListener('resize', this.windowResized);

    if (this.state === DISPLAY_STATE.EDITOR) {
      this.switchToEditor();
    } else {
      this.calculatePanelWidths();
    }
  },
  beforeDestroy() {
    window.removeEventListener('beforeprint', this.onBeforePrint);
    window.removeEventListener('resize', this.windowResized);
  },
  methods: {
    splitDrag() {
      this.eventBus.$emit('resize');
    },
    onBeforePrint() {
      this.eventBus.$emit('onBeforePrint');
    },
    windowResized() {
      this.eventBus.$emit('resize');
      const isMobile = document.body.clientWidth <= displayBreakpoint;

      if (isMobile) {
        if (this.state === DISPLAY_STATE.EDITOR_AND_DOCUMENT) {
          this.switchToEditor();
        }
      } else {
        this.$store.commit('app/setDisplayState', DISPLAY_STATE.EDITOR_AND_DOCUMENT);
        this.gutterSize = this.defaultGutterSize;
        this.editor.minWidth = this.editor.defaultMinWidth;
        this.document.minWidth = this.document.defaultMinWidth;
        this.calculatePanelWidths();
      }
    },
    calculatePanelWidths() {
      if (document.body.clientWidth * 0.5 >= this.document.minWidth) {
        this.editor.percentWidth = 50;
        this.document.percentWidth = 50;
      } else {
        const documentWidth = Math.round((this.document.minWidth / document.body.clientWidth) * 100);
        this.editor.percentWidth = 100 - documentWidth;
        this.document.percentWidth = documentWidth;
      }
    },
    switchToEditor() {
      this.gutterSize = 0;
      this.editor.minWidth = 0;
      this.document.minWidth = 0;
      this.$store.commit('app/setDisplayState', DISPLAY_STATE.EDITOR);
      this.editor.percentWidth = 100;
      this.document.percentWidth = 0;
    },
    switchToDocument() {
      this.gutterSize = 0;
      this.editor.minWidth = 0;
      this.document.minWidth = 0;
      this.$store.commit('app/setDisplayState', DISPLAY_STATE.DOCUMENT);
      this.editor.percentWidth = 0;
      this.document.percentWidth = 100;
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
  margin: 0;
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