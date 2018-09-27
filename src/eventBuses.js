import Vue from 'vue'

export const menuTreeEventBus = new Vue({
  methods: {
    nodeSelected(selectedNode) {
      this.$emit('nodeSelected', selectedNode);
    }
  }
});

export const shoppingCartEventBus = new Vue({
  methods: {
    addProduct(product) {
      this.$emit('addProduct', product);
    },
    productSelected(product) {
      this.$emit('productSelected', product);
    },
    updateOrderItem(item, index) {
      console.log('updateOrderItem', new Date());
      this.$emit('updateOrderItem', item, index );
    },
    addOrderItem(item) {
      this.$emit('addOrderItem', item);
    }
  }
})
