<template>
  <div>
    <v-navigation-drawer fixed :mini-variant="miniVariant" v-model="drawer" clipped app>
      <v-list>
        <router-link :to="item.to" tag="v-list-tile" active-class="active" value="true" v-for="item in singleItems" :key="item.title">
          <v-list-tile-action>
            <v-icon v-html="item.icon"></v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"></v-list-tile-title>
          </v-list-tile-content>
        </router-link>
        <v-list-group v-for="item in groupedItems" v-model="item.active" :key="item.title" :prepend-icon="item.icon" no-action>
          <v-list-tile slot="activator">
            <v-list-tile-content>
              <v-list-tile-title>{{ item.title }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>

          <router-link :to="subItem.to" tag="v-list-tile" active-class="active" value="true" v-for="subItem in item.innerItems" :key="subItem.title">
            <v-list-tile-content>
              <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
            </v-list-tile-content>
          </router-link>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <current-order :value="showShoppingCart" @input="updateCurrentOrderVisibility" @itemsCountUpdated="updateShoppingCartItems" />
    <v-toolbar fixed app clipped-left clipped-right>
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-btn icon @click.stop="miniVariant = !miniVariant">
        <v-icon v-html="miniVariant ? 'chevron_right' : 'chevron_left'"></v-icon>
      </v-btn>
      <v-toolbar-title>Q-Bar</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-badge right overlap>
        <span slot="badge" v-if="shoppingCartItemsCount>0">{{ shoppingCartItemsCount }}</span>
        <v-btn icon @click="hideShoppingCart = !hideShoppingCart">
          <v-icon>shopping_cart</v-icon>
        </v-btn>
      </v-badge>
      <user-logged-in-menu :username="username" @userLoggedOut="logOut" />
    </v-toolbar>
    <v-content>
      <v-slide-y-transition mode="out-in">
        <router-view></router-view>
      </v-slide-y-transition>
    </v-content>
    <undo-action-snack v-model="snackUndoObj"></undo-action-snack>
  </div>
</template>

<script>
import { action } from "../../eventBuses";

import UserLoggedInMenu from "./UserLoggedInMenu.vue";
import CurrentOrder from "../CurrentOrder.vue";
import UndoActionSnack from "../common/UndoActionSnack.vue";

export default {
  props: ["username"],
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      hideShoppingCart: false,
      shoppingCartItemsCount: 0,
      singleItems: [
        {
          icon: "notifications",
          title: "Pending orders",
          to: "/orders/pending"
        },
        { icon: "note_add", title: "Add order", to: "/order/new" },
        { icon: "history", title: "Order historic", to: "/history" }
      ],
      groupedItems: [
        {
          icon: "settings",
          title: "Settings",
          innerItems: [{ title: "Menu configurator", to: "/settings/menu" }]
        }
      ],
      miniVariant: false,
      snackUndoObj: null
    };
  },
  methods: {
    logOut() {
      this.$emit("logOut");
    },
    updateShoppingCartItems(newCount) {
      if(this.shoppingCartItemsCount === 0 && newCount > 0) this.hideShoppingCart = false;
      this.shoppingCartItemsCount = newCount
    },
    updateCurrentOrderVisibility(newValue) {
      this.hideShoppingCart = !newValue
    },
    showUndoSnack (actionDescription, undoAction) {
      this.snackUndoObj = { actionDescription, undoAction };
    }
  },
  created() {
    action.$on('allowUndo', showUndoSnack);
  },
  beforeDestroy() {
    action.$off('allowUndo', showUndoSnack);
  },
  computed: {
    showShoppingCart: function() {
      return !this.hideShoppingCart && this.shoppingCartItemsCount > 0;
    }
  },
  components: {
    UserLoggedInMenu,
    CurrentOrder,
    UndoActionSnack
  }
};
</script>
