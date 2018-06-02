<template>
  <div class="editorContainer">
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
      @downloadGDrive="downloadGDrive"
      @uploadGDDrive="uploadGDDrive"
      @downloadFile="downloadFile"
      @uploadFile="uploadFile"
      @scrollToPage="scrollToPage"
      >
    </editor-toolbar>
    
    <button id="authorize-button">authorize-button</button>
    <button id="signout-button">signout-button</button>
    <pre id="content"></pre>

    <div class="editor">
      <codemirror :value="rawCode" :options="cmOptions" @input="codeChange" @cursorActivity="cursorPositionChange"></codemirror>
    </div>
  </div>
</template>

<script>
import CodeMirror from 'codemirror';
import { codemirror } from 'vue-codemirror';
import EditorToolbar from './EditorToolbar.vue';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/htmlmixed/htmlmixed.js';
import 'codemirror/addon/search/searchcursor.js';
import 'codemirror/addon/search/search.js';
import 'codemirror/addon/mode/overlay.js';
import 'codemirror/addon/selection/active-line.js';
import _ from 'lodash';
import { mapGetters } from 'vuex';

CodeMirror.defineMode("homebrew-markdown", function(config, parserConfig) {
  var homebrewOverlay = {
    /* eslint-disable */
    token: function(stream) {
      var ch;
      if (stream.match("\\page")) {
        while ((ch = stream.next()) != null && ch != "]") {}
        return "pageLine";
      }
      while (stream.next() != null && !stream.match("\\page", false)) {}
      return null;
    }
    /* eslint-enable */
  };
  return CodeMirror.overlayMode(CodeMirror.getMode(config, parserConfig.backdrop || "text/x-markdown"), homebrewOverlay);
});

export default {
  name: 'Editor',
  components: {
    codemirror,
    EditorToolbar
  },
  data () {
    return {
      rawCode: '\\page[columns]',
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
      }
    };
  },
  computed: {
    ...mapGetters({
      pageLines: 'editor/pageLines',
      documentCurrentPage: 'document/currentPage'
    }),
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
    downloadGDrive: function () {

      // Client ID and API key from the Developer Console
      var CLIENT_ID = '228271316918-k2sarmhfjfi842477oqnnbofunmv7tef.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyClUHnIHhxGPGKBQaQ9PLuzSDwbGmQ-5MM';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = 'https://www.googleapis.com/auth/drive.metadata.readonly';

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/client.js";

      script.onload = () => {
        console.log('onload');
        window.gapi.load('client:auth2', initClient);
      };

      document.body.appendChild(script);
      

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        window.gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          window.gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          authorizeButton.style.display = 'none';
          signoutButton.style.display = 'block';
          listFiles();
        } else {
          authorizeButton.style.display = 'block';
          signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick() {
        window.gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick() {
        window.gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print files.
       */
      function listFiles() {
        window.gapi.client.drive.files.list({
          'pageSize': 10,
          'fields': "nextPageToken, files(id, name)"
        }).then(function(response) {
          appendPre('Files:');
          var files = response.result.files;
          if (files && files.length > 0) {
            for (var i = 0; i < files.length; i++) {
              var file = files[i];
              appendPre(file.name + ' (' + file.id + ')');
            }
          } else {
            appendPre('No files found.');
          }
        });
      }






    },
    uploadGDDrive: function () {

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
      this.codeMirror.scrollIntoView({line: this.pageLines[this.documentCurrentPage], char: 0}, 100);
      this.codeMirror.setCursor({line: this.pageLines[this.documentCurrentPage], ch: 0});
    }
  }
};
</script>

<style lang="scss">
.editorContainer {
  height: 100%;

  .CodeMirror {
    height: calc(100vh - 30px);
    width: 100%;
    margin: 0px;
    border: 0px;
    padding: 0px;
    resize: none;
    font-family: $site-font;
    font-size: 8pt;  
  }
}

.cm-s-custom {
  font-size: 1em;
  line-height: 1.5em;
  font-family: $site-font;
  background: #2a2a2a !important;
  color: #ffffff !important;

  .CodeMirror-lines {
    padding: 8px 0;
  }

  .CodeMirror-gutters {
    box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.5);
    -webkit-box-shadow: 1px 0 2px 0 rgba(0, 0, 0, 0.5);
    background-color: #2a2a2a;
    padding-right: 10px;
    z-index: 3;
    border: none;
  }

  div.CodeMirror-cursor {
    border-left: 3px solid #ffffff;
  }

  .CodeMirror-activeline-background {
    background: #3E3D32;
  }

  .CodeMirror-selected {
    background: #237CC4;
  }

  /* default */
  .box pre {
    color: white;
  }

  .cm-comment {
    color: #B8FF9A;
  }
  
  .cm-string {
    color: #FF9F9A;
  }

  .cm-string-2 {
    color: #FFFFFF;
  }

  .cm-number {
    color: #66D9EF;
  }

  .cm-atom {
    color: #66D9EF;
  }

  .cm-def {
    font-style: italic;
    color: #FD971F;
  }

  .cm-variable {
    color: #ddca7e;
  }
  
  .cm-variable-2 {
    color: #F29C00;
  }

  .cm-property {
    color: #66D9EF;
  }

  .cm-keyword {
    color: #ddca7e;
  }

  .cm-atom {
    color: #ddca7e;
  }

  .cm-operator {
    color: #cccccc;
  }

  .CodeMirror-linenumber {
    color: #B8FF9A;
  }

  .cm-quote {
    color: #B8FF9A;
  }

  .cm-header {
    color: #66D9EF;
  }

  .cm-pageLine {
    color: yellow;
  }

  .cm-unit {
    color: #d0782a;
  }

  .cm-meta {
    color: #9a8297;
  }

  .cm-tag {
    color: #D043E0;
  }

  .cm-attribute {
    color: #ddca7e;
  }

  .cm-strong {
    color: #ddca7e;
  }

  .cm-em {
    color: #ddca7e;
  }

  .cm-qualifier {
    color: #ddca7e;
  }

  .cm-builtin {
    color: #ddca7e;
  }
}
</style>
