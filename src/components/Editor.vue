<template>
  <div class="editor">
    <editor-toolbar
      @insertGreenNote="insertGreenNote"
      @insertBrownNote="insertBrownNote"
      @insertPurpleNote="insertPurpleNote"
      @insertNewspaperNote="insertNewspaperNote"
      @insertHandwrittenNote="insertHandwrittenNote"
      @insertPhbNote="insertPhbNote"
      @insertCocMonsterTable="insertCocMonsterTable"
      @insertRegularPage="insertRegularPage"
      @insertRelativeImage="insertRelativeImage"
      @insertAbsoluteImage="insertAbsoluteImage"
      @insertFullPageImage="insertFullPageImage"
      @insertColumnsPage="insertColumnsPage"
      @insertTitlePage="insertTitlePage"
      @insertColumnBreak="insertColumnBreak"
      @insertWideBlock="insertWideBlock"
      @insertVerticalSpacing="insertVerticalSpacing"
      @insertCustomTitlePageFont="insertCustomTitlePageFont"
      @insertCustomHeadersFont="insertCustomHeadersFont"
      @insertCustomNoteHeadersFont="insertCustomNoteHeadersFont"
      @insertCustomRegularTextFont="insertCustomRegularTextFont"
      @insertCustomNewspaperHeadersFont="insertCustomNewspaperHeadersFont"
      @insertCustomNewspaperTextFont="insertCustomNewspaperTextFont"
      @insertCustomHandwritingFont="insertCustomHandwritingFont"
      @syncFile="syncFile"
      @downloadGDrive="downloadGDrive"
      @uploadGDrive="uploadGDrive"
      @downloadFile="downloadFile"
      @uploadFile="uploadFile"
      @scrollToPage="scrollToPage"/>
    <codemirror :options="cmOptions" @input="codeChange" @cursorActivity="cursorPositionChange"></codemirror>
    <file-picker-modal ref="filePicker" title="File Picker" @downloadFile="downloadFileUsingProvider" @uploadFile="uploadFileUsingProvider"></file-picker-modal>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror';
import EditorToolbar from './EditorToolbar.vue';
import FilePickerModal from './FilePickerModal.vue';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/mode/overlay.js';
import 'codemirror/addon/selection/active-line.js';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import GoogleDriveProvider from '@/storageProviders/GoogleDriveProvider';

export default {
  name: 'EditorItem',
  components: {
    codemirror,
    EditorToolbar,
    FilePickerModal
  },
  data () {
    return {
      codeMirror: undefined,
      pageHeight: 1141.42,
      pageOffset: 40,
      currentLine: 0,
      currentPage: 0,
      cmOptions: {
        styleActiveLine: true,
        tabSize: 2,
        mode: 'homebrew-markdown',
        theme: 'custom',
        lineNumbers: true,
        lineWrapping: true
      },
      googleDrive: new GoogleDriveProvider(),
    };
  },
  computed: {
    ...mapGetters({
      pageLines: 'editor/pageLines',
      googleDriveFileId: 'editor/googleDriveFileId',
      googleDriveFileName: 'editor/googleDriveFileName',
      googleDriveParentId: 'editor/googleDriveParentId',
      rawCode: 'editor/rawCode',
      documentCurrentPage: 'document/currentPage',
    }),
  },
  beforeCreate: function () {
    CodeMirror.defineMode("homebrew-markdown", function(config, parserConfig) {
      var homebrewOverlay = {
        token: function(stream) {
          var ch;
          if (stream.match("\\page")) {
            while ((ch = stream.next()) != null && ch != "]") { continue; }
            return "pageLine";
          }
          while (stream.next() != null && !stream.match("\\page", false)) { continue; }
          return null;
        }
      };
      return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/x-markdown"), homebrewOverlay);
    });
  },
  mounted: function () {
    this.codeMirror = document.querySelector('.CodeMirror').CodeMirror;
  },
  methods: {
    codeChange: _.debounce(function (newCode) {
      let lines = [];
      let search = this.codeMirror.getSearchCursor('\\page');
      while (search.findNext()) {
        lines.push(search.from().line);
      }
      this.$store.commit('editor/pushPageLines', lines);
      this.$store.commit('editor/setRawCode', newCode);
    }, 500),
    cursorPositionChange: _.debounce(function (position) {
      this.currentLine = position.getCursor().line;
      this.currentPage = 0;
      if (this.pageLines.length > 1) {
        let i = 1;
        while(this.currentLine >= this.pageLines[i]) {
          this.currentPage++;
          i++;
        }
      }
      this.$store.commit('editor/setCurrentPage', this.currentPage);
    }, 200),
    getCursorPosition: function () {
      let codeMirrorDocument = this.codeMirror.getDoc();
      let cursor = codeMirrorDocument.getCursor();
      let position = {
        line: cursor.line,
        ch: cursor.position
      };
      return position;
    },
    insertData: function (data, position) {
      let codeMirrorDocument = this.codeMirror.getDoc();
      codeMirrorDocument.replaceRange(data, position);
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
    insertPhbNote: function () {
      let data = '<blockquote markdown="true" class="phbNote">\n##### header\n\nnote_content\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCocMonsterTable: function () {
      let data = '<div markdown="true" class="monsterTable cthulhu">\n>|Monster name|\n>|:-:|\n>\n>||||||\n>|:-:|:-:|:-:|:-:|:-:|\n>|**STR 55** |**CON 20** |**SIZ 50** |**INT 0**  |**POW 5**  |\n>|**DEX 15** |**MOV 5**  |-          |-          |**HP 7**   |\n>\n>|Weapons|Damage bonus|\n>|:-:|:-:|\n>|Knife 65%, **1d4**|**-**|\n>\n>|Skills|\n>|:-:|\n>|Sanity loss **1/1d6**|\n</div>';
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
      let data = '\\page[title]\n\n<div style="height: 350px;"></div>\n\n# Title\n\n##### Description\n';
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
    insertVerticalSpacing: function () {
      let data = '<div style="height: 350px;"></div>';
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
    },
    syncFile: async function () {
      if (this.googleDriveFileId) {
        if (!this.googleDrive.isSignedIn) {
          await this.googleDrive.authenticate();
        }
        this.googleDrive.updateFile(encodeURIComponent(this.rawCode), this.googleDriveFileId).then((response) => {
          if (response.status !== 200) {
            alert(response)
          }
        });
      } else {
        alert('file not selected!');
      }
    },
    downloadFileUsingProvider: async function () {
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }

      if (this.googleDriveFileId) {
        this.googleDrive.downloadFile(this.googleDriveFileId).then((response) => {
          if (response.status === 200) {
            this.codeMirror.setValue(decodeURIComponent(response.body));
          } else {
            alert(response);
          }
        });
      }
    },
    uploadFileUsingProvider: async function () {
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }

      if (this.googleDriveFileId) {
        this.googleDrive.updateFile(encodeURIComponent(this.rawCode), this.googleDriveFileId)
      } else if (this.googleDriveParentId) {
        this.googleDrive.uploadFile(this.googleDriveFileName, encodeURIComponent(this.rawCode), this.googleDriveParentId).then((response) => {
          if (response.status !== 200) {
            alert(response);
          } else {
            this.$store.commit('editor/set' + this.googleDrive.type + 'FileId', response.result.id);
          }
        });
      } else {
        this.googleDrive.uploadFile(this.googleDriveFileName, encodeURIComponent(this.rawCode)).then((response) => {
          if (response.status !== 200) {
            alert(response);
          } else {
            this.$store.commit('editor/set' + this.googleDrive.type + 'FileId', response.result.id);
          }
        });
      }
    },
    downloadGDrive: async function () {
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }

      this.$refs.filePicker.setProvider(this.googleDrive);
      this.$refs.filePicker.setDownloadMode();
      this.$refs.filePicker.show();
    },
    uploadGDrive: async function () {
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }

      this.$refs.filePicker.setProvider(this.googleDrive);
      this.$refs.filePicker.setUploadMode();
      this.$refs.filePicker.show();
    },
    downloadFile: function () {
      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(this.rawCode));
      element.setAttribute('download', 'homebrew.hmd');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    },
    uploadFile: function () {
      let element = document.createElement('input');
      element.setAttribute('type', 'file');
      element.style.display = 'none';
      document.body.appendChild(element);
      element.onchange = () => {
        var reader = new FileReader();
        reader.readAsText(element.files[0]);
        reader.onload = () => { 
          this.codeMirror.setValue(reader.result);
        };
        document.body.removeChild(element);
      };
      element.click();
    },
    scrollToPage: function () {
      if (this.pageLines[this.documentCurrentPage]) {
        this.codeMirror.scrollIntoView({line: this.pageLines[this.documentCurrentPage], char: 0}, 100);
        this.codeMirror.setCursor({line: this.pageLines[this.documentCurrentPage], ch: 0});
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/modules/codemirror.scss";
</style>
