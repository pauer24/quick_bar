import Vue from 'vue';
import Vuex from 'vuex';

import appSettings from './modules/appSettings';
// import portfolio from './modules/portfolio';

// import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
    // actions,
     modules: {
         appSettings,
    //     portfolio
     }
});
