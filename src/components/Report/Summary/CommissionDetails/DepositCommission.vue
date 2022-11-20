<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="computedQueryParams"
      :ref="tableRf"
    >
      <template v-slot:item.sale_commission="{ item }">
        {{ item.topup_commission | currency }}
      </template>
      <template v-slot:item.total_price="{ item }">
        {{ item.amount | currency }}
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
  name: 'DepositCommission',
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
      tableRf: 'depositCommission',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_INVOICE_LIST,
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
  computed: {
    computedQueryParams() {
      return {
        type: 'deposit',
        ...this.queryParams,
      };
    },
  },
};
</script>
<style></style>
