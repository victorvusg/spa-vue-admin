<template>
  <div
    class="main-content"
    :class="{
      'padding-for-sidebar': !isMobile,
    }"
  >
    <!-- <h3 class="mb-4" v-if="viewTitle">
      {{ viewTitle }}
    </h3> -->
    <v-breadcrumbs
      :items="breadcrumbsItems"
      class="pl-0"
      v-if="breadcrumbsItems"
    />
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: 'ViewLayout',
  props: {
    breadcrumbsItems: {
      default: null,
    },
    viewTitle: {
      default: null,
    },
  },
};
</script>
