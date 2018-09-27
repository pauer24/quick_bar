import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import menu from './modules/menu';

Vue.use(Vuex);

export default new Vuex.Store({
  // actions,
  modules: {
    products,
    menu
    //     portfolio
  }
});
