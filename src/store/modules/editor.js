const editor = {
  namespaced: true,
  
  state: {
    rawCode: '\\page[columns]',
    currentPage: 0
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPage: state => state.currentPage
  },

  actions: {},

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPage (state, currentPage) {
      state.currentPage = currentPage;
    }
  }
};

export default editor;
