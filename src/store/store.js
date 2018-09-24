import Vue from 'vue';
import Vuex from 'vuex';

import products from './modules/products';
import menu from './modules/menu';
// import portfolio from './modules/portfolio';

// import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  // actions,
  modules: {
    products,
    menu
    //     portfolio
  }
});
