import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import editor from './modules/editor';
import editorSnippets from './modules/editorSnippets';
import document from './modules/document';
import filepicker from './modules/filepicker';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    app,
    editor,
    editorSnippets,
    document,
    filepicker
  },
  strict: true
});
