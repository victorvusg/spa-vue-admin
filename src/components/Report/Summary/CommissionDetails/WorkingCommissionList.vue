<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="computedQueryParams"
      :ref="tableRf"
    >
      <template v-slot:item.working_commission="{ item }">
        {{ item.working_commission | currency }}
      </template>
      <template v-slot:item.price="{ item }">
        <div v-if="item.combo_id">
          Gói -
          <span class="primary--text">{{ item.variant.price | currency }}</span>
        </div>
        <div v-else class="primary--text">
          {{ item.price | currency }}
        </div>
      </template>
      <template v-slot:item.commission_rate="{ item }">
        {{ item.variant.commission_rate }} %
      </template>
      <template v-slot:item.point="{ item }">
        <span v-if="item.review"
          >{{ item.review.skill + item.review.attitude }} (<strong
            >{{ pointRate(item.review.skill, item.review.attitude) }} %</strong
          >)</span
        >
        <span v-else>-</span>
      </template>
      <template v-slot:item.is_overtime="{ item }">
        <span v-if="item.is_overtime" class="font-weight-bold error--text">
          Tăng ca
        </span>
        <span v-else>-</span>
      </template>
      <template v-slot:item.time="{ item }">
        <div>
          <div>
            <strong>Tạo lúc </strong>
            <span>{{ item.created_at | formatDate(true) }}</span>
          </div>
          <div>
            <strong>Đóng lúc: </strong>
            <span>{{ item.approved_time | formatDate(true) }}</span>
          </div>
        </div>
      </template>
      <!-- TODO: FOR DEBUG -->
      <!-- <template v-slot:item.reCalculate="{ item }">
        <span
          :class="{
            'error--text font-weight-bold':
              reCalculate(item) !== item.working_commission,
          }"
        >
          {{ reCalculate(item) }}
        </span>
      </template> -->
      <template v-slot:no-data>
        {{ $t('employees.no_ktv_found') }}
      </template>
    </CoreTable>
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';

export default {
  name: 'WorkingCommissionList',
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
      tableRf: 'workingCommissionList',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST,
      headers: [
        {
          text: 'ID',
          value: 'id',
        },
        {
          text: 'Giá',
          value: 'price',
        },
        {
          text: 'Phần trăm (%)',
          value: 'commission_rate',
        },
        {
          text: 'Thời gian',
          value: 'time',
        },
        {
          text: 'Tăng ca',
          value: 'is_overtime',
        },
        {
          text: 'Điểm đánh giá',
          value: 'point',
        },
        {
          text: 'Hoa Hồng',
          value: 'working_commission',
        },
        // {
        //   text: 'Tính lại',
        //   value: 'reCalculate',
        // },
      ],
    };
  },
  computed: {
    computedQueryParams() {
      return {
        is_valid: 1,
        ...this.queryParams,
      };
    },
  },
  methods: {
    pointRate(att, skill) {
      const x = att + skill;
      switch (x) {
        case 10:
          return 1 * 100;
        case 9:
          return 0.9 * 100;
        case 8:
          return 0.8 * 100;
        case 7:
          return 0.7 * 100;
        default:
          return 0.5 * 100;
      }
    },
    reCalculate(item) {
      const price = item.combo_id ? item.variant.sale_price : item.price;
      const rate = item.variant.commission_rate / 100;
      const overtime = item.is_overtime ? 1.5 : 1;
      const pointRate =
        this.pointRate(item.review.attitude, item.review.skill) / 100;
      return price * rate * overtime * pointRate;
    },
  },
};
</script>
<style></style>
