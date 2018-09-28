<template>
  <v-navigation-drawer fixed right :value="value" @input="emitInput" clipped app>
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
    <div class="to-bottom">
      <v-divider></v-divider>
      <div class="mx-2 mt-3">
        <v-layout align-content-center>
          <p style="font-size:20px"><strong>TOTAL</strong></p>
          <v-spacer></v-spacer>
          <v-divider class="mb-3 mr-3" vertical></v-divider>
          <p style="font-size:20px">{{ orderPrice }} €</p>
        </v-layout>
        <v-layout align-content-center>
          <v-flex xs2>
            <v-btn flat small icon color="pink" @click="deleteEntireOrder">
              <v-icon>delete</v-icon>
            </v-btn>
          </v-flex>
          <v-flex xs8>
            <v-text-field label="Client name"></v-text-field>
          </v-flex>
          <v-flex xs2>
            <v-btn dark icon color="green">
              <v-icon>check</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
import Enumerable from "linq";
import { shoppingCartEventBus, action } from "../eventBuses";
import { priceCalculator } from "../services/priceCalculator";

export default {
  props: ["value"],
  data() {
    return {
      items: []
    };
  },
  methods: {
    showItem(item, index) {
      shoppingCartEventBus.updateOrderItem(item, index);
    },
    addProduct(product) {
      console.warn('Adding product to current order')

      let items = this.items;
      let itemWithIndex = product => {
        let sameProduct = null;
        let sameProducts = items.filter(i => i.id === product.id);

        if (sameProducts.length === 0) return null;
        let emptyProduct = p => {
          return !p.extras || p.extras.length === 0;
        };
        for (let element of sameProducts) {
          if (
            (emptyProduct(element) && emptyProduct(product)) || // both products are empty
            Enumerable.from(product.extras).all(extraId =>
              Enumerable.from(element.extras).any(eId => eId === extraId)
            )
          ) {
            // both products have same extras
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
    },
    emitInput($event) {
      this.$emit("input", $event);
    },
    deleteEntireOrder() {
      var items = this.items;
      var component = this;
      this.items = [];
      action.allowUndo("Shopping cart removed", () => {
        component.items = items;
      });
    },
    onOrderItemUpdated(orderItem, index) {
      var previousItem = this.items[index];
      if (orderItem.count <= 0) {
        this.items.splice(index, 1);
        action.allowUndo("Item removed", () => {
          this.items.splice(index, 0, previousItem);
        });
      } else {
        this.items.splice(index, 1, orderItem);
      }
    }

  },
  computed: {
    orderPrice: function() {
      let price = 0;
      for (let item of this.items) {
        price += priceCalculator.compute(item) * item.count;
      }
      return price;
    }
  },
  created() {
    shoppingCartEventBus.$on("addProduct", this.addProduct);
    shoppingCartEventBus.$on("orderItemUpdated", this.onOrderItemUpdated);
  },
  beforeDestroy() {
    shoppingCartEventBus.$off("addProduct", this.addProduct);
    shoppingCartEventBus.$off("orderItemUpdated", this.onOrderItemUpdated);
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
.to-bottom {
  position: absolute;
  bottom: 0;
  display: block;
  width: 100%;
}
</style>

