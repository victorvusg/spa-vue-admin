<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="dataSet"
      :items-per-page="15"
      item-key="id"
    >
      <template v-slot:no-data>
        {{ $t('Không có dữ liệu') }}
      </template>
      <template v-slot:item.name="{ item }">
        {{ item.name }}
      </template>
      <template v-slot:item.sale_commission="{ item }">
        {{ item.sale_commission | currency }}
      </template>
      <template v-slot:item.working_commission="{ item }">
        {{ item.working_commission | currency }}
      </template>
      <template v-slot:item.topup_commission="{ item }">
        {{ item.topup_commission | currency }}
      </template>
      <template v-slot:item.action="{ item }">
        <CommissionDetails
          ref="detailDialog"
          :item="item"
          :dateParams="dateParams"
        />
      </template>
      <template v-slot:item.income="{ item }">
        <span class="primary--text">
          {{
            (item.sale_commission +
              item.working_commission +
              item.topup_commission)
              | currency
          }}
        </span>
      </template>
    </v-data-table>
  </div>
</template>
<script>
import CommissionDetails from './CommissionDetails/Index';

export default {
  name: 'CommissionSummary',
  components: {
    CommissionDetails,
  },
  props: {
    dataSet: {
      required: true,
    },
    dateParams: {
      default: () => {},
    },
  },
  data() {
    return {
      tab: 'intakes',
      headers: [
        { text: 'Nhân Viên', value: 'name' },
        {
          text: 'Sale Commission',
          value: 'sale_commission',
        },
        {
          text: 'Working Commission',
          value: 'working_commission',
        },
        {
          text: 'Topup Commission',
          value: 'topup_commission',
        },
        {
          text: 'Tổng Commission',
          value: 'income',
        },
        {
          text: '',
          value: 'action',
        },
      ],
    };
  },
};
</script>
