<template>
  <v-dialog :persistent="persistenDialog" v-model="dialog" width="500" v-if="item">
    <v-card>
      <v-container class="pa-0">
        <v-card-title class="headline grey lighten-2" primary-title>
          {{item.name}}
        </v-card-title>
        <v-card-text>
          <v-layout>
            <product-extras-selection v-model="item.extras" :extras="productAllowedExtras"></product-extras-selection>
          </v-layout>
          <v-text-field v-if="item.allowNotes" v-model="item.notes" label="Notes" />
          <v-layout align-center>
            <div v-if="isOrder">
              <v-layout align-center>

              <v-btn fab small color="gray" @click="addToCount(-1)">
                <v-icon>remove</v-icon>
              </v-btn>
              <span class="headline gray-text"> {{item.count}} </span>
              <v-btn fab small color="gray" @click="addToCount(1)">
                <v-icon>add</v-icon>
              </v-btn>
              </v-layout>

            </div>
            <v-spacer></v-spacer>
            <v-flex xs3>
              <v-text-field class="headline" :value="itemPrice + ' €'" disabled></v-text-field>
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-btn fab dark color="green" @click="save">
            <v-icon dark>check</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab dark color="red" @click="dialog=false">
            <v-icon dark>close</v-icon>
          </v-btn>
        </v-card-actions>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { shoppingCartEventBus } from "../eventBuses";
import { priceCalculator } from "../services/priceCalculator";

import ProductExtrasSelection from "./ProductExtrasSelection.vue";

export default {
  data() {
    return {
      persistenDialog: false,
      dialog: false,
      item: null,
      orderIndex: null
    };
  },
  methods: {
    updateOrderItem(selectedItem, index) {
      let item = Object.assign({}, selectedItem);
      this.item = item;
      this.orderIndex = index;
      this.dialog = true;
    },
    productSelected(selectedProduct) {
      let product = Object.assign({}, selectedProduct);
      if (!product.extras || product.extras.length === 0) {
        shoppingCartEventBus.addProduct(product);
      } else {
        this.dialog = true;
        this.item = product;
        this.item.extras = [];
      }
    },
    save() {
      if (!this.isOrder) {
        shoppingCartEventBus.addProduct(this.item);
      } else {
        shoppingCartEventBus.orderItemUpdated(this.item, this.orderIndex);
      }
      this.dialog = false;
    },
    resetDialog() {
      this.item = null;
      this.orderIndex = null;
    },
    addToCount(add) {
      this.item.count += add;
      if (this.item.count < 0) {
        this.item.count = 0;
      }
    }
  },
  computed: {
    ...mapGetters({ products: "products", productById: "product" }),
    productAllowedExtras: function() {
      let productExtrasIds = this.productById(this.item.id).extras;
      if (!productExtrasIds) return [];
      return this.products.filter(p => productExtrasIds.includes(p.id));
    },
    isOrder: function() {
      return typeof this.orderIndex === "number";
    },
    itemPrice: function() {
      let itemCount = 'count' in this.item ? this.item.count : 1;
      if (this.item) return priceCalculator.compute(this.item) * itemCount;
    }
  },
  created() {
    shoppingCartEventBus.$on("updateOrderItem", this.updateOrderItem);
    shoppingCartEventBus.$on("productSelected", this.productSelected);
  },
  beforeDestroy() {
    shoppingCartEventBus.$off("updateOrderItem", this.updateOrderItem);
    shoppingCartEventBus.$off("productSelected", this.productSelected);
  },
  watch: {
    dialog: function(value) {
      if (value === false) this.resetDialog();
    }
  },
  components: {
    ProductExtrasSelection
  }
};
</script>

<style>
.light-border {
  color: rgb(85, 85, 85);
  border: 1px solid rgb(134, 134, 134) !important;
  border-radius: 16px;
}
.x-border {
  border: solid rgb(134, 134, 134);
  border-width: 0px 1px 0px 1px;
}
.gray-text {
  color: #5e5b5b;
}
</style>
