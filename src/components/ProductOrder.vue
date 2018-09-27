<template>
  <v-dialog v-model="dialog" width="500" v-if="item">
    <v-card>
      <v-card-title class="headline grey lighten-2" primary-title>
        {{item.name}}
      </v-card-title>
      <v-card-text>
        <v-layout>
          <product-extras-selection v-model="item.extras" :extras="productAllowedExtras"></product-extras-selection>
        </v-layout>
        <v-layout v-if="isOrder">
          <v-icon>mdi-minus</v-icon> {{item.count}} <v-icon>mdi-plus</v-icon>
        </v-layout>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn fab dark color="green">
          <v-icon dark>check</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters } from "vuex";
import { shoppingCartEventBus } from "../eventBuses";

import ProductExtrasSelection from "./ProductExtrasSelection.vue";

export default {
  data() {
    return {
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

      debugger;
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
    resetDialog() {
      this.item = null;
      this.orderIndex = null;
    }
  },
  computed: {
    ...mapGetters({ products: "products", productById: "product" }),
    productAllowedExtras: function() {
      let productExtrasIds = this.productById(this.item.id).extras;
      return this.products.filter(p => productExtrasIds.includes(p.id));
    },
    isOrder: function() {
      return typeof this.orderIndex === "number";
    }
  },
  created() {
    shoppingCartEventBus.$on("updateOrderItem", this.updateOrderItem);
    shoppingCartEventBus.$on("productSelected", this.productSelected);
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
