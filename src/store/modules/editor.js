const editor = {
  namespaced: true,
  
  state: {
    rawCode: '',

    currentPageNumber: 0,

    pageLines: [],
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPageNumber: state => state.currentPageNumber,
    pageLines: state => state.pageLines,
  },

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPageNumber (state, currentPageNumber) {
      state.currentPageNumber = currentPageNumber;
    },
    pushPageLines (state, pageLines) {
      state.pageLines = [];
      state.pageLines.push(...pageLines);
    }
  }
};

export default editor;
