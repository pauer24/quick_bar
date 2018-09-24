<template>
  <div class="tree-menu">
    <div :style="indent">{{ getLabel(node) }}</div>
    <tree-view
      v-for="innerNode in getNodes(node)"
      :getLabel="getLabel"
      :getNodes="getNodes"
      :node="innerNode"
      :depth="nextDepth"
      v-bind:key="nextDepth + getLabel(innerNode)">
    </tree-view>
  </div>
</template>

<script>
import TreeView from "./TreeView.vue";

export default {
  name: "tree-view",
  props: {
    node: { type: Object, required: true},
    getLabel: {
      type: Function,
      default: n =>  n.label
    },
    getNodes: {
      type: Function,
      default: n => n.nodes
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  computed: {
    indent() {
      if (this.depth === 0 && !this.getLabel(this.node)) {
        return null;
      }

      return { transform: `translate(${this.depth * 30}px)` };
    },
    nextDepth() {
      return this.indent === null ? 0 : this.depth+1;
    }
  },
  components: {
    TreeView
  }
};
</script>
