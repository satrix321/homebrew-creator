<template>
  <div class="editor">
    <the-editor-toolbar :eventBus="eventBus" @insertPrimaryNote="insertPrimaryNote"
      @insertSecondaryNote="insertSecondaryNote" @insertTertiaryNote="insertTertiaryNote"
      @insertNewspaperNote="insertNewspaperNote" @insertHandwrittenNote="insertHandwrittenNote"
      @insertPhbNote="insertPhbNote" @insertCocStatBlock="insertCocStatBlock" @insertDndStatBlock="insertDndStatBlock"
      @insertRegularTable="insertRegularTable" @insertDndCustomTable="insertDndCustomTable"
      @insertRegularPage="insertRegularPage" @insertRelativeImage="insertRelativeImage"
      @insertAbsoluteImage="insertAbsoluteImage" @insertFullPageImage="insertFullPageImage"
      @insertTwoColumnPage="insertTwoColumnPage" @insertThreeColumnPage="insertThreeColumnPage"
      @insertTitlePage="insertTitlePage" @insertColumnBreak="insertColumnBreak" @insertWideBlock="insertWideBlock"
      @insertVerticalSpacing="insertVerticalSpacing" @insertCustomTitlePageFont="insertCustomTitlePageFont"
      @insertCustomHeadersFont="insertCustomHeadersFont" @insertCustomNoteHeadersFont="insertCustomNoteHeadersFont"
      @insertCustomRegularTextFont="insertCustomRegularTextFont"
      @insertCustomNewspaperHeadersFont="insertCustomNewspaperHeadersFont"
      @insertCustomNewspaperTextFont="insertCustomNewspaperTextFont"
      @insertCustomHandwritingFont="insertCustomHandwritingFont" @downloadFile="downloadFile" @uploadFile="uploadFile"
      @scrollToPage="scrollToPage" @switchView="switchView" />
    <codemirror ref="editor" :options="codeMirrorOptions" @input="codeChange" @cursorActivity="cursorPositionChange" />
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror';
import TheEditorToolbar from '@/components/TheEditorToolbar';
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

export default {
  name: 'TheEditor',
  components: {
    codemirror,
    TheEditorToolbar,
  },
  data() {
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
        fullLines: false,
      },
    };
  },
  props: ['eventBus'],
  computed: {
    ...mapGetters({
      pageBreakIndexes: 'editor/pageBreakIndexes',
      rawCode: 'editor/rawCode',

      documentCurrentPageIndex: 'document/currentPageIndex',
      theme: 'document/theme',

      primaryNoteSnippet: 'editorSnippets/primaryNoteSnippet',
      secondaryNoteSnippet: 'editorSnippets/secondaryNoteSnippet',
      tertiaryNoteSnippet: 'editorSnippets/tertiaryNoteSnippet',
      newspaperNoteSnippet: 'editorSnippets/newspaperNoteSnippet',
      handwrittenNoteSnippet: 'editorSnippets/handwrittenNoteSnippet',
      phbNoteSnippet: 'editorSnippets/phbNoteSnippet',

      cthulhuStatTableSnippet: 'editorSnippets/cthulhuStatTableSnippet',
      dndStatTableSnippet: 'editorSnippets/dndStatTableSnippet',

      tableSnippet: 'editorSnippets/tableSnippet',
      dndCustomTableSnippet: 'editorSnippets/dndCustomTableSnippet',

      pageSnippet: 'editorSnippets/pageSnippet',
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
  beforeCreate() {
    CodeMirror.defineMode('homebrew-markdown', function (config, parserConfig) {
      // highlight lines with '\page' string
      const homebrewOverlay = {
        token(stream) {
          let char;

          if (stream.match('\\page')) {
            while ((char = stream.next()) != null && char != ']') {
              continue;
            }
            return 'line-cm-new-page-line';
          }

          while (stream.next() != null && !stream.match('\\page', false)) {
            continue;
          }

          return null;
        }
      };

      return CodeMirror.overlayMode(
        CodeMirror.getMode(config, parserConfig.backdrop || 'text/x-markdown'),
        homebrewOverlay
      );
    });

    CodeMirror.keyMap.default['Ctrl-G'] = 'jumpToLine';
  },
  mounted() {
    this.codeMirror = this.$refs.editor.codemirror;
    this.codeMirror.showMatchesOnScrollbar('\\page', false, { className: 'CodeMirror-search-match-new-page' });
    this.$refs.editor.codemirror.setOption('extraKeys', {
      'Ctrl-/': this.commentText.bind(this)
    });

    this.insertData(this.rawCode + ' ', this.getCursorPosition());
  },
  methods: {
    insertPrimaryNote() { this.insertData(this.primaryNoteSnippet, this.getCursorPosition()); },
    insertSecondaryNote() { this.insertData(this.secondaryNoteSnippet, this.getCursorPosition()); },
    insertTertiaryNote() { this.insertData(this.tertiaryNoteSnippet, this.getCursorPosition()); },
    insertNewspaperNote() { this.insertData(this.newspaperNoteSnippet, this.getCursorPosition()); },
    insertHandwrittenNote() { this.insertData(this.handwrittenNoteSnippet, this.getCursorPosition()); },
    insertPhbNote() { this.insertData(this.phbNoteSnippet, this.getCursorPosition()); },
    insertCocStatBlock() { this.insertData(this.cthulhuStatTableSnippet, this.getCursorPosition()); },
    insertDndStatBlock() { this.insertData(this.dndStatTableSnippet, this.getCursorPosition()); },
    insertRegularTable() { this.insertData(this.tableSnippet, this.getCursorPosition()); },
    insertDndCustomTable() { this.insertData(this.dndCustomTableSnippet, this.getCursorPosition()); },
    insertRegularPage() { this.insertData(this.pageSnippet, this.getCursorPosition()); },
    insertTwoColumnPage() { this.insertData(this.twoColumnPageSnippet, this.getCursorPosition()); },
    insertThreeColumnPage() { this.insertData(this.threeColumnPageSnippet, this.getCursorPosition()); },
    insertTitlePage() { this.insertData(this.titlePageSnippet, this.getCursorPosition()); },
    insertRelativeImage() { this.insertData(this.relativeImageSnippet, this.getCursorPosition()); },
    insertAbsoluteImage() { this.insertData(this.absoluteImageSnippet, this.getCursorPosition()); },
    insertFullPageImage() { this.insertData(this.fullPageImageSnippet, this.getCursorPosition()); },
    insertColumnBreak() { this.insertData(this.columnBreakSnippet, this.getCursorPosition()); },
    insertWideBlock() { this.insertData(this.wideBlockSnippet, this.getCursorPosition()); },
    insertVerticalSpacing() { this.insertData(this.verticalSpacingSnippet, this.getCursorPosition()); },
    insertCustomTitlePageFont() { this.insertData(this.customTitlePageFontSnippet, this.getCursorPosition()); },
    insertCustomHeadersFont() { this.insertData(this.customHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomNoteHeadersFont() { this.insertData(this.customNoteHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomRegularTextFont() { this.insertData(this.customRegularTextFontSnippet, this.getCursorPosition()); },
    insertCustomNewspaperHeadersFont() { this.insertData(this.customNewspaperHeadersFontSnippet, this.getCursorPosition()); },
    insertCustomNewspaperTextFont() { this.insertData(this.customNewspaperTextFontSnippet, this.getCursorPosition()); },
    insertCustomHandwritingFont() { this.insertData(this.customHandwritingFontSnippet, this.getCursorPosition()); },
    codeChange: _.debounce(function (rawCode) {
      const pageBreakIndexes = [];
      const search = this.codeMirror.getSearchCursor('\\page');
      while (search.findNext()) {
        pageBreakIndexes.push(search.from().line);
      }
      this.$store.commit('editor/setPageBreakIndexes', pageBreakIndexes);
      this.$store.commit('editor/setRawCode', rawCode);
    }, 500),
    cursorPositionChange: _.debounce(function (position) {
      const currentLineIndex = position.getCursor().line;
      let currentPageIndex = 0;
      if (this.pageBreakIndexes.length > 1) {
        for (let i = 1; currentLineIndex >= this.pageBreakIndexes[i]; i++) {
          currentPageIndex++;
        }
      }
      this.$store.commit('editor/setCurrentPageIndex', currentPageIndex);
    }, 200),
    getCursorPosition() {
      const cursor = this.codeMirror.getDoc().getCursor();
      return {
        line: cursor.line,
        ch: cursor.position
      };
    },
    commentText() {
      const from = this.codeMirror.getCursor(true);
      const to = this.codeMirror.getCursor(false);
      if (!this.codeMirror.uncomment(from, to, this.codeMirrorCommentOptions)) {
        this.codeMirror.blockComment(from, to, this.codeMirrorCommentOptions);
      }
    },
    insertData(data, position) {
      this.codeMirror.getDoc().replaceRange(data, position);
    },
    scrollToPage() {
      if (this.pageBreakIndexes[this.documentCurrentPageIndex] !== undefined) {
        this.codeMirror.scrollIntoView({ line: this.pageBreakIndexes[this.documentCurrentPageIndex], char: 0 }, 100);
        this.codeMirror.setCursor({ line: this.pageBreakIndexes[this.documentCurrentPageIndex], ch: 0 });
      }
    },
    downloadFile() {
      const data = {
        data: this.rawCode,
        theme: this.theme,
      };

      const anchorElement = document.createElement('a');
      anchorElement.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data)));
      anchorElement.setAttribute('download', 'homebrew.hmd');
      anchorElement.style.display = 'none';
      document.body.appendChild(anchorElement);
      anchorElement.click();
      document.body.removeChild(anchorElement);
    },
    uploadFile() {
      const inputElement = document.createElement('input');
      inputElement.setAttribute('type', 'file');
      inputElement.style.display = 'none';
      inputElement.onchange = () => {
        const reader = new FileReader();
        reader.readAsText(inputElement.files[0]);
        reader.onload = () => {
          const data = JSON.parse(reader.result);
          this.codeMirror.setValue(data.data);
          this.$store.commit('document/setTheme', data.theme);
        };
        document.body.removeChild(inputElement);
      };

      document.body.appendChild(inputElement);
      inputElement.click();
    },
    switchView() {
      this.$emit('switchView');
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/scss/codemirror.scss";
</style>
