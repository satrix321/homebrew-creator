const editor = {
  namespaced: true,
  
  state: {
    rawCode: '',
    currentPageNumber: 0,
    pageBreakIndexes: [],
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPageNumber: state => state.currentPageNumber,
    pageBreakIndexes: state => state.pageBreakIndexes,
  },

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPageNumber (state, currentPageNumber) {
      state.currentPageNumber = currentPageNumber;
    },
    setPageBreakIndexes (state, pageBreakIndexes) {
      state.pageBreakIndexes = [];
      state.pageBreakIndexes.push(...pageBreakIndexes);
    }
  }
};

export default editor;
