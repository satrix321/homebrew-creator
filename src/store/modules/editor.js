const editor = {
  namespaced: true,
  
  state: {
    rawCode: '',
    currentPage: 0,
    pageLines: [],
    googleDriveFileId: undefined,
    googleDriveFileName: undefined,
    googleDriveParentId: undefined
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPage: state => state.currentPage,
    pageLines: state => state.pageLines,
    googleDriveFileId: state => state.googleDriveFileId,
    googleDriveFileName: state => state.googleDriveFileName,
    googleDriveParentId: state => state.googleDriveParentId
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
    },
    setGoogleDriveFileName (state, fileName) {
      state.googleDriveFileName = fileName;
    },
    setGoogleDriveParentId (state, parentId) {
      state.googleDriveParentId = parentId;
    }
  }
};

export default editor;
