<template>
  <li>
    <v-layout @mouseover="isMouseOver=true" @mouseleave="isMouseOver=false" :class="{selected: isSelected || isMouseOver}" v-if="model.name">
      <v-flex xs5 @click="nodeClicked">
        <div :class="{bold: isFolder}">{{ model.name }}
          <span class="clickable" v-if="isFolder" @click="toggle">[{{ open ? '-' : '+' }}]</span>
        </div>
      </v-flex>
      <v-flex xs3 offset-xs2>
        <v-img max-height="30px" :src="model.imageUrl"></v-img>
      </v-flex>
      <v-flex xs1>
        <v-icon v-if="isMouseOver && !isRoot && isFolder" @click="editGroup">edit</v-icon>
      </v-flex>
      <v-flex xs1>
        <v-icon v-if="isMouseOver && !isRoot" @click="deleteMe">delete</v-icon>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex xs12>
        <ul v-show="open" v-if="isFolder">
          <menu-tree @groupEdited="childGroupEdited" class="item" v-for="(child, index) in model.children" :key="index" :index="index" :model="child" />
        </ul>
      </v-flex>
    </v-layout>
  </li>
</template>

<script>
import { mapGetters } from "vuex";

import MenuTree from "./MenuTree.vue";
import { menuTreeEventBus } from "../../eventBuses";

export default {
  name: "menu-tree",
  props: {
    model: Object,
    index: Number
  },
  data: function() {
    return {
      open: true,
      isMouseOver: false,
      isSelected: false
    };
  },
  computed: {
    ...mapGetters({ getProduct : 'product'}),
    isFolder: function() {
      return this.model.children;
    },
    isRoot() {
      return !!!this.$parent.model;
    }
  },
  methods: {
    toggle: function() {
      if (this.isFolder) {
        this.open = !this.open;
      }
    },
    deleteMe: function() {
      this.$parent.model.children.splice(this.index, 1);
    },
    editGroup() {
      menuTreeEventBus.$emit("editGroup", this.model, (newValue) => {
        this.$emit('groupEdited', newValue, this.index)
      });
    },
    nodeClicked: function() {
      menuTreeEventBus.$emit("nodeSelected", this, this.$parent, this.index);
    },
    addChild(item, index) {
      if (!this.isFolder) throw "Cannot add children to non folder item";

      this.model.children.splice(index, 0, item);
    },
    childGroupEdited(childValue, childIndex) {

      this.model.children[childIndex] = childValue;
      this.$emit('groupEdited', this.model, this.index)
    }
  },
  created() {
    menuTreeEventBus.$on("nodeSelected", (node, parent, index) => {
      this.isSelected = node === this;
    });

  },
  components: {
    MenuTree
  }
};
</script>

<style scoped>
.item {
  font-family: Menlo, Consolas, monospace;
  color: #444;
}
.clickable {
  cursor: pointer;
}
.bold {
  font-weight: bold;
}
ul.root {
  list-style: none;
}
ul {
  padding-left: 1em;
  line-height: 1.5em;
  list-style-type: dot;
}
.selected {
  background-color: #e7eef7;
}
</style>
