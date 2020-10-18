import { displayBreakpoint, DISPLAY_STATE } from '@/modules/globals';

const app = {
  namespaced: true,
  
  state: {
    displayState: document.body.clientWidth > displayBreakpoint ? DISPLAY_STATE.EDITOR_AND_DOCUMENT : DISPLAY_STATE.EDITOR,
  },

  getters: {
    displayState: state => state.displayState,
  },

  mutations: {
    setDisplayState(state, displayState) {
      state.displayState = displayState;
    },
  }
};

export default app;
