<template>
  <div>
    <v-row class="mx-0 subtitle-2 mb-2">
      <v-col cols="6" style="border-right: 1px solid black">
        <div
          class="subtitle-2 primary--text mb-2 d-flex align-center justify-end"
        >
          <div class="pr-1">Tổng thu đơn:</div>
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
      <v-col cols="6">
        <div
          class="subtitle-2 primary--text mb-2 d-flex align-center justify-end"
        >
          <div class="pr-1">Tổng tips:</div>
          <div>{{ totalTips | currency }}</div>
        </div>
        <div
          class="d-flex align-center justify-space-between"
          v-for="paymentType in Object.keys(tipsMethods)"
          :key="`tips_${paymentType}`"
          :class="{
            'black--text': paymentType === 'cash',
            'blue--text': paymentType === 'bank_transfer',
            'pink--text': paymentType === 'momo',
            'warning--text': paymentType === 'credit',
            'primary--text': paymentType === 'card',
          }"
        >
          <div class="pr-1">{{ $t(paymentType) }}</div>
          <div class=" font-weight-bold">
            {{ tipsMethods[paymentType] | currency }}
          </div>
        </div>
      </v-col>
    </v-row>
    <v-divider />
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
        <div class="primary--text font-weight-bold">#{{ item.id }}</div>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ item.created_at | formatDate(true) }}
      </template>
      <template v-slot:item.final_price="{ item }">
        <span class="font-weight-bold warning--text">
          <span v-if="item.payment_method_id === 'credit'">{{
            item.final_price | coin
          }}</span>
          <span v-else class="success--text ">{{
            item.final_price | currency
          }}</span>
        </span>
      </template>
      <template v-slot:item.payment_received_amount="{ item }">
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
          <div>{{ item.payment_received_amount | currency }}</div>
          <div v-if="item.payment_method_id">
            {{ $t(item.payment_method_id) }}
          </div>
        </div>
        <span class="warning--text" v-else> -</span>
      </template>
      <template v-slot:item.tips="{ item }">
        <div class="error--text">
          <div>{{ item.tips | currency }}</div>
          <div v-if="item.tips_method">{{ $t(item.tips_method) }}</div>
        </div>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn
          color="success"
          class="font-weight-bold"
          depressed
          small
          text
          @click="openDetail(item.id)"
        >
          XEM
        </v-btn>
      </template>
    </v-data-table>
    <IntakeDetailDialog
      :id="intakeId"
      ref="intakeDialog"
      @intake-updated="$emit('update-record')"
    />
  </div>
</template>
<script>
/* eslint-disable camelcase */

import moment from 'moment';
import IntakeDetailDialog from '@/components/Intake/IntakeDetailDialog';

export default {
  name: 'IntakeSummary',
  components: { IntakeDetailDialog },
  props: {
    dataSet: {
      default: () => [],
      required: true,
    },
  },
  data() {
    return {
      tab: 'intakes',
      intakeId: null,
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
          text: 'Tổng đơn',
          value: 'final_price',
        },
        // {
        //   text: 'Khác trả',
        //   value: 'payment_received_amount',
        // },
        {
          text: 'Tips',
          value: 'tips',
        },
        { text: 'Actions', value: 'action' },
      ],
    };
  },
  computed: {
    paymentMethods() {
      return this.dataSet.reduce((acc, current) => {
        const { payment_method_id, final_price } = current;
        if (payment_method_id && payment_method_id !== 'credit') {
          if (acc[payment_method_id] === undefined) acc[payment_method_id] = 0;
          acc[payment_method_id] += final_price;
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
    tipsMethods() {
      return this.dataSet.reduce((acc, current) => {
        const { tips_method, tips } = current;
        if (tips_method && tips_method !== 'credit') {
          if (acc[tips_method] === undefined) acc[tips_method] = 0;
          acc[tips_method] += tips;
        }
        return acc;
      }, {});
    },
    totalTips() {
      return Object.values(this.tipsMethods).reduce((acc, cr) => acc + cr, 0);
    },
  },
  methods: {
    openDetail(id) {
      this.intakeId = id;
      this.$nextTick(() => {
        this.$refs.intakeDialog.openDialog();
      });
    },
  },
};
</script>
