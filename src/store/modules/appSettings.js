const state = {
  username: null
};

const mutations = {
  'RESET_APP' (state) {
    state.username = null
  },
  'INITIALIZE_APP' (state, username) {
    state.username = username;
  }
}

const actions = {
  resetApp({commit}) {
    commit('RESET_APP');
  },
  initializeApp({commit}, username) {
    commit('INITIALIZE_APP', username);
  }
}

const getters = {
  appSettings: state => { return state.username }
}

export default {
  state,
  mutations,
  actions,
  getters
}
