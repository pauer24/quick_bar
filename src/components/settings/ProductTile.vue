<template>
  <v-list-tile>
    <v-list-tile-action>
      <v-icon @click="includeProduct">arrow_back_ios</v-icon>
    </v-list-tile-action>
    <v-list-tile-avatar>
      <v-img :src="product.imageUrl"></v-img>
    </v-list-tile-avatar>
    <v-list-tile-content>
      <v-list-tile-title>{{product.name}}</v-list-tile-title>
    </v-list-tile-content>
    <v-list-tile-avatar class="mr-5">
      <v-chip small v-if="!!product.extras && product.extras.length > 0">
        {{product.extras.length}}
      </v-chip>
      <v-icon v-if="product.allowNotes">notes</v-icon>
    </v-list-tile-avatar>
    <v-list-tile-action>
      <v-btn flat icon color="pink" @click="editProduct">
        <v-icon>edit</v-icon>
      </v-btn>
    </v-list-tile-action>
  </v-list-tile>
</template>

<script>
export default {
  props: ["product"],
  data() {
    return {
      fab: false
    };
  },
  methods: {
    includeProduct() {
      this.$emit('includeProduct', this.product);
    },
    editProduct() {
      this.$router.push("/settings/product/edit/" + this.product.id);
    }
  }
};
</script>
