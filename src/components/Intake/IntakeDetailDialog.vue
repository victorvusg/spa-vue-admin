<template>
  <v-dialog
    :scrollable="false"
    persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    content-class="grey lighten-5"
  >
    <template v-if="dialog">
      <v-toolbar
        :class="{ 'mobile-toolbar': isMobile }"
        dark
        color="primary"
        elevation="0"
        rounded="false"
        style="z-index: 2"
      >
        <v-toolbar-title>Chi Tiết Đơn</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="close">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <Detail
        v-if="id !== null && dialog"
        :id="id"
        :style="!isMobile ? { height: 'calc(100% - 64px)' } : {}"
         @intake-updated="$emit('intake-updated')"
      />
    </template>
  </v-dialog>
</template>
<script>
/* eslint-disable camelcase */
import Detail from '@/components/Intake/Detail';

export default {
  name: 'IntakeDetailDialog',
  props: {
    id: {
      required: true,
    },
  },
  components: {
    Detail,
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    async openDialog() {
      this.dialog = true;
    },
    async close() {
      this.dialog = false;
    },
  },
};
</script>
<style lang="scss"></style>
