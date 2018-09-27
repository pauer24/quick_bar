<template>
  <v-navigation-drawer fixed right v-model="showShoppingCart" clipped app>
    <v-list two-line>
      <v-list-tile @click.prevent="showItem(item, index)" v-for="(item, index) in items" :key="index">
        <v-list-tile-avatar>
          <v-img :src="item.imageUrl"></v-img>
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title> {{ item.name }} </v-list-tile-title>
          <v-list-tile-sub-title>
            <v-chip small v-if="item.extras">+{{ item.extras.length }}</v-chip>
            <v-icon v-if="item.notes">notes</v-icon>
            <v-layout>
              <v-flex offset-xs10 xs2></v-flex>
            </v-layout>
          </v-list-tile-sub-title>
        </v-list-tile-content>
        <v-chip color="green" text-color="white">{{item.count}}</v-chip>
      </v-list-tile>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import Enumerable from "linq";
import { shoppingCartEventBus } from "../eventBuses";

export default {
  props: ["show-shopping-cart"],
  data() {
    return {
      items: [
        {
          id: "some random id",
          name: "Un títol llarg com la bíblia, que hauria de sortir a 2 línes",
          imageUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/BLT_sandwich_on_toast.jpg/220px-BLT_sandwich_on_toast.jpg",
          extras: [{}, {}],
          notes: "bla bla bla bla bla bla",
          count: 5
        }
      ]
    };
  },
  methods: {
    showItem(item, index) {
      shoppingCartEventBus.updateOrderItem(item, index);
    },
    addProduct(product) {
      let items = this.items;
      let itemWithIndex = product => {
        let sameProduct = null;
        let sameProducts = items.filter(i => i.id === product.id);

        if (sameProducts.length === 0) return null;
        let emptyProduct = (p) => { return !p.extras || p.extras.length === 0; }
        for(let element of sameProducts) {
          if (emptyProduct(element) && emptyProduct(product)) sameProduct = element;
        };

        if (sameProduct === null) return null;
        for(let i = 0; i < items.length; i++) {
          if (items[i] === sameProduct) {
            return {
              item: items[i],
              index: i
            }
          }
        }
      debugger;

        throw 'Product not found in items', sameProduct
      };

      let sameItem = itemWithIndex(product);
      debugger;
      if (sameItem) {
        let item = sameItem.item;
        item.count++;
        this.items.splice(sameItem.index, 1, item);
      } else {
        let orderItem = this.buildOrderItemFromProduct(product);
        this.items.push(orderItem);
      }
    },
    buildOrderItemFromProduct(product) {
      product.count = 1;
      return product;
    }
  },
  created() {
    shoppingCartEventBus.$on("addProduct", product => {
      this.addProduct(product);
    });
  },
  watch: {
    items: function(newValue) {
      this.$emit('itemsCountUpdated', newValue.length);
    }
  }
};
</script>
<style>
.repeated-item {
  background-color: #90ee90;
}
</style>

