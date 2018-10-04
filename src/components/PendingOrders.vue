<template>
  <div>
    <h1>Pending orders</h1>
    <p v-for="(order, index) in ordersByRole" :key="index"> {{ order }}</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import Enumerable from "linq"

export default {
  computed: {
    ...mapGetters({ orders: 'orders', user: 'user' }),
    ordersByRole: function() {
      if (this.isKitchen) {
        return Enumerable.from(this.orders).select(o => this.productsForOrderByRole(o).length > 0);
      }

      return this.orders
    },
    productsForOrderByRole: function(order) {
      debugger;
      if (this.isKitchen)
        return order.items.map(p => p.allowNotes);

      return order.items;
    },
    isKitchen: function() { return this.user.role === 'cooker'}
  }
};
</script>
