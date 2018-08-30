import Vue from 'vue'
import App from './App.vue'
import { router } from './routes';

import Vuetify from 'vuetify'
Vue.use(Vuetify)
import 'vuetify/dist/vuetify.min.css'

import store from './store/store';

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
