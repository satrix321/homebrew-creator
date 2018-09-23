const filepicker = {
  namespaced: true,
  
  state: {
    googleDriveFileId: undefined,
    googleDriveFileName: undefined,
    googleDriveParentId: undefined
  },

  getters: {
    googleDriveFileId: state => state.googleDriveFileId,
    googleDriveFileName: state => state.googleDriveFileName,
    googleDriveParentId: state => state.googleDriveParentId
  },

  mutations: {
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

export default filepicker;
