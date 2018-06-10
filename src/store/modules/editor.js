const editor = {
  namespaced: true,
  
  state: {
    rawCode: '\\page[columns]',
    currentPage: 0,
    pageLines: [],
    googleDriveFileId: undefined
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPage: state => state.currentPage,
    pageLines: state => state.pageLines,
    googleDriveFileId: state => state.googleDriveFileId
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
    },
    setGoogleDriveFileId (state, fileId) {
      state.googleDriveFileId = fileId;
    }
  }
};

export default editor;
