const editor = {
  namespaced: true,
  
  state: {
    rawCode: '',
    currentPageNumber: 0,
    pageLines: [],
    googleDriveFileId: undefined,
    googleDriveFileName: undefined,
    googleDriveParentId: undefined
  },

  getters: {
    rawCode: state => state.rawCode,
    currentPageNumber: state => state.currentPageNumber,
    pageLines: state => state.pageLines,
    googleDriveFileId: state => state.googleDriveFileId,
    googleDriveFileName: state => state.googleDriveFileName,
    googleDriveParentId: state => state.googleDriveParentId
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
