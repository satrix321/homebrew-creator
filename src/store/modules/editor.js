// initial state
// shape: [{ id, quantity }]
const state = {
  rawCode: '\\page[columns]',
  currentPage: 0
};

// getters
const getters = {
  rawCode: state => state.rawCode,
  currentPage: state => state.currentPage
};

// actions
const actions = {};

// mutations
const mutations = {
  setRawCode (state, rawCode) {
    state.rawCode = rawCode;
  },
  setCurrentPage (state, currentPage) {
    state.currentPage = currentPage;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
