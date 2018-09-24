import firebase from 'firebase/app';
import 'firebase/firestore'

const menus = () => firebase.firestore().collection('menu');

const state = {
  menu: {}
};

const mutations = {
  'SET_MENU' (state, menu) {
    state.menu = menu;
  }
}

const actions = {
  setMenu({commit}, menu) {
    commit('SET_MENU', menu);
  },
  updateMenu({commit}, menu, onUpdate) {
    menus().doc('main').update(menu)
      .then(function(docRef) { console.debug('Menu updated successfully.', docRef); onUpdate(); })
      .catch(function(error) { console.error('While updating menu.', error);})
  }
}

const getters = {
  menu(state) { return state.menu }
}

export default {
  state,
  mutations,
  actions,
  getters
}
