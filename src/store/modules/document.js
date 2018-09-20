const document = {
  namespaced: true,
  
  state: {
    pageTexturesEnabled: true,
    noteTexturesEnabled: true,

    oldZoom: 100,
    zoom: 100,

    pagesTextureFile: undefined,
    pagesTextureFileChanged: false,

    theme: 'theme-default',

    currentPage: 0,

    pageHeightPx: 1141.42,
    pageOffsetPx: 40
  },

  getters: {
    pageTexturesEnabled: state => state.pageTexturesEnabled,
    noteTexturesEnabled: state => state.noteTexturesEnabled,

    oldZoom: state => state.oldZoom,
    zoom: state => state.zoom,

    pagesTextureFile: state => state.pagesTextureFile,
    pagesTextureFileChanged: state => state.pagesTextureFileChanged,

    theme: state => state.theme,

    currentPage: state => state.currentPage,

    pageHeightPx: state => state.pageHeightPx,
    pageOffsetPx: state => state.pageOffsetPx
  },

  actions: {},

  mutations: {
    enablePageTextures (state) {
      state.pageTexturesEnabled = true;
    },
    disablePageTextures (state) {
      state.pageTexturesEnabled = false;
    },
    enableNoteTextures (state) {
      state.noteTexturesEnabled = true;
    },
    disableNoteTextures (state) {
      state.noteTexturesEnabled = false;
    },

    setOldZoom (state, oldZoom) {
      state.oldZoom = oldZoom;
    },
    setZoom (state, zoom) {
      state.zoom = zoom;
    },

    setPagesTextureFile (state, pagesTextureFile) {
      state.pagesTextureFile = pagesTextureFile;
      state.pagesTextureFileChanged = true;
    },
    unsetPagesTextureFileChanged (state) {
      state.pagesTextureFileChanged = false;
    },

    setTheme (state, theme) {
      state.theme = theme;
    },

    setCurrentPage (state, currentPage) {
      state.currentPage = currentPage;
    }
  }
};

export default document;
