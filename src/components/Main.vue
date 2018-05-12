<template>
  <div class="main">
    <Split ref="split1" :gutterSize="10" style="height: 100vh;">
      <SplitArea class="editorArea" :size="50">
        <Editor></Editor>
      </SplitArea>
      <SplitArea class="documentArea" :size="50">
          <Document></Document>
      </SplitArea>
    </Split>
  </div>
</template>

<script>
import '@/assets/css/print.css';

import Editor from './Editor.vue';
import Document from './Document.vue';

export default {
  name: 'Main',
  components: {
    Editor,
    Document
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
$blueprint-grid-columns: 3;
</style>