<template>
  <v-navigation-drawer
    hide-overlay
    fixed
    class="primary desktop-nav"
    mobile-breakpoint="1024"
    dark
    disable-resize-watcher
  >
    <slot></slot>
  </v-navigation-drawer>
</template>
<script>
export default {
  name: 'DesktopSidebar',
};
</script>
<style></style>
