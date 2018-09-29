const zoomIncrement = 10;
const zoomDefault = 100;
const zoomMax = 150;
const zoomMin = 50;

const document = {
  namespaced: true,
  
  state: {
    pageTexturesEnabled: true,
    noteTexturesEnabled: true,

    oldZoom: zoomDefault,
    zoom: zoomDefault,

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

    theme: state => state.theme,

    currentPageNumber: state => state.currentPageNumber,

    pageHeightPx: state => state.pageHeightPx,
    pageOffsetPx: state => state.pageOffsetPx
  },

  actions: {
    zoomIn (context) {
      if (context.state.zoom + zoomIncrement <= zoomMax) {
        context.commit('setZoom', context.state.zoom + zoomIncrement);
      }
    },
    zoomOut (context) {
      if (context.state.zoom - zoomIncrement >= zoomMin) {
        context.commit('setZoom', context.state.zoom - zoomIncrement);
      }
    }
  },

  mutations: {
    togglePageTextures (state) {
      state.pageTexturesEnabled = !state.pageTexturesEnabled;
    },
    toggleNoteTextures (state) {
      state.noteTexturesEnabled = !state.noteTexturesEnabled;
    },

    setZoom (state, zoom) {
      state.oldZoom = state.zoom;
      state.zoom = zoom;
    },
    setDefaultZoom (state) {
      state.oldZoom = state.zoom;
      state.zoom = zoomDefault;
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
