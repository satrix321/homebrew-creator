const document = {
  namespaced: true,
  
  state: {
    pagesTexture: true,
    notesTexture: true,
    oldZoom: 100,
    zoom: 100,
    pagesTextureFile: undefined,
    pagesTextureFileChanged: false,
    currentPage: 0,
    pageHeight: 1141.42,
    pageOffset: 40
  },

  getters: {
    pagesTexture: state => state.pagesTexture,
    notesTexture: state => state.notesTexture,
    oldZoom: state => state.oldZoom,
    zoom: state => state.zoom,
    pagesTextureFile: state => state.pagesTextureFile,
    pagesTextureFileChanged: state => state.pagesTextureFileChanged,
    currentPage: state => state.currentPage,
    pageHeight: state => state.pageHeight,
    pageOffset: state => state.pageOffset
  },

  actions: {},

  mutations: {
    setPagesTexture (state, pagesTexture) {
      state.pagesTexture = pagesTexture;
    },
    setNotesTexture (state, notesTexture) {
      state.notesTexture = notesTexture;
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
    setCurrentPage (state, currentPage) {
      state.currentPage = currentPage;
    }
  }
};

export default document;
