<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm6>
        <product-configurator></product-configurator>
      </v-flex>
      <v-flex xs12 sm6>
        <menu-configurator></menu-configurator>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import ProductConfigurator from "./ProductConfigurator.vue";
import MenuConfigurator from "./MenuConfigurator.vue";

export default {
  components: {
    productConfigurator: ProductConfigurator,
    menuConfigurator: MenuConfigurator
  }
};
</script>
