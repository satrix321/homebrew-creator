<template>
  <div class="editor">
    <div ref="progress" class="progress"><i class="progress__icon fas fa-spinner fa-5x"></i></div>
    <the-editor-toolbar
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
      @downloadGoogleDriveFile="downloadGoogleDriveFile"
      @uploadGoogleDriveFile="uploadGoogleDriveFile"
      @downloadFile="downloadFile"
      @uploadFile="uploadFile"
      @scrollToPage="scrollToPage"/>
    <codemirror ref="editor" :options="codeMirrorOptions" 
      @input="codeChange" 
      @cursorActivity="cursorPositionChange"/>
    <the-file-picker ref="filePicker" title="File Picker" 
      @downloadFile="downloadFileUsingProvider" 
      @uploadFile="uploadFileUsingProvider"
      @signOut="signOutFromProvider"/>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror';
import TheEditorToolbar from '@/components/TheEditorToolbar';
import TheFilePicker from '@/components/TheFilePicker';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/dialog/dialog.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/search/jump-to-line.js';
import 'codemirror/addon/mode/overlay.js';
import 'codemirror/addon/selection/active-line.js';
import 'codemirror/addon/scroll/annotatescrollbar.js';
import 'codemirror/addon/search/matchesonscrollbar.js';
import 'codemirror/addon/search/match-highlighter.js';
import 'codemirror/addon/comment/comment.js';
import _ from 'lodash';
import { mapGetters } from 'vuex';
import GoogleDriveProvider from '@/storageProviders/GoogleDriveProvider';

export default {
  name: 'TheEditor',
  components: {
    codemirror,
    TheEditorToolbar,
    TheFilePicker
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
        lineWrapping: true,
        highlightSelectionMatches: { annotateScrollbar: true },
      },
      codeMirrorCommentOptions: {
        blockCommentStart: '<!--',
        blockCommentEnd: '-->',
        fullLines: false
      },
      storageProvider: undefined,
    };
  },
  computed: {
    ...mapGetters({
      pageBreakIndexes: 'editor/pageBreakIndexes',
      rawCode: 'editor/rawCode',

      storageProviderFileId: 'filepicker/fileId',
      storageProviderFileName: 'filepicker/fileName',
      storageProviderFileParentId: 'filepicker/fileParentId',
      
      documentCurrentPageIndex: 'document/currentPageIndex',
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
    // highlight new page lines
    CodeMirror.defineMode('homebrew-markdown', function(config, parserConfig) {
      var homebrewOverlay = {
        token: function(stream) {
          var ch;
          if (stream.match('\\page')) {
            while ((ch = stream.next()) != null && ch != ']') { continue; }
            return 'line-cm-new-page-line';
          }
          while (stream.next() != null && !stream.match('\\page', false)) { continue; }
          return null;
        }
      };
      return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || 'text/x-markdown'), homebrewOverlay);
    });
    CodeMirror.keyMap.default['Ctrl-G'] = 'jumpToLine';
  },
  mounted: function () {
    this.codeMirror = this.$refs.editor.codemirror;
    this.codeMirror.showMatchesOnScrollbar('\\page', false, { className: 'CodeMirror-search-match-new-page' });
    this.$refs.editor.codemirror.setOption('extraKeys', {
      'Ctrl-/': this.commentText.bind(this)
    });
  },
  methods: {
    codeChange: _.debounce(function (rawCode) {
      let pageBreakIndexes = [];
      let search = this.codeMirror.getSearchCursor('\\page');
      while (search.findNext()) {
        pageBreakIndexes.push(search.from().line);
      }
      this.$store.commit('editor/setPageBreakIndexes', pageBreakIndexes);
      this.$store.commit('editor/setRawCode', rawCode);
    }, 500),
    cursorPositionChange: _.debounce(function (position) {
      let currentLineIndex = position.getCursor().line;
      let currentPageIndex = 0;
      if (this.pageBreakIndexes.length > 1) {
        for (let i = 1; currentLineIndex >= this.pageBreakIndexes[i]; i++) {
          currentPageIndex++;
        }
      }
      this.$store.commit('editor/setCurrentPageIndex', currentPageIndex);
    }, 200),
    getCursorPosition: function () {
      let cursor = this.codeMirror.getDoc().getCursor();
      let position = {
        line: cursor.line,
        ch: cursor.position
      };
      return position;
    },
    commentText: function () {
      let from = this.codeMirror.getCursor(true);
      let to = this.codeMirror.getCursor(false);
      if (!this.codeMirror.uncomment(from, to, this.codeMirrorCommentOptions)) {
        this.codeMirror.blockComment(from, to, this.codeMirrorCommentOptions);
      }
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
      if (this.pageBreakIndexes[this.documentCurrentPageIndex] !== undefined) {
        this.codeMirror.scrollIntoView({line: this.pageBreakIndexes[this.documentCurrentPageIndex], char: 0}, 100);
        this.codeMirror.setCursor({line: this.pageBreakIndexes[this.documentCurrentPageIndex], ch: 0});
      }
    },
    syncFile: async function () {
      if (this.storageProviderFileId) {
        this.$refs.progress.classList.add('progress--is-visible');

        if (!this.storageProvider.isSignedIn) {
          await this.storageProvider.authenticate();
        }

        let data = {};
        data.data = this.rawCode;
        data.theme = this.theme;

        this.storageProvider.updateFile(encodeURIComponent(JSON.stringify(data)), this.storageProviderFileId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            }
            this.$refs.progress.classList.remove('progress--is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('progress--is-visible');
          });

      } else {
        alert('file not selected!');
      }
    },
    downloadFileUsingProvider: async function () {
      if (this.storageProviderFileId) {
        this.$refs.progress.classList.add('progress--is-visible');

        if (!this.storageProvider.isSignedIn) {
          await this.storageProvider.authenticate();
        }

        this.storageProvider.downloadFile(this.storageProviderFileId)
          .then((response) => {
            if (response.status === 200) {
              let data = JSON.parse(decodeURIComponent(response.body));
              this.codeMirror.setValue(data.data);
              this.$store.commit('document/setTheme', data.theme);
            } else {
              alert(response);
            }
            this.$refs.progress.classList.remove('progress--is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('progress--is-visible');
          });
      }
    },
    uploadFileUsingProvider: async function () {
      this.$refs.progress.classList.add('progress--is-visible');

      if (!this.storageProvider.isSignedIn) {
        await this.storageProvider.authenticate();
      }

      let data = {};
      data.data = this.rawCode;
      data.theme = this.theme;

      if (this.storageProviderFileId) {
        this.storageProvider.updateFile(encodeURIComponent(JSON.stringify(data)), this.storageProviderFileId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            }
            this.$refs.progress.classList.remove('progress--is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('progress--is-visible');
          });
      } else if (this.storageProviderFileParentId) {
        this.storageProvider.uploadFile(this.storageProviderFileName, encodeURIComponent(JSON.stringify(data)), this.storageProviderFileParentId)
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            } else {
              this.$store.commit('filepicker/setFileId', response.result.id);
            }
            this.$refs.progress.classList.remove('progress--is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('progress--is-visible');
          });
      } else {
        this.storageProvider.uploadFile(this.storageProviderFileName, encodeURIComponent(JSON.stringify(data)))
          .then((response) => {
            if (response.status !== 200) {
              alert(response);
            } else {
              this.$store.commit('filepicker/setFileId', response.result.id);
            }
            this.$refs.progress.classList.remove('progress--is-visible');
          })
          .catch((error) => {
            alert(error);
            this.$refs.progress.classList.remove('progress--is-visible');
          });
      }
    },
    signOutFromProvider: function () {
      this.$refs.progress.classList.add('progress--is-visible');
      this.$refs.filePicker.close();

      try {
        this.storageProvider.signOut();
      } catch (error) {
        console.error(error);
      } finally {
        this.$refs.progress.classList.remove('progress--is-visible');
      }

      return;
    },
    downloadGoogleDriveFile: async function () {
      this.$refs.progress.classList.add('progress--is-visible');

      try {
        if (!this.storageProvider || !(this.storageProvider instanceof GoogleDriveProvider)) {
          this.storageProvider = new GoogleDriveProvider();
          await this.storageProvider.load();
          await this.storageProvider.authenticate();
        } else if (!this.storageProvider.isSignedIn) {
          await this.storageProvider.authenticate();
        }
      } catch (error) {
        console.error(error);
        this.$refs.progress.classList.remove('progress--is-visible');
        return;
      }

      this.$refs.filePicker.setProvider(this.storageProvider);
      this.$refs.filePicker.setDownloadMode();
      this.$refs.filePicker.show();
      this.$refs.progress.classList.remove('progress--is-visible');
    },
    uploadGoogleDriveFile: async function () {
      this.$refs.progress.classList.add('progress--is-visible');
      
      try {
        if (!this.storageProvider || !(this.storageProvider instanceof GoogleDriveProvider)) {
          this.storageProvider = new GoogleDriveProvider();
          await this.storageProvider.load();
          await this.storageProvider.authenticate();
        } else if (!this.storageProvider.isSignedIn) {
          await this.storageProvider.authenticate();
        }
      } catch (error) {
        console.error(error);
        this.$refs.progress.classList.remove('progress--is-visible');
        return;
      }

      this.$refs.filePicker.setProvider(this.storageProvider);
      this.$refs.filePicker.setUploadMode();
      this.$refs.filePicker.show();
      this.$refs.progress.classList.remove('progress--is-visible');
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
@import "@/assets/scss/codemirror.scss";
.progress {
  display: none;
  position: fixed;
  z-index: 200;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.4);

  &.progress--is-visible {
    display: initial;
  }

  > .progress__icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ddd;

    animation-name: spin;
    animation-duration: 2s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;

    @keyframes spin {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  }
}
</style>
