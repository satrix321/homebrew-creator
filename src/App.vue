<template>
  <div id="app">
    <div class="main">
      <split ref="split" :gutterSize="gutterSize" class="splitter" @onDrag="splitDrag">
        <split-area class="split-editor" :size="startWidths[0]" :min-size="editorPanelMinWidth">
          <the-editor :eventBus="eventBus" @switchView="switchToDocument"/>
        </split-area>
        <split-area class="split-document" :size="startWidths[1]" :min-size="documentPanelMinWidth">
          <the-document :eventBus="eventBus" @switchView="switchToEditor"/>
        </split-area>
      </split>
    </div>
  </div>
</template>

<script>
import TheEditor from '@/components/TheEditor';
import TheDocument from '@/components/TheDocument';
import Vue from 'vue';
import { mapGetters } from 'vuex';
import { breakpoint, STATE_ENUM } from '@/modules/globals';

// Document panel min width needs to be defined here, otherwise the valuse inside the calc
// function would be undefined during the first calculation.
const editorPanelMinWidth = 300;
const documentPanelMinWidth = 540;
const defaultGutterSize = 10;

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
      gutterSize: defaultGutterSize,
      startWidths: [50, 50],
    };
  },
  computed: {
    ...mapGetters({
      state: 'app/state',
    }),
  },
  created: function () {
    window.addEventListener('beforeprint', this.onBeforePrint);
    window.addEventListener('resize', this.windowResized);

    if (this.state === STATE_ENUM.EDITOR) {
      this.switchToEditor();
    } else {
      this.startWidths = this.calculatePanelWidths();
    }
  },
  beforeDestroy: function () {
    window.removeEventListener('beforeprint', this.onBeforePrint);
    window.removeEventListener('resize', this.windowResized);
  },
  methods: {
    splitDrag: function () {
      this.eventBus.$emit('resize');
    },
    onBeforePrint: function () {
      this.eventBus.$emit('onBeforePrint');
    },
    windowResized: function () {
      this.eventBus.$emit('resize');
      let isMobile = document.body.clientWidth <= breakpoint;
      if (isMobile) {
        if (this.state === STATE_ENUM.DESKTOP) {
          this.switchToEditor();
        }
      } else {
        this.$store.commit('app/setState', STATE_ENUM.DESKTOP);
        this.gutterSize = defaultGutterSize;
        this.editorPanelMinWidth = editorPanelMinWidth;
        this.documentPanelMinWidth = documentPanelMinWidth;
        this.startWidths = this.calculatePanelWidths();
      }
    },
    calculatePanelWidths: function () {
      if (document.body.clientWidth * 0.5 >= documentPanelMinWidth) {
        return [50, 50];
      } else {
        let documentWidth = Math.round((documentPanelMinWidth / document.body.clientWidth) * 100);
        return [100 - documentWidth, documentWidth];
      }
    },
    switchToEditor: function () {
      this.gutterSize = 0;
      this.editorPanelMinWidth = 0;
      this.documentPanelMinWidth = 0;
      this.$store.commit('app/setState', STATE_ENUM.EDITOR);
      this.startWidths = [100, 0];
    },
    switchToDocument: function () {
      this.gutterSize = 0;
      this.editorPanelMinWidth = 0;
      this.documentPanelMinWidth = 0;
      this.$store.commit('app/setState', STATE_ENUM.DOCUMENT);
      this.startWidths = [0, 100];
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