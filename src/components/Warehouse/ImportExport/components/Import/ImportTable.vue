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
            DANH SÁCH NHẬP KHO
            <v-btn depressed icon color="primary" @click="fetchData()">
              <v-icon dark>mdi-refresh</v-icon>
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <ImportForm @on-submit="handleOnSubmit" />
        </v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.name="{ item }">
      {{ item.variant.name }}
    </template>
    <template v-slot:item.brand="{ item }">
      {{ item.variant.service.name }}
    </template>
    <template v-slot:item.amount="{ item }">
      {{ item.amount }}
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
import ImportForm from './ImportForm';

export default {
  name: 'ImportTable',
  components: { ImportForm, CoreTable },
  data() {
    return {
      tab: null,
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_PRODUCT_LOG,
      extraParams: {
        type: ['stock_up'],
      },
      tableRf: 'ImportTable',
    };
  },
  computed: {
    headers() {
      const headers = [
        { text: 'Tên sản phẩm', value: 'name', sortable: false },
        {
          text: 'Hãng',
          align: 'start',
          sortable: false,
          value: 'brand',
        },
        { text: 'Số lượng', value: 'amount', sortable: false },
        { text: 'Giá bán', value: 'sale_price', sortable: false },
        { text: 'Ngày nhập', value: 'created_at', sortable: false },
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
