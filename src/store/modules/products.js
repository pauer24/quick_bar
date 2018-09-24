import firebase from 'firebase/app';
import 'firebase/firestore'

const products = () => firebase.firestore().collection('products');

const state = {
  products: []
};

const mutations = {
  'SET_PRODUCTS' (state, products) {
    state.products = products;
  }
}

const actions = {
  setProducts({commit}, products) {
    commit('SET_PRODUCTS', products);
  },
  saveProduct({commit}, product) {
    products().add(product)
      .then(function(docRef) { console.debug('Product added successfully.', docRef);})
      .catch(function(error) { console.error('While adding new product.', error);})
    ;
  },
  updateProduct({commit}, product) {
    products().doc(product.id).update(product)
      .then(function(docRef) { console.debug('Product added successfully.', docRef);})
      .catch(function(error) { console.error('While adding new product.', error);})
  },
  deleteProduct({commit}, product) {
    products().doc(product.id).delete()
      .then(function(docRef) { console.debug('Product added successfully.', docRef);})
      .catch(function(error) { console.error('While adding new product.', error);})
  }
}

const getters = {
  products(state) { return state.products },
  product(state, productId) { console.warn('Getting product', productId); return null; }
}

export default {
  state,
  mutations,
  actions,
  getters
}
