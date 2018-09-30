import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import menu from './modules/menu';
import orders from './modules/orders';

Vue.use(Vuex);

export default new Vuex.Store({
  // actions,
  state: {
    connectedUser: 'Pavlof'
  },
  mutations: {
    'SET_CONNECTED_USER'(state, username) {
      state.connectedUser = username;
    }
  },
  actions: {
    setConnectedUser({commit}, username) {
      commit('SET_CONNECTED_USER', username)
    }
  },
  getters: {
    connectedUser(state) { return state.connectedUser}
  },
  modules: {
    products,
    menu,
    orders
  }
});
