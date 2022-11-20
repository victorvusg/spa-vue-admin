<template>
  <div
    class="d-flex align-center justify-space-between"
    :class="{ 'flex-column': isMobile }"
  >
    <div>
      Showing {{ from }} {{ $t('to') }} {{ to }} {{ $t('of') }} {{ totalItems }}
    </div>
    <v-pagination
      v-bind="$attrs"
      v-on="$listeners"
      class="core-pagination"
    ></v-pagination>
  </div>
</template>
<script>
export default {
  name: 'CorePagination',
  props: {
    totleItems: {
      default: 0,
    },
  },
  computed: {
    from() {
      return this.$attrs.itemsPerPage * (this.$attrs.value - 1) + 1;
    },
    to() {
      return this.$attrs.value * this.$attrs.itemsPerPage;
    },
    totalItems() {
      return this.$attrs.totalItems;
    },
  },
};
</script>
