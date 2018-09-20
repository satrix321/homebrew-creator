const zoomIncrement = 10;
const zoomDefault = 100;

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

    currentPageNumber: 0,

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

    currentPageNumber: state => state.currentPageNumber,

    pageHeightPx: state => state.pageHeightPx,
    pageOffsetPx: state => state.pageOffsetPx
  },

  actions: {
    zoomIn (context) {
      context.commit(' ', context.state.zoom + zoomIncrement);
    },
    zoomOut (context) {
      context.commit('setZoom', context.state.zoom - zoomIncrement);
    }
  },

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

    setZoom (state, zoom) {
      state.oldZoom = state.zoom;
      state.zoom = zoom;
    },
    setDefaultZoom (state) {
      state.oldZoom = state.zoom;
      state.zoom = zoomDefault;
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

    setCurrentPageNumber (state, currentPageNumber) {
      state.currentPageNumber = currentPageNumber;
    }
  }
};

export default document;
