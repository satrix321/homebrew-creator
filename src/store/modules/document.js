const document = {
  namespaced: true,
  
  state: {
    pagesTexture: true,
    notesTexture: true,
    zoom: 100,
    pagesTextureFile: undefined,
    pagesTextureFileChanged: false,
  },

  getters: {
    pagesTexture: state => state.pagesTexture,
    notesTexture: state => state.notesTexture,
    zoom: state => state.zoom,
    pagesTextureFile: state => state.pagesTextureFile,
    pagesTextureFileChanged: state => state.pagesTextureFileChanged,
  },

  actions: {},

  mutations: {
    setPagesTexture (state, pagesTexture) {
      state.pagesTexture = pagesTexture;
    },
    setNotesTexture (state, notesTexture) {
      state.notesTexture = notesTexture;
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
    }
  }
};

export default document;
