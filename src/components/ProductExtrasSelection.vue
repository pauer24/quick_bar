<template>
  <v-select
    :value="value"
    @input="extrasChanged"
    :items="dataSource"
    :disabled="disabled"
    item-text="name"
    item-value="id"
    chips multiple persistent-hint extras
    label="Extras" ></v-select>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: ['disabled', 'value', 'extras' ],
  computed: {
    ...mapGetters({ products: 'products' }),
    extraProducts: function() {
      return this.products.filter(p => p.isExtra);
    },
    dataSource: function() {
      return this.extras ? this.extras : this.extraProducts;
    }
  },
  methods: {
    extrasChanged(value) {
      this.$emit('input', value);
    }
  }
};
</script>
