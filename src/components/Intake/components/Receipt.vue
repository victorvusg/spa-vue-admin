<template>
  <ReceiptLayout>
    <v-row style="margin: 8px 0px" v-if="specialNote">
      <v-col style="text-align: center" cols="12">
        Xin chúc mừng!<br />Bạn đã đạt hạn mức thành viên
        <strong>{{ $t(specialNote.to) }}</strong> <br />với tổng chi tiêu
        <strong>{{ specialNote.total_spending | currency }} VND</strong>
      </v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Khách</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        customer.name
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Tích lũy:</v-col
      >
      <v-col
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          font-weight: bold;
        "
        >{{ customer.cash_point | currency }}</v-col
      >
    </v-row>
    <v-row style="margin: 8px 0px" v-if="customer.rank">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Thành viên:</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        $t(customer.rank)
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Ngày giờ</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        createdDate
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Mã Đơn</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        intake.id
      }}</v-col>
    </v-row>
    <v-row style="margin: 8px 0px">
      <v-col style="padding: 0px; display: flex; align-item: center" cols="3"
        >Trả bằng</v-col
      >
      <v-col style="padding: 0px; display: flex; align-item: center">{{
        $t(intake.payment_method_id)
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
      <v-col cols="1" style="padding: 0px; font-weight: bold"> SL </v-col>
      <v-col cols="7" style="padding: 0px; font-weight: bold">
        Tên dịch vụ
      </v-col>
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
        Thành tiền
      </v-col>
    </v-row>
    <v-row
      v-for="item in items"
      :key="item.id"
      style="margin: auto 0px; padding-bottom: 8px"
    >
      <v-col cols="1" style="padding: 0px">{{ item.amount }}</v-col>
      <v-col cols="7" style="padding: 0px">{{ item.name }}</v-col>
      <v-col
        cols="4"
        style="
          padding: 0px;
          display: flex;
          align-item: center;
          justify-content: flex-end;
        "
      >
        <template v-if="item.isCombo"> Gói </template>
        <template v-else>
          <span>
            {{ item.price | currency }}
          </span>
        </template>
      </v-col>
      <template v-if="item.discountDescription">
        <v-col cols="1" style="padding: 0px" />
        <v-col cols="11" style="padding: 0px">
          <div style="font-size: 10px; font-style: italic">
            ( <strong>Giá gốc: {{ item.stockPrice | currency }}</strong
            >, {{ item.discountDescription }} )
          </div>
        </v-col>
      </template>
    </v-row>
    <div
      style="
        border-top: solid 1px;
        display: block;
        padding: 4px;
        margin-top: 4px;
      "
    >
      <!-- TÍCH LUỸ ĐƠN  -->
      <div
        v-if="intake.customer_earned_points"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          margin-bottom: 8px;
        "
      >
        <i style="font-weight: bold">Tích luỹ đơn này được</i>
        <i>{{ intake.customer_earned_points | currency }}</i>
      </div>
      <template v-if="additionalDiscountPrice">
        <!-- TẠM TÍNH  -->
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: space-between;
          "
        >
          <span style="font-weight: bold">Tạm tính</span>
          <span>{{ preTotal | currency }}</span>
        </div>
        <!-- GIẢM GIÁ  -->
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: space-between;
          "
        >
          <span style="font-weight: bold">Khấu trừ</span>
          <span>- {{ additionalDiscountPrice | currency }}</span>
        </div>
        <!-- GHI CHÚ GIẢM GIÁ  -->
        <div
          style="
            display: flex;
            align-item: center;
            justify-content: flex-end;
            font-size: 10px;
            font-style: italic;
          "
        >
          <strong>( Ghi chú: {{ additionalDiscountNote }} )</strong>
        </div>
      </template>
      <!-- TỔNG CỘNG  -->
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
        "
      >
        <span style="font-weight: bold">Tổng cộng</span>
        <span style="font-weight: bold">
          {{ finalPrice | currency }}
        </span>
      </div>
      <!-- TODO: Làm trả xu bù tiền mặt -->
      <!-- <div
            style="
              display: flex;
              align-item: center;
              justify-content: space-between;
            "
            v-if="receipt.final_price && isCash"
          >
            <span style="font-weight: bold">Tiền mặt</span>
            <span>{{ (receipt.final_price * 1000).toLocaleString() }}</span>
          </div> -->
    </div>
    <template v-if="intake.payment_method_id === 'credit'">
      <InvoiceCard :invoice="intake.invoice" v-if="intake && intake.invoice" />
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>SỐ DƯ VÍ HIỆN TẠI</span>
        <span
          v-if="intake.is_valid"
          style="font-weight: 700; text-transform: capitalize"
        >
          {{ intake.customer.balance | coin }}
        </span>
      </div>
    </template>
  </ReceiptLayout>
</template>
<script>
/* eslint-disable camelcase */

import moment from 'moment';
import InvoiceCard from '@/layout/InvoiceCard';
import ReceiptLayout from '@/layout/ReceiptLayout';

export default {
  name: 'Receipt',
  props: {
    autoPrint: false,
    intake: {
      required: true,
    },
  },
  components: {
    InvoiceCard,
    ReceiptLayout,
  },
  computed: {
    customer() {
      if (this.intake && this.intake.customer) {
        return this.intake.customer;
      }
      return {
        name: 'Khách vãng lai',
        rank: null,
        balance: 0,
        cash_point: 0,
      };
    },
    specialNote() {
      const note = this.intake.special_note || false;
      try {
        return JSON.parse(note);
      } catch (er) {
        return false;
      }
    },
    isCash() {
      return this.intake.payment_method_id === 'cash';
    },
    createdDate() {
      return moment
        .utc(this.intake.created_at)
        .local()
        .format('HH:mm - DD/MM/YYYY ');
    },
    items() {
      // return [];
      return this.intake.orders.reduce((acc, order) => {
        let mappedItem;
        if (order.promotionHash) {
          const { subOrders } = order;
          mappedItem = {
            id: subOrders[0].variant.service.id,
            name: subOrders[0].variant.service.name,
            amount: 1,
            isCombo: false,
            stockPrice: 0,
            price: subOrders.reduce((sum, item) => {
              // eslint-disable-next-line no-param-reassign
              sum += item.price;
              return sum;
            }, 0),
            discountDescription: '',
          };
        } else {
          mappedItem = {
            id: order.variant.id,
            name: order.variant.name,
            amount: 1,
            stockPrice: order.unit_price,
            price: order.price,
            isCombo: !!order.combo_id,
            discountDescription: order.discount_description,
          };
        }
        const foundIndex = acc.findIndex((item) => item.id === mappedItem.id);
        if (foundIndex === -1) acc.push(mappedItem);
        else {
          acc[foundIndex].amount += 1;
          acc[foundIndex].price += mappedItem.price;
        }
        return acc;
      }, []);
    },
    preTotal() {
      return this.items.reduce((acc, item) => {
        // eslint-disable-next-line no-param-reassign
        acc += item.price;
        return acc;
      }, 0);
    },
    additionalDiscountPrice() {
      return this.intake.additional_discount_price || 0;
    },
    additionalDiscountNote() {
      return this.intake.discount_note || '';
    },
    finalPrice() {
      return this.preTotal - this.additionalDiscountPrice;
    },
    receipt() {
      const receiptContent = {
        final_price: 0,
        additional_discount_price: 0,
        discount_note: this.intake.additional_discount_price,
      };
      return receiptContent;
    },
  },
};
</script>
