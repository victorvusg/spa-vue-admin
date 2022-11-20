<template>
  <div>
    <v-breadcrumbs :items="breadcrumbs" class="pl-0" />
    <div class="d-flex mb-4">
      <h3 class="mr-auto">
        {{ heading }}
      </h3>
      <slot name="title-right"></slot>
    </div>
    <slot />
  </div>
</template>
<script>
export default {
  name: 'DetailPageBase',
  props: {
    heading: {
      type: String,
      default: '',
      require: true,
    },
    breadcrumbs: {
      type: Array,
      default: null,
      require: true,
    },
  },
};
</script>
<style></style>
