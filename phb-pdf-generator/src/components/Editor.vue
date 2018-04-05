<template>
  <div class="editor">
    <textarea :value="rawCode" @input="updateRawCode" wrap="on" spellcheck="false"></textarea>
  </div>
</template>

<script>
import '../assets/print.css'

import _ from 'lodash'

export default {
  name: 'Editor',
  data () {
    return {
      rawCode: '# header'
    }
  },
  methods: {
    updateRawCode: _.debounce(function (e) {
      this.rawCode = e.target.value
      this.$store.commit('setRawCode', e.target.value)
    }, 300)
  }
}
</script>

<style scoped>
.editor {
  height: 100vh;
}
.editor > textarea {
  height: 100vh;
  width: 100%;
  margin: 0px;
  border: 0px;
  padding: 0px;
  resize: none;
  background-color: rgb(65,65,65);
  color: rgb(240, 240, 240);
}
</style>
