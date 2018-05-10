// initial state
// shape: [{ id, quantity }]
const state = {
  rawCode: '\\page[columns]'
};

// getters
const getters = {
  rawCode: state => state.rawCode
};

// actions
const actions = {};

// mutations
const mutations = {
  setRawCode (state, rawCode) {
    state.rawCode = rawCode;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
