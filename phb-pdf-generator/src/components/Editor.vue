<template>
  <div class="editor">
    <!--<textarea :value="rawCode" @input="updateRawCode" wrap="on" spellcheck="false"></textarea>-->
    <codemirror :value="rawCode" :options="cmOptions" @input="onCmCodeChange"></codemirror>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror'

import '@/assets/print.css'
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/monokai.css'

import 'codemirror/mode/markdown/markdown.js'

import _ from 'lodash'

export default {
  name: 'Editor',
  components: {
    codemirror
  },
  data () {
    return {
      rawCode: '# header',
      cmOptions: {
        tabSize: 4,
        mode: 'text/markdown',
        theme: 'monokai',
        lineNumbers: true,
        styleActiveLine: true,
        lineWrapping: true
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
