const breakpoint = 1023;
const STATE_ENUM = {
  DESKTOP: 1,
  EDITOR: 2,
  DOCUMENT: 3,
};

const app = {
  namespaced: true,
  
  state: {
    state: document.body.clientWidth > breakpoint ? STATE_ENUM.DESKTOP : STATE_ENUM.EDITOR,
  },

  getters: {
    state: state => state.state,
  },

  mutations: {
    setState (state, appState) {
      state.state = appState;
    },
  }
};

export default app;
