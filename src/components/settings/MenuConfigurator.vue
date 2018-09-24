<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs5>
          <h3>Menu</h3>
          <v-btn @click="addGroupDialog=true">Add group</v-btn>
          <!-- <tree-view :node="menu" :getLabel="n => n.name" :getNodes="n => n.innerItems"></tree-view> -->
          <ul class="unstyled-ul">
            <menu-tree class="item" :model="menu" />
          </ul>

      <v-btn dark bottom left fab @click="saveMenu">
        <v-icon>save</v-icon>
      </v-btn>
        </v-flex>
        <v-divider inset vertical></v-divider>
        <v-flex xs5>
          <div>
            <v-chip small>x</v-chip>: number of extras &nbsp;&nbsp;&nbsp;
            <v-icon>notes</v-icon>: allows notes
          </div>
          <v-list>
            <div v-for="p in products" :key="p.id">
              <product-tile :product="p" @includeProduct="addItem" />
              <v-divider class="mx-5" />
            </div>
          </v-list>
        </v-flex>
      </v-layout>
    </v-container>
    <v-fab-transition>
      <v-btn color="green" dark fixed bottom right fab @click="createProduct">
        <v-icon>add</v-icon>
      </v-btn>
    </v-fab-transition>
    <v-dialog v-model="addGroupDialog">
      <v-form ref="form" v-model="validGroupForm">
        <v-card>
          <v-card-title>
            <h1>Add a group</h1>
          </v-card-title>
          <v-card-text>
            <v-container fluid>
              <v-layout>
                <v-flex xs12 sm6>
                  <v-text-field v-model="newGroup.name" label="Name" :rules="requiredField" required></v-text-field>
                  <v-text-field v-model="newGroup.imageUrl" label="Image URL" :rules="requiredField" required></v-text-field>
                </v-flex>
                <v-flex xs12 offset-sm2 sm4>
                  <p>Actual image</p>
                  <img :src="newGroup.imageUrl" height="200px" alt="">
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-btn color="success" @click="addGroup" :disabled="!validGroupForm">Save</v-btn>
            <v-btn color="error" flat @click="addGroupDialog=false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar v-model="snackbar" color="success" :timeout="2000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { menuTreeEventBus } from "../../eventBuses";
import Enumerable from "linq";

import TreeView from "./TreeView.vue";
import MenuTree from "./MenuTree.vue";
import ProductTile from "./ProductTile.vue";

export default {
  data() {
    return {
      selectedNode: null,
      selectedParentNode: null,
      selectedNodeIndex: -1,
      addGroupDialog: false,
      groupToUpdate: {},
      validGroupForm: false,
      snackbar: false,
      snackbarMessage: '',
      newGroup: {},
      requiredField: [v => !!v || "Field is required"],
      updatedMenu: null
    };
  },
  methods: {
    ...mapActions({ updateMenu: 'updateMenu'}),
    addItem(item) {
      debugger
      if (!this.isMenuItemSelected) {
        this.menu.children.splice(0,0,item);
      } else if (this.selectedNode.isFolder) {
        this.selectedNode.addChild(item, 0);
      } else {
        this.selectedParentNode.addChild(item, this.selectedNodeIndex);
      }
    },
    addGroup() {
      if (this.groupToUpdate === null) {
        this.newGroup.children = [];
        this.addItem(this.newGroup);
      } else {
        this.groupToUpdate.model = this.newGroup;
      }

      // restart everything else
      this.groupToUpdate = null;
      this.newGroup = {};
      this.addGroupDialog = false;
    },
    createProduct() {
      this.$router.push("/settings/product/new");
    },
    saveMenu() {
      this.updateMenu(this.menu, () => console.error('Menu saved'));
      console.warn('Saving menu:', this.menu.children);

      this.snackbarMessage = "The menu has been saved successfully"
      this.snackbar = true;
    }
  },
  computed: {
    ...mapGetters({ products: "products", lastStoredMenu: "menu" }),
    menu: {
      get: function() {
        return this.updatedMenu === null ? this.lastStoredMenu : this.updatedMenu;
      },
      set: function(value) {
        this.updatedMenu = value;
      }
    },
    // menu: function() {
      // let children = !!this.storedMenu.children ? this.storedMenu : [];
      // let a = {name: null, children: children};
      // console.error('Menu:', a);
      // return this.storedMenu;
    // },
    isMenuItemSelected: function() {
      return this.selectedNode !== null;
    }
  },
  watch: {
    lastStoredMenu: function(val) {
      console.error('Watch triggered')
      this.menu = val;
    }
  },
  created() {
    menuTreeEventBus.$on(
      "nodeSelected",
      (selectedNode, parentNode, nodeIndex) => {
        this.selectedNode = selectedNode;
        this.selectedParentNode = parentNode;
        this.selectedNodeIndex = nodeIndex;
      }
    );

    menuTreeEventBus.$on(
      "editGroup",
      (groupNode) => {
        this.groupToUpdate = groupNode;
        this.newGroup = Object.assign({}, groupNode.model);
        this.addGroupDialog = true;
      }
    );
  },
  components: {
    ProductTile,
    TreeView,
    MenuTree
  }
};
</script>

<style>
.unstyled-ul {
  list-style: none;
}
</style>
