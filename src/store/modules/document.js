// initial state
// shape: [{ id, quantity }]
const state = {
  pagesTexture: true,
  notesTexture: true,
  zoom: 100
}

// getters
const getters = {
  pagesTexture: state => state.pagesTexture,
  notesTexture: state => state.notesTexture,
  zoom: state => state.zoom
}

// actions
const actions = {}

// mutations
const mutations = {
  setPagesTexture (state, pagesTexture) {
    state.pagesTexture = pagesTexture
  },
  setNotesTexture (state, notesTexture) {
    state.notesTexture = notesTexture
  },
  setZoom (state, zoom) {
    state.zoom = zoom
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}