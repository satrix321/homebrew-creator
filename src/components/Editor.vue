<template>
  <div class="editor">
    <div ref="progress" class="progress"><i class="progress-icon fas fa-spinner fa-5x"></i></div>
    <editor-toolbar
      @insertPrimaryNote="insertPrimaryNote"
      @insertSecondaryNote="insertSecondaryNote"
      @insertTertiaryNote="insertTertiaryNote"
      @insertNewspaperNote="insertNewspaperNote"
      @insertHandwrittenNote="insertHandwrittenNote"
      @insertPhbNote="insertPhbNote"
      @insertCocStatTable="insertCocStatTable"
      @insertRegularPage="insertRegularPage"
      @insertRelativeImage="insertRelativeImage"
      @insertAbsoluteImage="insertAbsoluteImage"
      @insertFullPageImage="insertFullPageImage"
      @insertTwoColumnPage="insertTwoColumnPage"
      @insertThreeColumnPage="insertThreeColumnPage"
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
      currentLineNumber: 0,
      currentPageNumber: 0,
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
      documentCurrentPageNumber: 'document/currentPageNumber',
      theme: 'document/theme'
    }),
  },
  beforeCreate: function () {
    CodeMirror.defineMode('homebrew-markdown', function(config, parserConfig) {
      var homebrewOverlay = {
        token: function(stream) {
          var ch;
          if (stream.match('\\page')) {
            while ((ch = stream.next()) != null && ch != ']') { continue; }
            return 'pageLine';
          }
          while (stream.next() != null && !stream.match('\\page', false)) { continue; }
          return null;
        }
      };
      return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || 'text/x-markdown'), homebrewOverlay);
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
      this.currentLineNumber = position.getCursor().line;
      this.currentPageNumber = 0;
      if (this.pageLines.length > 1) {
        let i = 1;
        while(this.currentLineNumber >= this.pageLines[i]) {
          this.currentPageNumber++;
          i++;
        }
      }
      this.$store.commit('editor/setCurrentPageNumber', this.currentPageNumber);
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
    insertPrimaryNote: function () {
      let data = '> ##### Header\n>\n> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertSecondaryNote: function () {
      let data = '>> ##### Header\n>>\n>> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertTertiaryNote: function () {
      let data = '>>> ##### Header\n>>>\n>>> Example text.';
      this.insertData(data, this.getCursorPosition());
    },
    insertNewspaperNote: function () {
      let data = '<blockquote markdown="true" class="note-newspaper">\n# headline\n\narticle_content\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertHandwrittenNote: function () {
      let data = '<blockquote markdown="true" class="note-handwritten">\nHandwritten note\n\n<p style="float: right;">John Doe</p>\n<div style="clear: both;"/>\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertPhbNote: function () {
      let data = '<blockquote markdown="true" class="note-phb">\n##### header\n\nnote_content\n</blockquote>';
      this.insertData(data, this.getCursorPosition());
    },
    insertCocStatTable: function () {
      let data = '<div markdown="true" class="table-stat table-stat-cthulhu">\n>|JOSH WINSCOTT, *damned by his legacy*|\n>|-|\n>\n>||||||\n>|-|-|-|-|-|\n>|**STR** 00|**CON** 00|**SIZ** 00|**DEX** 00|**INT** 00|\n>|**APP** 00|**POW** 00|**EDU** 00|**SAN** 00|**HP** 00|\n>|**DB** 0|**Build** 0|**Move** 0|**MP** 00|-|\n>\n>|*Combat*||\n>|-|-|\n>|Knife|00% (00/00), damage **0**|\n>|Dodge|00% (00/00)|\n>\n>|*Skills*|\n>|-|\n>|Climb 00%, Credit Rating 00%, Fast Talk 00%, History 00%, Jump 00%, Library Use 00%, Occult 00%.|\n>|**Languages:** English 00%, French 00%.|\n</div>';
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
      let data = '<img class="page-image-absolute" style="bottom: 1cm; right: 1cm;" src="https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png"/>';
      this.insertData(data, this.getCursorPosition());
    },
    insertFullPageImage: function () {
      let data = '<img class="page-image-fullpage" src="https://i.imgur.com/PNpQjCA.jpg"/>';
      this.insertData(data, this.getCursorPosition());
    },
    insertTwoColumnPage: function () {
      let data = '\\page[columns-2]';
      this.insertData(data, this.getCursorPosition());
    },
    insertThreeColumnPage: function () {
      let data = '\\page[columns-3]';
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
      let data = '<div markdown="true" class="page-wide-block">\nwide_block\n</div>';
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
        this.$refs.progress.classList.add('is-visible');

        if (!this.googleDrive.isSignedIn) {
          await this.googleDrive.authenticate();
        }

        let data = {};
        data.data = this.rawCode;
        data.theme = this.theme;

        this.googleDrive.updateFile(encodeURIComponent(JSON.stringify(data)), this.googleDriveFileId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            }
            this.$refs.progress.classList.remove('is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('is-visible');
          });

      } else {
        alert('file not selected!');
      }
    },
    downloadFileUsingProvider: async function () {
      if (this.googleDriveFileId) {
        this.$refs.progress.classList.add('is-visible');

        if (!this.googleDrive.isSignedIn) {
          await this.googleDrive.authenticate();
        }

        this.googleDrive.downloadFile(this.googleDriveFileId)
          .then((response) => {
            if (response.status === 200) {
              let data = JSON.parse(decodeURIComponent(response.body));
              this.codeMirror.setValue(data.data);
              this.$store.commit('document/setTheme', data.theme);
            } else {
              alert(response);
            }
            this.$refs.progress.classList.remove('is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('is-visible');
          });
      }
    },
    uploadFileUsingProvider: async function () {
      this.$refs.progress.classList.add('is-visible');

      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }

      let data = {};
      data.data = this.rawCode;
      data.theme = this.theme;

      if (this.googleDriveFileId) {
        this.googleDrive.updateFile(encodeURIComponent(JSON.stringify(data)), this.googleDriveFileId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            }
            this.$refs.progress.classList.remove('is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('is-visible');
          });
      } else if (this.googleDriveParentId) {
        this.googleDrive.uploadFile(this.googleDriveFileName, encodeURIComponent(JSON.stringify(data)), this.googleDriveParentId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            } else {
              this.$store.commit('editor/set' + this.googleDrive.type + 'FileId', response.result.id);
            }
            this.$refs.progress.classList.remove('is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('is-visible');
          });
      } else {
        this.googleDrive.uploadFile(this.googleDriveFileName, encodeURIComponent(JSON.stringify(data)))
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            } else {
              this.$store.commit('editor/set' + this.googleDrive.type + 'FileId', response.result.id);
            }
            this.$refs.progress.classList.remove('is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('is-visible');
          });
      }
    },
    downloadGDrive: async function () {
      this.$refs.progress.classList.add('is-visible');
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }
      this.$refs.filePicker.setProvider(this.googleDrive);
      this.$refs.filePicker.setDownloadMode();
      this.$refs.filePicker.show();
      this.$refs.progress.classList.remove('is-visible');
    },
    uploadGDrive: async function () {
      this.$refs.progress.classList.add('is-visible');
      if (!this.googleDrive.isSignedIn) {
        await this.googleDrive.authenticate();
      }
      this.$refs.filePicker.setProvider(this.googleDrive);
      this.$refs.filePicker.setUploadMode();
      this.$refs.filePicker.show();
      this.$refs.progress.classList.remove('is-visible');
    },
    downloadFile: function () {
      let data = {};
      data.data = this.rawCode;
      data.theme = this.theme;

      let element = document.createElement('a');
      element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
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
          let data = JSON.parse(reader.result);
          this.codeMirror.setValue(data.data);
          this.$store.commit('document/setTheme', data.theme);
        };
        document.body.removeChild(element);
      };
      element.click();
    },
    scrollToPage: function () {
      if (this.pageLines[this.documentCurrentPageNumber] !== undefined) {
        this.codeMirror.scrollIntoView({line: this.pageLines[this.documentCurrentPageNumber], char: 0}, 100);
        this.codeMirror.setCursor({line: this.pageLines[this.documentCurrentPageNumber], ch: 0});
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/modules/codemirror.scss";
@import "@/assets/scss/modules/progress.scss";
</style>
