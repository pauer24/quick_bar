<template>
  <v-snackbar v-model="show" bottom :timeout="timeout">
    {{ text }}
    <v-btn color="pink" flat @click="performUndo">
      Undo
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      text: ''
    };
  },
  props: {
    value: Object,
    timeout: {
      type: Number,
      default: 3000
    }
  },
  methods: {
    performUndo() {
      this.value.undoAction();
      this.show = false;
    }
  },
  watch: {
    value: function(newValue) {
      let component = this;
      if (newValue) {
        this.show = true;
        this.text = this.value.actionDescription;
      }
    },
    show: function(newValue) {
      if (!newValue) {
          this.$emit("input", null);
      }
    }
  }
};
</script>
