<template>
  <CoreTable
    :headers="headers"
    :url="url"
    :extraParams="extraParams"
    :ref="tableRf"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title
          class="d-flex align-center justify-space"
          style="width:100%"
        >
          <div>
            DANH SÁCH TỒN KHO
          </div>
          <v-spacer></v-spacer>
        </v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.name="{ item }">
      {{ item.name }}
    </template>
    <template v-slot:item.brand="{ item }">
      {{ item.service.name }}
    </template>
    <template v-slot:item.amount="{ item }">
      {{ item.stock }}
    </template>
    <template v-slot:item.price="{ item }">
      {{ item.price | currency }}
    </template>
    <template v-slot:item.sale_price="{ item }">
      {{ item.sale_price | currency }}
    </template>
    <template v-slot:item.created_at="{ item }">
      {{ item.created_at | formatDate(true) }}
    </template>
    <template v-slot:no-data>
      Không có dữ liệu
    </template>
  </CoreTable>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';

export default {
  name: 'ImportTable',
  components: { CoreTable },
  data() {
    return {
      tab: null,
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST,
      extraParams: {
        service_categories: ['goods'],
      },
      tableRf: 'ImportTable',
    }; 
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Tên sản phẩm', value: 'name', sortable: false },
        { text: 'Dòng', value: 'product_line', sortable: false },
        {
          text: 'Hãng',
          align: 'start',
          sortable: false,
          value: 'brand',
        },
        { text: 'Số lượng', value: 'amount', sortable: false },
        { text: 'Giá bán', value: 'sale_price', sortable: false },
      ];
      if (this.loggedRole === 'admin') {
        headers.splice(4, 0, {
          text: 'Giá Nhập',
          value: 'price',
          sortable: false,
        });
      }
      return headers;
    },
  },
  methods: {
    handleOnSubmit(event) {
      if (event && this.$refs[this.tableRf]) {
        this.$refs[this.tableRf].fetchData();
      }
    },
  },
};
</script>
