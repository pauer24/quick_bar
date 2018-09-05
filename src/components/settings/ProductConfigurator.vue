<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 md6 v-for="p in products" :key="p.id">
          <product  :product="p"  />
        </v-flex>
      </v-layout>
    </v-container>
    <v-fab-transition>
      <v-btn color="pink" dark fixed bottom right fab @click="goToNewProduct">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Product from "./Product.vue";

export default {
  methods: {
    goToNewProduct() {
      this.$router.push("/settings/product/new");
    }
  },
  computed: {
    ...mapGetters({
      products: "products"
    })
  },
  components: {
    Product
  },
  directives: {
    price: {
      bind(el, binding, vnode) {}
    }
  }
};
</script>
