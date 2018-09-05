import PendingOrders from './components/PendingOrders.vue';
import NewOrder from './components/NewOrder.vue';
import History from './components/History.vue';
import ProductCrud from './components/settings/ProductCrud.vue';
import ProductConfigurator from './components/settings/ProductConfigurator.vue';
import MenuConfigurator from './components/settings/MenuConfigurator.vue';

const routes = [
  { path: '/orders/pending', component: PendingOrders },
  { path: '/order/new', component: NewOrder },
  { path: '/history', component: History },
  { path: '/settings/products', component: ProductConfigurator },
  { path: '/settings/product/new', component: ProductCrud},
  { path: '/settings/product/edit/:id', component: ProductCrud},
  { path: '/settings/menu', component: MenuConfigurator },
]

import Vue from 'vue'
import VueRouter from 'vue-router';
Vue.use(VueRouter);
export const router = new VueRouter({
  routes,
  mode: 'history'
});
