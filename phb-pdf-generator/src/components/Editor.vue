<template>
  <div class="editorContainer">
    <div class="editorToolbar">
      <div class="dropdown">
        <button class="btn"><Icon name="header"></Icon> Headers</button>
        <div class="dropdownContent">
          <button class="btn" v-on:click="insertHeader1"><Icon name="header"></Icon> Header 1</button>
          <button class="btn" v-on:click="insertHeader2"><Icon name="header"></Icon> Header 2</button>
          <button class="btn" v-on:click="insertHeader3"><Icon name="header"></Icon> Header 3</button>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn"><Icon name="sticky-note"></Icon> Notes</button>
        <div class="dropdownContent">
          <button class="btn" v-on:click="insertGreenNote"><Icon style="color: rgb(218, 230, 191);" name="sticky-note"></Icon> Green</button>
          <button class="btn" v-on:click="insertBrownNote"><Icon style="color: rgb(220, 207, 172);" name="sticky-note"></Icon> Brown</button>
          <button class="btn" v-on:click="insertPurpleNote"><Icon style="color: rgb(231, 227, 239);" name="sticky-note"></Icon> Purple</button>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn"><Icon name="table"></Icon> Tables</button>
        <div class="dropdownContent">
          <button class="btn" v-on:click="insertCocMonsterTable"><Icon name="table"></Icon> CoC - Monster Table</button>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn"><Icon name="list"></Icon> Lists</button>
        <div class="dropdownContent">
          <button class="btn" v-on:click="insertOrderedList"><Icon name="list-ol"></Icon> Ordered List</button>
          <button class="btn" v-on:click="insertUnorderedList"><Icon name="list-ul"></Icon> Unordered List</button>
        </div>
      </div>
      <div class="dropdown">
        <button class="btn"><Icon name="file"></Icon> Pages</button>
        <div class="dropdownContent">
          <button class="btn" v-on:click="insertPageBreak"><Icon name="file"></Icon> Page Break</button>
        </div>
      </div>
    </div>
    <div class="editor">
      <codemirror :value="rawCode" :options="cmOptions" @input="onCmCodeChange"></codemirror>
    </div>
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
      rawCode: '',
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
    }, 300),
    insertHeader1: function () {
      var data = '# Header'
      this.insertData(data, this.getCursorPosition())
    },
    insertHeader2: function () {
      var data = '## Header'
      this.insertData(data, this.getCursorPosition())
    },
    insertHeader3: function () {
      var data = '### Header'
      this.insertData(data, this.getCursorPosition())
    },
    insertGreenNote: function () {
      var data = '> ##### Header\n>\n> Example text.'
      this.insertData(data, this.getCursorPosition())
    },
    insertBrownNote: function () {
      var data = '>> ##### Header\n>>\n>> Example text.'
      this.insertData(data, this.getCursorPosition())
    },
    insertPurpleNote: function () {
      var data = '>>> ##### Header\n>>>\n>>> Example text.'
      this.insertData(data, this.getCursorPosition())
    },
    insertCocMonsterTable: function () {
      var data = '___\n>|Monster name|\n>|:-:|\n>___\n>||||||\n>|:-:|:-:|:-:|:-:|:-:|\n>|**STR 55** |**CON 20** |**SIZ 50** |**INT 0**  |**POW 5**  |\n>|**DEX 15** |**MOV 5**  |-          |-          |**HP 7**   |\n>___\n>|Weapons|Damage bonus|\n>|:-:|:-:|\n>|Knife 65%, **1d4**|**-**|\n>___\n>|Skills|\n>|:-:|\n>|Sanity loss **1/1d6**|'
      this.insertData(data, this.getCursorPosition())
    },
    insertOrderedList: function () {
      var data = '1. Item\n2. Item\n3. Item'
      this.insertData(data, this.getCursorPosition())
    },
    insertUnorderedList: function () {
      var data = '- Item\n- Item\n- Item'
      this.insertData(data, this.getCursorPosition())
    },
    insertPageBreak: function () {
      var data = '\\page'
      this.insertData(data, this.getCursorPosition())
    },
    getCursorPosition: function () {
      var codeMirror = document.getElementsByClassName('CodeMirror')[0].CodeMirror
      var codeMirrorDocument = codeMirror.getDoc()
      var cursor = codeMirrorDocument.getCursor()
      var position = {
        line: cursor.line,
        ch: cursor.position
      }
      return position
    },
    insertData: function (data, position) {
      var codeMirror = document.getElementsByClassName('CodeMirror')[0].CodeMirror
      var codeMirrorDocument = codeMirror.getDoc()
      codeMirrorDocument.replaceRange(data, position)
    }
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css?family=Fira+Mono:400,500,700&subset=latin-ext');
.editorContainer {
  height: 100%;
}
.editorContainer .CodeMirror {
  height: calc(100vh - 30px);
  width: 100%;
  margin: 0px;
  border: 0px;
  padding: 0px;
  resize: none;
  font-family: 'Fira Mono', monospace;
  font-size: 8pt;
}

/* Editor toolbar */
.editorToolbar {
  height: 30px;
  width: 100%;
  background-color: rgb(65,65,65);
}
.editorToolbar .btn {
  height: 30px;
  border: 0;
  padding: 0 8px 0 8px;
  color: white;
  background-color: rgb(75,75,75);
  outline: none;
  float: left;
  font-family: 'Fira Mono', monospace;
  font-size: 9pt;
}
.editorToolbar .btn:hover {
  background-color: rgb(115, 115, 115);
  cursor: pointer;
}
.editorToolbar .btn::-moz-focus-inner {
   border: 0;
}
.editorToolbar .btn:active {
  background-color: rgb(95,95,95);
  padding: 0 8px 0 8px;
}
.editorToolbar > .dropdown {
  float: left;
}
.editorToolbar > .dropdown > .dropdownContent,
.editorToolbar > .dropdown > .dropdownContent > .dropdown > .dropdownContent {
  display: none;
  position: absolute;
  background-color: rgb(65,65,65);
  box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
  z-index: 10;
  top: 30px;
  float: none;
  overflow: visible;
}
.editorToolbar > .dropdown > .dropdownContent > .dropdown > .dropdownContent {
  left: 30px;
  width: auto;
}
.editorToolbar > .dropdown > .dropdownContent > .btn {
  float: none;
  display: block;
  width: 100%;
  text-align: left;
}
.editorToolbar > .dropdown:hover > .dropdownContent,
.editorToolbar > .dropdown:hover > .dropdownContent > .dropdown:hover > .dropdownContent {
  display: block;
}
.editorToolbar .btn svg {
  vertical-align: middle;
}

/* CodeMirror Custom */
.cm-s-custom {
  font-size: 1em;
  line-height: 1.5em;
  font-family: 'Fira Mono', monospace;
  background: #2a2a2a !important;
  color: #ffffff !important;
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
