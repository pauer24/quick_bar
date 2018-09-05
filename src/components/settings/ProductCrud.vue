<template>
  <div>
    <v-container row wrap v-if="!loading">
      <h1>{{ title }} a product</h1>
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-layout>
          <v-flex xs12>
            <v-text-field v-model="product.name" label="Name" :rules="requiredField" required></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout row>
          <v-flex xs12 sm6>
            <v-text-field v-model="product.imageUrl" label="ImageUrl" :rules="requiredField" required></v-text-field>
          </v-flex>
          <v-flex xs12 offset-sm2 sm4>
            <p>Actual image</p>
            <img :src="product.imageUrl" height="200px" alt="">
          </v-flex>
        </v-layout>
        <v-layout row wrap>
          <v-flex xs12 sm6>
            <v-text-field v-model="product.price" label="Price (€)" type="number" :rules="requiredField" required></v-text-field>
          </v-flex>
          <v-flex xs12 offset-sm3 sm3>
            <v-switch v-model="product.allowNotes" label="Allow notes"></v-switch>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <v-select v-model="product.extras" :items="products" item-text="name" item-value="id" persistent-hint extras label="Extras" chips multiple></v-select>
          </v-flex>
        </v-layout>
        <v-btn @click="submit" :disabled="!valid">{{btnLabel}}</v-btn>
      </v-form>
    </v-container>
    <v-snackbar v-model="snackbar" color="success" :timeout="2000">
      The product has been successfully {{actionPerformed}}
    </v-snackbar>
    <v-dialog v-model="loading" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Loading product
          <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Enumerable from "linq";

export default {
  data() {
    return {
      isEdition: false,
      snackbar: false,
      valid: true,
      product: {},
      requiredField: [v => !!v || "Field is required"]
    };
  },
  created() {
    this.isEdition = !!this.$route.params.id;
    if (this.isEdition) {
      let tryUpdateRecursive = () => {
        this.product = Enumerable.from(this.products).firstOrDefault(
          p => p.id == this.$route.params.id
        );

        if(!this.loading) return;
        setTimeout(tryUpdateRecursive, 200);
      };

      tryUpdateRecursive();
    }
  },
  computed: {
    ...mapGetters({ products: "products" }),
    title: function() {
      return this.isEdition ? "Edit" : "Create";
    },
    actionPerformed: function() {
      return this.isEdition ? "updated" : "saved";
    },
    btnLabel: function() {
      return this.isEdition ? "Update" : "Save";
    },
    loading: function() {
      return this.isEdition && !this.product;
    }
  },
  methods: {
    ...mapActions({
      saveProduct: 'saveProduct',
      updateProduct: 'updateProduct' }),
    submit() {
      if (this.$refs.form.validate()) {
        if (!this.isEdition) {
          this.saveProduct(this.product);
          this.$refs.form.reset();
          this.snackbar = true;
        } else {
          this.updateProduct(this.product);
          this.$router.go(-1);
        }
      }
    }
  }
};
</script>
