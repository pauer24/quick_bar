<template>
  <div>
    <div class="ma-3" row wrap v-if="!loading">
      <h1>{{ title }} a product</h1>
      <v-form ref="form" v-model="valid">
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
          <v-flex xs6 sm3>
            <v-text-field v-model="product.price" label="Price (€)" type="number" :rules="requiredField" required></v-text-field>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-switch v-model="product.allowNotes" label="Allow notes"></v-switch>
          <v-switch v-model="product.isExtra" label="Is extra"></v-switch>
        </v-layout>
        <v-layout>
          <v-flex xs12>
            <product-extras-selection v-model="product.extras" :disabled="product.isExtra" />
          </v-flex>
        </v-layout>
        <v-btn @click="submit" :disabled="!valid">{{btnLabel}}</v-btn>
      </v-form>
      <v-btn absolute dark fab bottom right color="red darken-4" @click="deleteDialog = true">
        <v-icon>delete</v-icon>
      </v-btn>
    </div>
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
    <v-dialog v-model="deleteDialog" max-width="290">
      <v-card>
        <v-card-title class="headline">Are you sure?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" flat="flat" @click="remove">
            CONFIRM
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Enumerable from "linq";

import ProductExtrasSelection from '../ProductExtrasSelection.vue'

export default {
  data() {
    return {
      isEdition: false,
      snackbar: false,
      valid: false,
      product: {},
      deleteDialog: false,
      requiredField: [v => !!v || "Field is required"]
    };
  },
  created() {
    this.isEdition = !!this.$route.params.id;
    if (this.isEdition) {
      let component = this;
      let tryUpdateRecursive = () => {
        component.product = component.productById(component.$route.params.id);
        if (!component.loading) return;
        setTimeout(tryUpdateRecursive, 200);
      };

      tryUpdateRecursive();
    }
  },
  computed: {
    ...mapGetters({ products: "products", productById: "product" }),
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
      saveProduct: "saveProduct",
      updateProduct: "updateProduct",
      deleteProduct: "deleteProduct"
    }),
    submit() {
      if (this.product.isExtra) {
        delete this.product.extras;
      }
      if (this.$refs.form.validate()) {
        let component = this;
        if (!this.isEdition) {
          this.saveProduct({ product: this.product, onSuccess: () => {
            component.$refs.form.reset();
            component.snackbar = true;
          }});
        } else {
          this.updateProduct({ product: this.product, onSuccess: () => { component.$router.go(-1)}});
        }
      }
    },
    remove() {
      let component = this;
      let productId = this.product.id;
      Enumerable.from(this.products).forEach(p => {
        if (!!p.extras && p.extras.includes(productId)) {
          p.extras.splice(p.extras.indexOf(productId), 1);
          component.updateProduct(p);
          console.debug("Product removed as extra from product", p);
        }
      });

      this.deleteProduct({
        product: this.product,
        onSuccess: () => {
          console.debug("Product removed", this.product);
          this.deleteDialog = false;
          this.$router.go(-1);
        }
      });
    }
  },
  components: {
    ProductExtrasSelection
  }
};
</script>
