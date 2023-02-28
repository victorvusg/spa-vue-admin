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
            DANH SÁCH XUẤT KHO
            <v-btn depressed icon color="primary" @click="fetchData()">
              <v-icon dark>mdi-refresh</v-icon>
            </v-btn>
          </div>
        </v-toolbar-title>
      </v-toolbar>
    </template>
    <template v-slot:item.name="{ item }">
      {{ item.variant.name }}
    </template>
    <template v-slot:item.brand="{ item }">
      {{ item.variant.service.name }}
    </template>
    <template v-slot:item.type="{ item }">
      {{ $t(item.type) }}
    </template>
    <template v-slot:item.amount="{ item }">
      {{ item.amount }}
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
      headers: [
        { text: 'Tên sản phẩm', value: 'name', sortable: false },
        {
          text: 'Hãng',
          align: 'start',
          sortable: false,
          value: 'brand',
        },
        { text: 'Nội Dung', value: 'type', sortable: false },
        { text: 'Số lượng', value: 'amount', sortable: false },
        { text: 'Ngày xuất', value: 'created_at', sortable: false },
      ],
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_PRODUCT_LOG,
      extraParams: {
        type: ['sell', 'use'],
      },
      tableRf: 'ImportTable',
    };
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
