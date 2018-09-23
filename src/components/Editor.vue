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
    <codemirror :options="codeMirrorOptions" @input="codeChange" @cursorActivity="cursorPositionChange"></codemirror>
    <file-picker-modal ref="filePicker" title="File Picker" @downloadFile="downloadFileUsingProvider" @uploadFile="uploadFileUsingProvider"></file-picker-modal>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror';
import EditorToolbar from '@/components/EditorToolbar.vue';
import FilePickerModal from '@/components/FilePickerModal.vue';
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
      codeMirrorOptions: {
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
      pageBreakIndexes: 'editor/pageBreakIndexes',
      rawCode: 'editor/rawCode',

      googleDriveFileId: 'filepicker/googleDriveFileId',
      googleDriveFileName: 'filepicker/googleDriveFileName',
      googleDriveParentId: 'filepicker/googleDriveParentId',
      
      documentCurrentPageNumber: 'document/currentPageNumber',
      theme: 'document/theme',

      primaryNoteSnippet: 'editorSnippets/primaryNoteSnippet',
      secondaryNoteSnippet: 'editorSnippets/secondaryNoteSnippet',
      tertiaryNoteSnippet: 'editorSnippets/tertiaryNoteSnippet',
      newspaperNoteSnippet: 'editorSnippets/newspaperNoteSnippet',
      handwrittenNoteSnippet: 'editorSnippets/handwrittenNoteSnippet',
      phbNoteSnippet: 'editorSnippets/phbNoteSnippet',

      cthulhuStatTable: 'editorSnippets/cthulhuStatTable',

      regularPageSnippet: 'editorSnippets/regularPageSnippet',
      twoColumnPageSnippet: 'editorSnippets/twoColumnPageSnippet',
      threeColumnPageSnippet: 'editorSnippets/threeColumnPageSnippet',
      titlePageSnippet: 'editorSnippets/titlePageSnippet',

      relativeImageSnippet: 'editorSnippets/relativeImageSnippet',
      absoluteImageSnippet: 'editorSnippets/absoluteImageSnippet',
      fullPageImageSnippet: 'editorSnippets/fullPageImageSnippet',

      columnBreakSnippet: 'editorSnippets/columnBreakSnippet',
      wideBlockSnippet: 'editorSnippets/wideBlockSnippet',
      verticalSpacingSnippet: 'editorSnippets/verticalSpacingSnippet',

      customTitlePageFontSnippet: 'editorSnippets/customTitlePageFontSnippet',
      customHeadersFontSnippet: 'editorSnippets/customHeadersFontSnippet',
      customNoteHeadersFontSnippet: 'editorSnippets/customNoteHeadersFontSnippet',
      customRegularTextFontSnippet: 'editorSnippets/customRegularTextFontSnippet',
      customNewspaperHeadersFontSnippet: 'editorSnippets/customNewspaperHeadersFontSnippet',
      customNewspaperTextFontSnippet: 'editorSnippets/customNewspaperTextFontSnippet',
      customHandwritingFontSnippet: 'editorSnippets/customHandwritingFontSnippet'
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
      this.$store.commit('editor/setPageBreakIndexes', lines);
      this.$store.commit('editor/setRawCode', newCode);
    }, 500),
    cursorPositionChange: _.debounce(function (position) {
      let currentLineNumber = position.getCursor().line;
      let currentPageNumber = 0;
      if (this.pageBreakIndexes.length > 1) {
        let i = 1;
        while(currentLineNumber >= this.pageBreakIndexes[i]) {
          currentPageNumber++;
          i++;
        }
      }
      this.$store.commit('editor/setCurrentPageNumber', currentPageNumber);
    }, 200),
    getCursorPosition: function () {
      let cursor = this.codeMirror.getDoc().getCursor();
      let position = {
        line: cursor.line,
        ch: cursor.position
      };
      return position;
    },
    insertData: function (data, position) {
      this.codeMirror.getDoc().replaceRange(data, position);
    },
    insertPrimaryNote: function () { this.insertData(this.primaryNoteSnippet, this.getCursorPosition()); },
    insertSecondaryNote: function () { this.insertData(this.secondaryNoteSnippet, this.getCursorPosition()); },
    insertTertiaryNote: function () { this.insertData(this.tertiaryNoteSnippet, this.getCursorPosition()); },
    insertNewspaperNote: function () { this.insertData(this.newspaperNoteSnippet, this.getCursorPosition()); },
    insertHandwrittenNote: function () { this.insertData(this.handwrittenNoteSnippet, this.getCursorPosition()); },
    insertPhbNote: function () { this.insertData(this.phbNoteSnippet, this.getCursorPosition()); },
    insertCocStatTable: function () { this.insertData(this.cthulhuStatTable, this.getCursorPosition()); },
    insertRegularPage: function () { this.insertData(this.regularPageSnippet, this.getCursorPosition()); },
    insertTwoColumnPage: function () { this.insertData(this.twoColumnPageSnippet, this.getCursorPosition()); },
    insertThreeColumnPage: function () { this.insertData(this.threeColumnPageSnippet, this.getCursorPosition()); },
    insertTitlePage: function () { this.insertData(this.titlePageSnippet, this.getCursorPosition()); },
    insertRelativeImage: function () { this.insertData(this.relativeImageSnippet, this.getCursorPosition()); },
    insertAbsoluteImage: function () { this.insertData(this.absoluteImageSnippet, this.getCursorPosition()); },
    insertFullPageImage: function () { this.insertData(this.fullPageImageSnippet, this.getCursorPosition()); },
    insertColumnBreak: function () { this.insertData(this.columnBreakSnippet, this.getCursorPosition()); },
    insertWideBlock: function () { this.insertData(this.wideBlockSnippet, this.getCursorPosition()); },
    insertVerticalSpacing: function () { this.insertData(this.verticalSpacingSnippet, this.getCursorPosition()); },
    insertCustomTitlePageFont: function () { this.insertData(this.customTitlePageFontSnippet, this.getCursorPosition()); },
    insertCustomHeadersFont: function () { this.insertData(this.customHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomNoteHeadersFont: function () { this.insertData(this.customNoteHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomRegularTextFont: function () { this.insertData(this.customRegularTextFontSnippet, this.getCursorPosition()); },
    insertCustomNewspaperHeadersFont: function () { this.insertData(this.customNewspaperHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomNewspaperTextFont: function () { this.insertData(this.customNewspaperTextFontSnippet, this.getCursorPosition()); },
    insertCustomHandwritingFont: function () { this.insertData(this.customHandwritingFontSnippet, this.getCursorPosition()); },
    scrollToPage: function () {
      if (this.pageBreakIndexes[this.documentCurrentPageNumber] !== undefined) {
        this.codeMirror.scrollIntoView({line: this.pageBreakIndexes[this.documentCurrentPageNumber], char: 0}, 100);
        this.codeMirror.setCursor({line: this.pageBreakIndexes[this.documentCurrentPageNumber], ch: 0});
      }
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
              this.$store.commit('filepicker/set' + this.googleDrive.type + 'FileId', response.result.id);
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
              this.$store.commit('filepicker/set' + this.googleDrive.type + 'FileId', response.result.id);
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
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/modules/codemirror.scss";
@import "@/assets/scss/modules/progress.scss";
</style>
