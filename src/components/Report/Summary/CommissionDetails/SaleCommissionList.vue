<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="queryParams"
      :ref="tableRf"
    >
      <template v-slot:item.sale_commission="{ item }">
        {{ item.sale_commission | currency }}
      </template>
      <template v-slot:item.total_price="{ item }">
        {{ item.total_price | currency }}
      </template>
      <template v-slot:no-data>
        {{ $t('employees.no_ktv_found') }}
      </template>
    </CoreTable>
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';

export default {
  name: 'SaleCommissionList',
  props: {
    queryParams: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    CoreTable,
  },
  data() {
    return {
      tableRf: 'saleCommissionList',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST,
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Tổng giá trị',
          value: 'total_price',
        },
        {
          text: 'Hoa Hồng',
          value: 'sale_commission',
        },
      ],
    };
  },
};
</script>
<style></style>
