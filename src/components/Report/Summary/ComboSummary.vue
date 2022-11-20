<template>
  <div>
    <v-row class="mx-0 subtitle-2 mb-2">
      <v-col cols="6">
        <div
          class="subtitle-2 primary--text mb-2 d-flex align-center justify-end"
        >
          <div class="pr-1">Tổng thu:</div>
          <div>{{ totalIncome | currency }}</div>
        </div>
        <div
          class="d-flex align-center justify-space-between"
          v-for="paymentType in Object.keys(paymentMethods)"
          :key="paymentType"
          :class="{
            'black--text': paymentType === 'cash',
            'blue--text': paymentType === 'bank_transfer',
            'pink--text': paymentType === 'momo',
            'warning--text': paymentType === 'credit',
            'primary--text': paymentType === 'card',
          }"
        >
          <div class="pr-1">{{ $t(paymentType) }}</div>
          <div class="font-weight-bold">
            {{ paymentMethods[paymentType] | currency }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="dataSet"
      :items-per-page="15"
      item-key="id"
    >
      <template v-slot:no-data>
        {{ $t('Không có dữ liệu') }}
      </template>
      <template v-slot:item.id="{ item }">
        {{ item.id }}
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at | formatDate(true) }}
      </template>
      <template v-slot:item.employee="{ item }">
        {{ item.employee.name }}
      </template>
      <template v-slot:item.total_price="{ item }">
        <span class="success--text font-weight-bold">
          {{ item.total_price | currency }}
        </span>
      </template>
      <template v-slot:item.sale_commission="{ item }">
        {{ item.sale_commission | currency }}
      </template>
      <template v-slot:item.payment_method_id="{ item }">
        <div
          v-if="item.payment_method_id !== 'credit'"
          class="font-weight-bold"
          :class="{
            'black--text': item.payment_method_id === 'cash',
            'blue--text': item.payment_method_id === 'bank_transfer',
            'pink--text': item.payment_method_id === 'momo',
            'primary--text': item.payment_method_id === 'card',
          }"
        >
          {{ $t(item.payment_method_id) }}
        </div>
        <span class="warning--text" v-else> -</span>
      </template>
    </v-data-table>
  </div>
</template>
<script>
/* eslint-disable camelcase */

import moment from 'moment';

export default {
  name: 'ComboSummary',
  props: {
    dataSet: {
      required: true,
    },
  },
  data() {
    return {
      tab: 'intakes',
      headers: [
        { text: this.$t('intake.id'), value: 'id' },
        {
          text: this.$t('intake.created'),
          value: 'created_at',
          sort: (a, b) => {
            const timeA = moment(a);
            const timeB = moment(b);
            return timeB - timeA;
          },
        },
        {
          text: 'KTV bán',
          value: 'employee',
        },
        {
          text: 'Sale Commission',
          value: 'sale_commission',
        },

        {
          text: 'Trị Giá',
          value: 'total_price',
        },
        {
          text: 'Hình thức thanh toán',
          value: 'payment_method_id',
        },
      ],
    };
  },
  computed: {
    paymentMethods() {
      return this.dataSet.reduce((acc, current) => {
        const { payment_method_id, total_price } = current;
        if (payment_method_id && payment_method_id !== 'credit') {
          if (acc[payment_method_id] === undefined) acc[payment_method_id] = 0;
          acc[payment_method_id] += total_price;
        }
        return acc;
      }, {});
    },
    totalIncome() {
      return Object.values(this.paymentMethods).reduce(
        (acc, cr) => acc + cr,
        0,
      );
    },
  },
};
</script>
