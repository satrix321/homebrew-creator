const filepicker = {
  namespaced: true,
  
  state: {
    fileId: undefined,
    fileName: undefined,
    fileParentId: undefined
  },

  getters: {
    fileId: state => state.fileId,
    fileName: state => state.fileName,
    fileParentId: state => state.fileParentId
  },

  mutations: {
    setFileId (state, fileId) {
      state.fileId = fileId;
    },
    setFileName (state, fileName) {
      state.fileName = fileName;
    },
    setFileParentId (state, fileParentId) {
      state.fileParentId = fileParentId;
    }
  }
};

export default filepicker;
