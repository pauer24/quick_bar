import PendingOrders from './components/PendingOrders.vue';
import NewOrder from './components/NewOrder.vue';
import History from './components/History.vue';
import ProductConfigurator from './components/ProductConfigurator.vue';

const routes = [
  { path: '/orders/pending', component: PendingOrders },
  { path: '/order/new', component: NewOrder },
  { path: '/history', component: History },
  { path: '/settings', component: ProductConfigurator }
]

import Vue from 'vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);
export const router = new VueRouter({
  routes,
  mode: 'history'
});
