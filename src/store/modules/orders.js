import firebase from 'firebase/app';
import 'firebase/firestore'

const orders = () => firebase.firestore().collection('orders');

const state = {
  orders: []
};

const mutations = {
  'SET_ORDERS'(state, orders) {
    state.orders = orders;
  }
}

const actions = {
  setOrders({commit}, orders) {
    commit('SET_ORDERS', orders);
  },
  saveOrder({ commit }, obj) {
    debugger;
    orders().add(obj.order)
      .then(function (docRef) { console.debug('Order added successfully.', docRef); obj.onSuccess(docRef); })
      .catch(function (error) { console.error('While adding new order.', error); })
      ;
  },
  updateOrder({ commit }, obj) {
    orders().doc(obj.order.id).update(obj.order)
      .then(function (docRef) { console.debug('Order updated successfully.', docRef); obj.onSuccess(); })
      .catch(function (error) { console.error('While updating order.', error); })
  },
  deleteOrder({ commit }, obj) {
    debugger;
    orders().doc(obj.order.id).delete()
      .then(function (docRef) { console.debug('Order deleted successfully.', docRef); obj.onSuccess(); })
      .catch(function (error) { console.error('While deleting order.', error); })
  }
};

const getters = {
  orders(state) { return state.orders },
  // order(state) {
  //   return orderId => Enumerable.from(state.orders).singleOrDefault(p => p.id === orderId);
  // }
}

export default {
  state,
  mutations,
  actions,
  getters
}
