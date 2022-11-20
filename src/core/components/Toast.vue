<template>
  <v-snackbar
    top
    fixed
    right
    v-model="toast"
    :color="config.color"
    :timeout="5000"
  >
    <span class="font-weight-bold">{{ config.message }}</span>
    <template v-slot:action="{ attrs }">
      <v-btn color="white" text v-bind="attrs" @click="toast = false">
        Đóng
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Toast',
  methods: {
    ...mapActions('toast', ['openToast', 'closeToast']),
  },
  computed: {
    ...mapState('toast', ['model', 'config']),
    toast: {
      get() {
        return this.model;
      },
      set(val) {
        if (val) {
          this.openToast();
          return;
        }
        this.closeToast();
      },
    },
  },
};
</script>
