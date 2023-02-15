<template>
  <div class="mobile-nav">
    <v-app-bar color="primary" fixed dense dark flat>
      <v-app-bar-nav-icon
        @click.stop="drawerModel = !drawerModel"
        class="white--text"
      ></v-app-bar-nav-icon>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-navigation-drawer
      fixed
      width="15rem"
      v-model="drawerModel"
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
  data() {
    return {
      drawerModel: false,
    };
  },
};
</script>
<style></style>
