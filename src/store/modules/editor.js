const editor = {
  namespaced: true,
  
  state: {
    rawCode: '\\page[columns]',
    currentPage: 0,
    pageLines: []
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPage: state => state.currentPage,
    pageLines: state => state.pageLines
  },

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPage (state, currentPage) {
      state.currentPage = currentPage;
    },
    pushPageLines (state, pageLines) {
      state.pageLines = [];
      state.pageLines.push(...pageLines);
    }
  }
};

export default editor;
