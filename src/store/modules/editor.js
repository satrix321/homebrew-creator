const editor = {
  namespaced: true,
  
  state: {
    rawCode: '',
    currentPageIndex: 0,
    pageBreakIndexes: [],
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPageIndex: state => state.currentPageIndex,
    pageBreakIndexes: state => state.pageBreakIndexes,
    pageCount: state => state.pageBreakIndexes.length
  },

  mutations: {
    setRawCode (state, rawCode) {
      state.rawCode = rawCode;
    },
    setCurrentPageIndex (state, currentPageIndex) {
      state.currentPageIndex = currentPageIndex;
    },
    setPageBreakIndexes (state, pageBreakIndexes) {
      state.pageBreakIndexes = [];
      state.pageBreakIndexes.push(...pageBreakIndexes);
    }
  }
};

export default editor;
