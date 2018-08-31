<template>
  <v-container>
    <p v-for="(p, index) in products" :key="index">{{p}}</p>
    <v-fab-transition>
      <v-btn color="pink" dark absolute bottom left fab @click="goToNewProduct">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import firebase from "firebase";
import Enumerable from "linq";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      products: [],
      productsSubscription: null
    };
  },
  created() {
    let products = this.products;
    this.productsCollection.onSnapshot(
      function(snapshot) {
        products.splice(0, products.length);
        Enumerable.from(snapshot.docs).forEach(d => {
          let product = d.data();
          product.id = d.id;
          products.push(product);
        });
      },
      function(error) {
        throw error;
      }
    );
  },
  methods: {
    goToNewProduct() {
      this.$router.push('/settings/product/new')
    }
  },
  computed: {
    ...mapGetters({
      productsCollection: "productsCollection"
    })
  }
};
</script>
