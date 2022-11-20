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
    <v-data-iterator :items="dataSet" :items-per-page="15">
      <template v-slot:default="{ items }">
        <v-row class="mx-0">
          <v-col cols="8" md="10">
            <span class="font-weight-bold title">Thông tin</span>
          </v-col>
          <v-col cols="4" md="2"
            ><span class="font-weight-bold title">Số tiền</span>
          </v-col>
        </v-row>
        <v-divider />
        <v-row v-for="item in items" :key="item.id"  class="mx-0">
          <v-col cols="8" md="10">
            <div class="mb-2">
              <span class="primary--text font-weight-bold">{{ item.id }}</span>
              -
              <span class="font-italic"
                >Ngày tạo {{ item.created_at | formatDate }}</span
              >
            </div>
            <div class="mb-2">
              <strong>Nội dung</strong>
              <div style="white-space: break-spaces">{{ item.note }}</div>
            </div>
            <div>
              <strong>Tạo bởi: </strong><span>{{ item.employee.name }}</span>
            </div>
          </v-col>
          <v-col
            cols="4"
            md="2"
            class="font-weight-bold"
            :class="{
              'black--text': item.payment_method_id === 'cash',
              'blue--text': item.payment_method_id === 'bank_transfer',
              'pink--text': item.payment_method_id === 'momo',
              'primary--text': item.payment_method_id === 'card',
            }"
          >
            <div>
              {{ item.amount | currency }}
            </div>
            <div>
              {{ $t(item.payment_method_id) }}
            </div>
          </v-col>
          <v-col cols="12" class="pa-0">
            <v-divider />
          </v-col>
        </v-row>
      </template>
      <template v-slot:no-data>
        {{ $t('combos.no_combo_found') }}
      </template>
    </v-data-iterator>
  </div>
  <!-- <v-data-table
    :headers="headers"
    :items="dataSet"
    :items-per-page="15"
    item-key="id"
    class="invoices-summary-table"
  >
    <template v-slot:item.note="{ item }">
      <span style="white-space: break-spaces">{{ item.note }}</span>
    </template>
    <template v-slot:item.phone="{ item }">
      <span>{{ item.customer.phone | formatPhone }}</span>
    </template>
    <template v-slot:item.created_at="{ item }">
      <span>{{ item.created_at | formatDate }}</span>
    </template>
    <template v-slot:item.created_at="{ item }">
      <span>{{ item.created_at | formatDate }}</span>
    </template>
    <template v-slot:item.type="{ item }">
      <span class="error--text">{{ $t(item.type) }}</span>
    </template>
    <template v-slot:item.amount="{ item }">
      <template v-if="item.type === 'withdraw'">
        <span v-if="item.status === 'pending'"> - </span>
        <span v-else class="warning--text font-weight-bold">
          {{ item.amount | coin }}
        </span>
      </template>
      <template v-else>
        <span class="success--text font-weight-bold">
          {{ item.amount | currency }}
        </span>
      </template>
    </template>
    <template v-slot:item.status="{ item }">
      <i class="error--text" v-if="item.status === 'pending'">
        {{ $t(`${item.type}_status.${item.status}`) }}
      </i>
      <span class="primary--text" v-else>
        {{ $t(`${item.type}_status.${item.status}`) }}
        <strong v-if="item.type === 'withdraw'">#{{ item.intake_id }}</strong>
      </span>
    </template>
    <template v-slot:no-data>
      {{ $t('combos.no_combo_found') }}
    </template>
  </v-data-table> -->
</template>
<script>
/* eslint-disable camelcase */

export default {
  name: 'InvoiceSummary',
  props: {
    dataSet: {
      required: true,
    },
  },
  data() {
    return {
      tab: 'invoices',
      headers: [
        { text: this.$t('intake.id'), value: 'id' },
        { text: 'Thông tin', value: 'note' },
        {
          text: 'Tạo lúc',
          value: 'created_at',
        },
        {
          text: 'Số tiền',
          value: 'amount',
        },
      ],
    };
  },
  computed: {
    paymentMethods() {
      return this.dataSet.reduce((acc, current) => {
        const { payment_method_id, amount } = current;
        if (payment_method_id && payment_method_id !== 'credit') {
          if (acc[payment_method_id] === undefined) acc[payment_method_id] = 0;
          acc[payment_method_id] += amount;
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
<style lang="scss">
.invoices-summary-table {
  tr {
    .text-start {
      &:nth-child(2) {
        padding: 10px 16px;
      }
    }
  }
}
</style>
