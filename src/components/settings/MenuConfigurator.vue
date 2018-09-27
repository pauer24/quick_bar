<template>
  <div>
    <v-container>
      <v-layout>
        <v-flex xs6>
          <h3>Menu</h3>
          <v-layout>
            <v-flex sm4>
              <v-btn @click="addGroupDialog=true">Add group</v-btn>
            </v-flex>
            <v-flex offset-sm5 sm1>
              <v-btn icon flat v-if="itemUppable" @click="moveItem(-1)" >
                <v-icon>arrow_upward</v-icon>
              </v-btn>
            </v-flex>
            <v-flex sm1>
              <v-btn icon flat v-if="itemDownable" @click="moveItem(1)" >
                <v-icon>arrow_downward</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
          <!-- <tree-view :node="menu" :getLabel="n => n.name" :getNodes="n => n.innerItems"></tree-view> -->
          <ul class="unstyled-ul">
            <menu-tree class="item" :model="menu" @groupEdited="groupEdited" />
          </ul>
          <v-btn dark bottom left fab @click="saveMenu">
            <v-icon>save</v-icon>
          </v-btn>
        </v-flex>
        <v-divider inset vertical class="mx-2"></v-divider>
        <v-flex xs6>
          <div>
            <v-chip small>x</v-chip>: number of extras &nbsp;&nbsp;&nbsp;
            <v-icon>notes</v-icon>: allows notes
          </div>
          <v-list>
            <div v-for="p in sortedProducts" :key="p.id">
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
                  <v-text-field v-model="currentGroup.name" label="Name" :rules="requiredField" required></v-text-field>
                  <v-text-field v-model="currentGroup.imageUrl" label="Image URL" :rules="requiredField" required></v-text-field>
                </v-flex>
                <v-flex xs12 offset-sm2 sm4>
                  <p>Actual image</p>
                  <img :src="currentGroup.imageUrl" height="200px" alt="">
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

import MenuTree from "./MenuTree.vue";
import ProductTile from "./ProductTile.vue";

export default {
  data() {
    return {
      selectedNode: null,
      selectedParentNode: null,
      selectedNodeIndex: -1,
      addGroupDialog: false,
      validGroupForm: false,
      snackbar: false,
      snackbarMessage: "",
      currentGroup: {},
      updatedMenu: null,
      updateGroupMethod: null,
      groupToUpdateModel: null,
      requiredField: [v => !!v || "Field is required"],
    };
  },
  methods: {
    ...mapActions({ updateMenu: "updateMenu" }),
    addItem(item) {
      if (!this.isMenuItemSelected) {
        this.menu.children.splice(0, 0, item);
      } else if (this.selectedNode.isFolder) {
        this.selectedNode.addChild(item, 0);
      } else {
        this.selectedParentNode.addChild(item, this.selectedNodeIndex);
      }
    },
    addGroup() {
      if (this.updateGroupMethod === null) {
        this.currentGroup.children = [];
        this.addItem(this.currentGroup);
      } else {
        this.updateGroupMethod(this.currentGroup);
      }

      // restart everything else
      this.updateGroupMethod = null;
      this.currentGroup = {};
      this.addGroupDialog = false;
    },
    createProduct() {
      this.$router.push("/settings/product/new");
    },
    saveMenu() {
      this.updateMenu({menu: this.menu, onUpdate: () => {
        this.snackbarMessage = "The menu has been saved successfully";
        this.snackbar = true;
        }
      });
    },
    groupEdited(newValue, index) {
      this.menu.children[index] = newValue;
    },
    moveItem(positionsToMove) {
      let copy = this.selectedParentNode.model.children;

      copy.splice(
        this.selectedNodeIndex + positionsToMove, 0,
        copy.splice(this.selectedNodeIndex, 1)[0]);
        debugger;
    }
  },
  computed: {
    ...mapGetters({ products: "products", lastStoredMenu: "menu" }),
    sortedProducts: function() {
      return Enumerable.from(this.products).orderBy(p => !!p.isExtra).toArray();
    },
    menu: {
      get: function() {
        return this.updatedMenu === null
          ? this.lastStoredMenu
          : this.updatedMenu;
      },
      set: function(value) {
        this.updatedMenu = value;
      }
    },
    isMenuItemSelected: function() {
      return this.selectedNode !== null;
    },
    itemUppable: function() {
      return !!this.selectedNode && !!this.selectedParentNode && this.selectedParentNode.model.children.length > 1 && this.selectedNodeIndex > 0 ;
    },
    itemDownable: function() {
      let parentChildrenCount = this.selectedParentNode ? this.selectedParentNode.model.children.length : 0;
      return !!this.selectedNode && parentChildrenCount > 1 && this.selectedNodeIndex < parentChildrenCount - 1
    }
  },
  created() {
    let component = this;

    menuTreeEventBus.$on(
      "nodeSelected",
      (selectedNode, parentNode, nodeIndex) => {
        this.selectedNode = selectedNode;
        this.selectedParentNode = parentNode;
        this.selectedNodeIndex = nodeIndex;
      }
    );

    menuTreeEventBus.$on("editGroup", (groupModel, updateGroupMethod) => {
      this.currentGroup = groupModel;
      this.updateGroupMethod = updateGroupMethod;
      this.addGroupDialog = true;
    });
  },
  components: {
    ProductTile,
    MenuTree
  }
};
</script>

<style>
.unstyled-ul {
  list-style: none;
}
</style>
