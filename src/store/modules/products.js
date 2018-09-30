import firebase from 'firebase/app';
import 'firebase/firestore';
import Enumerable from 'linq';

const products = () => firebase.firestore().collection('products');

const state = {
  products: []
};

const mutations = {
  'SET_PRODUCTS'(state, products) {
    state.products = products;
  }
}

const actions = {
  setProducts({ commit }, products) {
    commit('SET_PRODUCTS', products);
  },
  saveProduct({ commit }, obj) {
    products().add(obj.product)
      .then(function (docRef) { console.debug('Product added successfully.', docRef); obj.onSuccess(); })
      .catch(function (error) { console.error('While adding new product.', error); })
      ;
  },
  updateProduct({ commit }, obj) {
    debugger;
    products().doc(obj.product.id).update(obj.product)
      .then(function (docRef) { console.debug('Product updated successfully.', docRef); obj.onSuccess(); })
      .catch(function (error) { console.error('While updating product.', error); })
  },
  deleteProduct({ commit }, obj) {
    products().doc(obj.product.id).delete()
      .then(function (docRef) { console.debug('Product deleted successfully.', docRef); obj.onSuccess(); })
      .catch(function (error) { console.error('While deleting product.', error); })
  }
}

const getters = {
  products(state) { return state.products },
  product(state) {
    return productId => Enumerable.from(state.products).singleOrDefault(p => p.id === productId);
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
