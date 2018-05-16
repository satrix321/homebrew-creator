<template>
  <div class="editorContainer">
    <editor-toolbar
      @insertHeader1="insertHeader1"
      @insertHeader2="insertHeader2"
      @insertHeader3="insertHeader3"
      @insertGreenNote="insertGreenNote"
      @insertBrownNote="insertBrownNote"
      @insertPurpleNote="insertPurpleNote"
      @insertNewspaperNote="insertNewspaperNote"
      @insertHandwrittenNote="insertHandwrittenNote"
      @insertCocMonsterTable="insertCocMonsterTable"
      @insertOrderedList="insertOrderedList"
      @insertUnorderedList="insertUnorderedList"
      @insertRegularPage="insertRegularPage"
      @insertRelativeImage="insertRelativeImage"
      @insertAbsoluteImage="insertAbsoluteImage"
      @insertFullPageImage="insertFullPageImage"
      @insertColumnsPage="insertColumnsPage"
      @insertTitlePage="insertTitlePage"
      @insertColumnBreak="insertColumnBreak"
      @insertWideBlock="insertWideBlock"
      @insertCustomTitlePageFont="insertCustomTitlePageFont"
      @insertCustomHeadersFont="insertCustomHeadersFont"
      @insertCustomNoteHeadersFont="insertCustomNoteHeadersFont"
      @insertCustomRegularTextFont="insertCustomRegularTextFont"
      @insertCustomNewspaperHeadersFont="insertCustomNewspaperHeadersFont"
      @insertCustomNewspaperTextFont="insertCustomNewspaperTextFont"
      @insertCustomHandwritingFont="insertCustomHandwritingFont"
      >
    </editor-toolbar>
    <div class="editor">
      <codemirror :value="rawCode" :options="cmOptions" @input="onCmCodeChange"></codemirror>
    </div>
  </div>
</template>

<script>
import { codemirror } from 'vue-codemirror';
import EditorToolbar from './EditorToolbar.vue';
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/markdown/markdown.js';
import _ from 'lodash';

export default {
  name: 'Editor',
  components: {
    codemirror,
    EditorToolbar
  },
  data () {
    return {
      rawCode: '\\page[columns]',
      cmOptions: {
        tabSize: 2,
        mode: 'text/x-markdown',
        theme: 'custom',
        lineNumbers: true,
        styleActiveLine: true,
        lineWrapping: true,
        highlightFormatting: true
      }
    };
  },
  methods: {
    onCmCodeChange: _.debounce(function (newCode) {
      this.rawCode = newCode;
      this.$store.commit('setRawCode', newCode);
    }, 300),
    getCursorPosition: function () {
      let codeMirror = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
      let codeMirrorDocument = codeMirror.getDoc();
      let cursor = codeMirrorDocument.getCursor();
      let position = {
        line: cursor.line,
        ch: cursor.position
      };
      return position;
    },
    insertData: function (data, position) {
      let codeMirror = document.getElementsByClassName('CodeMirror')[0].CodeMirror;
      let codeMirrorDocument = codeMirror.getDoc();
      codeMirrorDocument.replaceRange(data, position);
    },
    insertHeader1: function () {
      let data = '# Header';
      this.insertData(data, this.getCursorPosition());
    },
    insertHeader2: function () {
      let data = '## Header';
      this.insertData(data, this.getCursorPosition());
    },
    insertHeader3: function () {
      let data = '### Header';
      this.insertData(data, this.getCursorPosition());
    },
    insertGreenNote: function () {
      let data = '> ##### Header\n>\n> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertBrownNote: function () {
      let data = '>> ##### Header\n>>\n>> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertPurpleNote: function () {
      let data = '>>> ##### Header\n>>>\n>>> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertNewspaperNote: function () {
      let data = '<blockquote markdown="true" class="newspaperNote">\n##### headline\n\narticle_content\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertHandwrittenNote: function () {
      let data = '<blockquote markdown="true" class="handwrittenNote">\nnote_content\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCocMonsterTable: function () {
      let data = '<div markdown="true" class="monsterTable cthulhu">\n>|Monster name|\n>|:-:|\n>\n>||||||\n>|:-:|:-:|:-:|:-:|:-:|\n>|**STR 55** |**CON 20** |**SIZ 50** |**INT 0**  |**POW 5**  |\n>|**DEX 15** |**MOV 5**  |-          |-          |**HP 7**   |\n>\n>|Weapons|Damage bonus|\n>|:-:|:-:|\n>|Knife 65%, **1d4**|**-**|\n>\n>|Skills|\n>|:-:|\n>|Sanity loss **1/1d6**|\n</div>';
      this.insertData(data, this.getCursorPosition());
    },
    insertOrderedList: function () {
      let data = '1. Item\n2. Item\n3. Item';
      this.insertData(data, this.getCursorPosition());
    },
    insertUnorderedList: function () {
      let data = '- Item\n- Item\n- Item';
      this.insertData(data, this.getCursorPosition());
    },
    insertRegularPage: function () {
      let data = '\\page';
      this.insertData(data, this.getCursorPosition());
    },
    insertRelativeImage: function () {
      let data = '![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Image")';
      this.insertData(data, this.getCursorPosition());
    },
    insertAbsoluteImage: function () {
      let data = '<img class="absoluteImage" style="bottom: 1cm; right: 1cm;" src="https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png"/>';
      this.insertData(data, this.getCursorPosition());
    },
    insertFullPageImage: function () {
      let data = '<img class="absoluteImage fullPageImage" src="https://i.imgur.com/PNpQjCA.jpg"/>';
      this.insertData(data, this.getCursorPosition());
    },
    insertColumnsPage: function () {
      let data = '\\page[columns]';
      this.insertData(data, this.getCursorPosition());
    },
    insertTitlePage: function () {
      let data = '\\page[title]\n\n<div style="height: 350px;"></div>\n\n# Title\n\n##### Description';
      this.insertData(data, this.getCursorPosition());
    },
    insertColumnBreak: function () {
      let data = '```\n```';
      this.insertData(data, this.getCursorPosition());
    },
    insertWideBlock: function () {
      let data = '<div markdown="true" class="wideBlock">\nwide_block\n</div>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomTitlePageFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "titlePage";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomHeadersFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "headers";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomNoteHeadersFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "headers-blockquotes";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomRegularTextFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "regular-text";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomNewspaperHeadersFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "newspaper-headers";\n\tfont-style: normal;\n\tfont-weight: 700;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomNewspaperTextFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "newspaper-text";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCustomHandwritingFont: function () {
      let data = '<style>\n@font-face {\n\tfont-family: "handwriting";\n\tfont-style: normal;\n\tfont-weight: 400;\n\tsrc: local("Arial");}\n</style>';
      this.insertData(data, this.getCursorPosition());
    }
  }
};
</script>

<style lang="scss">
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
