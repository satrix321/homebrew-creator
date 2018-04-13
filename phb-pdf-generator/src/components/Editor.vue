<template>
  <div class="editor">
    <codemirror :value="rawCode" :options="cmOptions" @input="onCmCodeChange"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

import '@/assets/css/print.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js'

import 'vue-awesome/icons'
import Icon from 'vue-awesome/components/Icon'

import _ from 'lodash'

export default {
  name: 'Editor',
  components: {
    codemirror,
    Icon
  },
  data () {
    return {
      rawCode: '# header',
      cmOptions: {
        tabSize: 2,
        mode: 'text/x-markdown',
        theme: 'custom',
        lineNumbers: true,
        styleActiveLine: true,
        lineWrapping: true,
        highlightFormatting: true
      }
    }
  },
  methods: {
    onCmCodeChange: _.debounce(function (newCode) {
      this.rawCode = newCode
      this.$store.commit('setRawCode', newCode)
    }, 300)
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,500,700&subset=latin-ext');
.editor {
  height: 100vh;
}
.editor .CodeMirror {
  height: 100vh;
  width: 100%;
  margin: 0px;
  border: 0px;
  padding: 0px;
  resize: none;
  font-family: 'Fira Mono', monospace;
  font-size: 8pt;
}

/* CodeMirror Custom */
.cm-s-custom {
  font-size: 1em;
  line-height: 1.5em;
  font-family: 'Fira Mono', monospace;
  background: #2a2a2a;
  color: #ffffff;
}
.cm-s-custom .CodeMirror-lines {
  padding: 8px 0;
}
.cm-s-custom .CodeMirror-gutters {
  box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.5);
  -webkit-box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.5);
  background-color: #2a2a2a;
  padding-right: 10px;
  z-index: 3;
  border: none;
}
.cm-s-custom div.CodeMirror-cursor {
  border-left: 3px solid #ffffff;
}
.cm-s-custom .CodeMirror-activeline-background {
  background: #3E3D32;
}
.cm-s-custom .CodeMirror-selected {
  background: #237CC4;
}
.cm-s-custom .cm-comment {
  color: #B8FF9A;
}
.cm-s-custom .cm-string {
  color: #FF9F9A;
}
.cm-s-custom .cm-number {
  color: #66D9EF;
}
.cm-s-custom .cm-atom {
  color: #66D9EF;
}
.cm-s-custom .cm-variable {
  color: #A6E22E;
}
.cm-s-custom .cm-def {
  font-style: italic;
  color: #FD971F;
}
.cm-s-custom .cm-variable-2 {
  color: #F29C00;
}
.cm-s-custom .cm-property {
  color: #66D9EF;
}
.cm-s-custom .cm-keyword {
  color: null;
}
.cm-s-custom .cm-operator {
  color: null;
}
.cm-s-custom .CodeMirror-linenumber {
  color: #B8FF9A;
}
.cm-s-custom .cm-quote {
  color: #B8FF9A;
}
.cm-s-custom .cm-header {
  color: #66D9EF;
}
</style>
