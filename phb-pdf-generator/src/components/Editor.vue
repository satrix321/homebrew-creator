<template>
  <div class="editor">
    <codemirror :value="rawCode" :options="cmOptions" @input="onCmCodeChange"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

import '@/assets/print.css'
import 'codemirror/lib/codemirror.css'
import '@/assets/codemirror-custom.css'
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
    updateRawCode: _.debounce(function (e) {
      this.rawCode = e.target.value
      this.$store.commit('setRawCode', e.target.value)
    }, 300),
    onCmCodeChange: function (newCode) {
      this.rawCode = newCode
      this.$store.commit('setRawCode', newCode)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Fira+Mono');
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
</style>
