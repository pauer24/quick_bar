import Vue from 'vue'

export const menuTreeEventBus = new Vue({
  methods: {
    nodeSelected(selectedNode) {
      this.$emit('nodeSelected', selectedNode);
    }
  }
});
