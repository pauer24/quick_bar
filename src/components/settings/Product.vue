<template>
  <v-card>
    <v-container fluid>
      <v-layout row wrap>
        <v-flex xs12 md5>
          <v-img :src="product.imageUrl" width="100%"></v-img>
        </v-flex>
        <v-flex xs12 md7>
          <v-card-title primary-title>
            <div>
              <div class="headline">{{product.name}}</div>
              <div>{{product.price}} €</div>
              <div>
                <v-switch v-model="product.allowNotes" label="Allow notes" disabled></v-switch>
              </div>
            </div>
          </v-card-title>
        </v-flex>
        <v-fab-transition>
          <v-btn color="pink" fab dark small absolute bottom right class="mb-4" @click="editProduct">
            <v-icon>edit</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-layout>
      <div v-if="!!product.extras && product.extras.length > 0">
        <v-divider light></v-divider>
        <v-layout class="pt-3">
          <div class="text-xs-center" v-for="(extra) in product.extras" :key="extra">
            <v-chip>{{getProductName(extra)}}</v-chip>
          </div>
        </v-layout>
      </div>
    </v-container>
  </v-card>
</template>

<script>
import { mapGetters } from "vuex";
import Enumerable from "linq";

export default {
  props: ["product"],
  data() {
    return {
      fab: false
    };
  },
  methods: {
    getProductName(productId) {
      var extraProduct = Enumerable.from(this.products).firstOrDefault(
        p => p.id === productId
      );

      return extraProduct ? extraProduct.name : null;
    },
    editProduct() {
      this.$router.push('/settings/product/edit/'+ this.product.id);
    }
  },
  computed: {
    ...mapGetters({ products: "products" })
  }
};
</script>
