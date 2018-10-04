import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import menu from './modules/menu';
import orders from './modules/orders';

Vue.use(Vuex);

export default new Vuex.Store({
  // actions,
  state: {
    user: {
      name: 'Pavlof',
      role: 'waiter'
    }
  },
  mutations: {
    'SET_USER_NAME'(state, usename) {
      state.user.name = username;
    },
    'SET_USER_ROLE'(state, role) {
      state.user.role = role;
    }
  },
  actions: {
    setUserName({commit}, username) {
      commit('SET_USER_NAME', username)
    },
    setUserRole({commit}, role) {
      commit('SET_USER_ROLE', role)
    }
  },
  getters: {
    user(state) { return state.user }
  },
  modules: {
    products,
    menu,
    orders
  }
});
