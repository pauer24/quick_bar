<template>
  <div>
    <v-container fluid grid-list-md>
      <v-layout>
        <v-flex>
          <v-btn fab dark color="red" :disabled="selectedGroup===null" @click="previousGroup">
            <v-icon dark>arrow_back</v-icon>
          </v-btn>
        </v-flex>
        <v-flex>
          <h1>
            {{selectedGroup ? selectedGroup.item.name : 'Main menu'}}
          </h1>
        </v-flex>
      </v-layout>
      <v-layout row wrap v-if="!selectedMenu || selectedMenu.length > 0">
        <v-flex xs6 sm4 md3 v-for="(item, index) in selectedMenu" :key="index">
          <v-card @click.native="itemSelected(item)" class="clickable">
            <v-img :src="item.imageUrl" height="200" class="white--text" contain>
              <div class="back-gradient">
                <p class="order-item ma-3">
                  {{item.name}}
                </p>
              </div>
            </v-img>
          </v-card>
        </v-flex>
      </v-layout>
      <h2 class="ma-4" v-else>
        Ooops!! Seems that the group is empty
      </h2>
    </v-container>
    <product-order></product-order>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { shoppingCartEventBus } from "../eventBuses"
import ProductOrder from './ProductOrder.vue';

export default {
  data() {
    return {
      selectedGroup: null,
      selectedProduct: null,
      clickEvent: null
    };
  },
  computed: {
    ...mapGetters({ menu: "menu" }),
    selectedMenu: function() {
      return !!this.selectedGroup
        ? this.selectedGroup.item.children
        : this.menu.children;
    }
  },
  methods: {
    itemSelected(item) {
      // debugger;
      if (item.children) {
        this.selectedGroup = {
          item: item,
          previous: this.selectedGroup
        };
      } else {
        this.selectProduct(item);
      }
    },
    previousGroup() {
      this.selectedGroup = this.selectedGroup.previous;
    },
    selectProduct(product) {
      console.warn('Product selected. Calling eventBus')
      shoppingCartEventBus.productSelected(product);
    },
    saveProduct(newValues) {
      this.selectedProduct = null;
    }
  },
  components: {
    ProductOrder
  }
};
</script>

<style>
.back-gradient {
  background-image: linear-gradient(
    #7e7e7e00,
    rgba(126, 126, 126, 0.562),
    rgba(126, 126, 126, 0.562),
    #7e7e7e00
  );
}
.order-item {
  font-size: 20pt;
}
.clickable {
  cursor: pointer;
}
</style>
