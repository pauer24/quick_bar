import firebase from 'firebase';
import Enumerable from 'linq';

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
  productsCollection: state => {
    return firebase.firestore()
    .collection('products')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
