// initial state
// shape: [{ id, quantity }]
const state = {
  rawCode: null,
  outputHtml: null
}

// getters
const getters = {
  rawCode: state => state.rawCode,
  outputHtml: outputHtml => state.outputHtml
}

// actions
const actions = {}

// mutations
const mutations = {
  setRawCode (state, rawCode) {
    state.rawCode = rawCode
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
