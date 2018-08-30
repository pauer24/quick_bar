const state = {
  username: null,
  dbUrl: null
};

const mutations = {
  'RESET_APP' (state) {
    state.username = null,
    state.dbUrl = null
  },
  'INITIALIZE_APP' (state, {username, dbUrl}) {
    state.username = username;
    state.dbUrl = dbUrl;
  }
}

const actions = {
  resetApp({commit}) {
    commit('RESET_APP');
  },
  initializeApp({commit}, {username, dbUrl}) {
    commit('INITIALIZE_APP', {username, dbUrl});
  }
}

const getters = {
  appSettings: state => { return {  username: state.username, dbUrl: state.dbUrl} }
}

export default {
  state,
  mutations,
  actions,
  getters
}
