<template>
  <div>
    <v-app-bar color="grey lighten-5" fixed dense light flat>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
        class="primary--text"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      hide-overlay
      fixed
      width="15rem"
      v-model="drawer"
      class="primary"
      dark
    >
      <slot></slot>
    </v-navigation-drawer>
  </div>
</template>
<script>
export default {
  name: 'MobileSidebar',
};
</script>
<style></style>
