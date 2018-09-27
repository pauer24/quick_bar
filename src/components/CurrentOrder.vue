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
            <v-chip small v-if="item.extras && item.extras.length > 0">+{{ item.extras.length }}</v-chip>
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
          allowNotes: true,
          extras: ["HuqPlrlQy4XOUTyVjYEy", "FjEYw1qHv0Ws84WbkzCU"],
          id: "2HZqD5bxlm7zFpH4IWoL",
          imageUrl:
            "http://elmejorbocadillo.com/151-thickbox_default/bocadillo-de-butifarra.jpg",
          name: "Bocadillo de longaniza",
          price: "4.5",
          count: 1
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
        let emptyProduct = p => {
          return !p.extras || p.extras.length === 0;
        };
        for (let element of sameProducts) {
          if (emptyProduct(element) && emptyProduct(product) || // both products are empty
              Enumerable.from(product.extras).all(extraId => Enumerable.from(element.extras).any(eId => eId === extraId))) { // both products have same extras
            sameProduct = element;
          }
        }

        // returning product found with its index
        if (sameProduct === null) return null;
        for (let i = 0; i < items.length; i++) {
          if (items[i] === sameProduct) {
            return {
              item: items[i],
              index: i
            };
          }
        }

        throw ("Product not found in items", sameProduct);
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
    let component = this;
    shoppingCartEventBus.$on("addProduct", product => {
      this.addProduct(product);
    });
    shoppingCartEventBus.$on("orderItemUpdated", (orderItem, index) => {
      if (orderItem.count <= 0) {
        component.items.splice(index, 1);
      } else {
        component.items.splice(index, 1, orderItem);
      }
    });
  },
  watch: {
    items: function(newValue) {
      this.$emit("itemsCountUpdated", newValue.length);
    }
  }
};
</script>
<style>
.repeated-item {
  background-color: #90ee90;
}
</style>

