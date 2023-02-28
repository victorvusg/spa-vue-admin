<template>
  <div class="service-list">
    <div class="d-flex align-center justify-space-between py-4">
      <h3>Quản lý hàng</h3>
    </div>
    <v-card class="rounded-lg overflow-hidden" elevation="4">
      <v-tabs
        show-arrows
        grow
        v-model="tab"
        background-color="grey lighten-4"
        color="black"
        class="service-tabs custom"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab :href="'#warehouse-import'">Nhập kho</v-tab>
        <v-tab :href="'#warehouse-export'">Xuất kho</v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item value="warehouse-import">
          <ImportTable />
        </v-tab-item>
        <v-tab-item value="warehouse-export">Xuat kho</v-tab-item>
      </v-tabs-items>
    </v-card>
  </div>
</template>
<!-- eslint-disable no-unused-expressions -->
<script>
import ImportTable from './components/Import/ImportTable';

export default {
  name: 'ImportExport',
  components: {
    ImportTable,
  },
  data() {
    return {
      tab: null,
    };
  },
};
</script>
<style lang="scss">
.service-list {
  .v-data-table__expanded__content {
    background-color: #fafafa !important;
    box-shadow: none !important;
    .variants {
      background-color: #fff;
    }
  }
}
</style>
