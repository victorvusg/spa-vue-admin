<template>
  <div>
    <div>Phiếu thanh toán</div>
    <div
      style="
        width: 100%;
        display: flex;
        align-item: center;
        justify-content: center;
      "
    >
      <img :src="require('@/assets/spa-logo.png')" width="100%" height="auto" />
    </div>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Ngày giờ</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        currentDate
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Mã Gói</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        pack.id
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Thu Ngân</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        cashierName
      }}</v-col>
    </v-row>
    <v-row
      style="
        border-top: solid 0.2px #bdbdbd;
        border-bottom: solid 0.2px #bdbdbd;
        padding-top: 4px;
        margin: 8px 0px;
      "
    >
      <v-col cols="7" style="padding: 0px; font-weight: bold">
        Tên dịch vụ
      </v-col>
      <v-col cols="1" style="padding: 0px; font-weight: bold"> SL </v-col>
      <v-col
        cols="4"
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          justify-content: flex-end;
          font-weight: bold;
        "
      >
        Thành tiền
      </v-col>
    </v-row>
    <v-row
      v-for="combo in receipt.combos"
      :key="combo.id"
      style="margin: auto 0px; padding-bottom: 4px"
    >
      <v-col cols="7" style="padding: 0px">
        <p style="margin-bottom: 0px">
          {{ combo.name }}
        </p>
        <p
          v-if="combo.gender"
          style="
            font-size: 0.75rem !important;
            letter-spacing: 0.0333333333em !important;
            line-height: 1.25rem;
          "
        >
          Dành cho {{ $t(combo.gender) }}
        </p>
      </v-col>
      <v-col cols="1" style="padding: 0px">{{ combo.amount }}</v-col>
      <v-col
        cols="4"
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          justify-content: flex-end;
        "
      >
        {{ combo.price }}
      </v-col>
    </v-row>
    <div
      style="
        border-top: solid 1px;
        display: block;
        padding: 4px;
        margin-top: 4px;
      "
    >
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
        "
      >
        <span style="font-weight: bold">Tổng cộng</span>
        <span style="font-weight: bold">
          {{ receipt.total | currency }}
        </span>
      </div>
      <div
        style="
          width: 100%;
          display: flex;
          align-item: center;
          justify-content: center;
          flex-wrap: wrap;
        "
      >
        <div style="padding-top: 8px; width: 100%; text-align: center">
          Xin cám ơn quý khách
        </div>
        <div style="width: 100%; text-align: center">
          Hẹn gặp lại quý khách lần sau !
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment';
import { isEmpty } from 'lodash';

export default {
  name: 'PackageReceipt',
  props: {
    pack: {
      type: Object,
      required: true,
    },
  },
  computed: {
    currentDate() {
      return moment().format('DD/MM/YYYY HH:mm');
    },
    receipt() {
      const receiptContent = {
        combos: [],
        total: 0,
      };
      if (!isEmpty(this.pack)) {
        receiptContent.total = this.pack.total_price;
        receiptContent.combos = this.pack.combos.map((combo) => ({
          name: this.variantName(combo.variant),
          gender: combo.variant.gender === 'both' ? '' : combo.variant.gender,
          amount: combo.amount,
          price: !combo.is_promotion_combo
            ? this.$options.filters.currency(
                combo.total_price * 1000,
                false,
                '',
              )
            : 'Gói Tặng',
          variant: combo.variant,
        }));
      }
      return receiptContent;
    },
  },
};
</script>
