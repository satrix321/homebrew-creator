import { displayBreakpoint, DISPLAY_STATE } from '@/modules/globals';

const app = {
  namespaced: true,
  
  state: {
    displayState: document.body.clientWidth > displayBreakpoint ? DISPLAY_STATE.EDITOR_AND_DOCUMENT : DISPLAY_STATE.EDITOR,
    isLoaderVisible: false,
  },

  getters: {
    displayState: state => state.displayState,
    isLoaderVisible: state => state.isLoaderVisible,
  },

  mutations: {
    setDisplayState(state, displayState) {
      state.displayState = displayState;
    },
    showLoader(state) {
      state.isLoaderVisible = true;
    },
    hideLoader(state) {
      state.isLoaderVisible = false;
    },
  }
};

export default app;
