<template>
  <v-row style="position: relative" class="mx-n3">
    <v-col cols="6">
      <div class="field-name grey--text">Tạm tính</div>
      <div class="field-value">{{ preTotal | currency }}</div>
    </v-col>
    <v-col cols="6">
      <div class="field-name grey--text">Thánh Toán</div>
      <div class="field-value">
        {{ $t(intake.payment_method_id) }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="field-name grey--text">Giảm giá thêm</div>
      <div class="field-value">
        - {{ intake.additional_discount_price | currency }}
      </div>
    </v-col>
    <v-col cols="6">
      <div class="field-name grey--text">Giảm theo CTKM</div>
      <div class="field-value">- {{ discountByEvent | currency }}</div>
    </v-col>
    <v-col cols="12">
      <div class="field-name grey--text">Nội dụng giảm thêm</div>
      <div class="field-value">
        {{ intake.discount_note || '-' }}
      </div>
    </v-col>
    <!-- <v-col cols="6">
      <div class="field-name grey--text">Khách thanh toán</div>
      <div class="field-value">
        <template v-if="intake.payment_method_id === 'credit'">
           {{ intake.final_price }} Xu
        </template>
        <template v-else>
           {{ intake.payment_received_amount | currency }}
        </template>
      </div>
    </v-col> -->
    <v-col cols="6">
      <div class="field-name grey--text">Tích luỹ</div>
      <div class="field-value">
        {{ intake.customer_earned_points | currency }}
      </div>
    </v-col>
    <v-col cols="12" class="primary--text d-flex align-center justify-center">
      <div class="field-value" style="letter-spacing: 1px">
        Tổng Cộng: {{ intake.final_price | currency }}
      </div>
    </v-col>
  </v-row>
</template>
<script>
import pricingMixins from '@/mixins/pricing.mixins';

export default {
  name: 'InvoiceCard',
  mixins: [pricingMixins],
  props: {
    intake: {
      required: true,
    },
  },
  data() {
    return {};
  },
  computed: {
    preTotal() {
      return this.calculateTotalPrice(this.intake.orders, 'unit_price');
    },
    discountByEvent() {
      return this.intake.orders.reduce((acc, current) => {
        // eslint-disable-next-line no-param-reassign
        acc += current.discount_amount || 0;
        return acc;
      }, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.field-name {
  letter-spacing: 1px;
  font-size: 14px;
  font-weight: 600;
}
.field-value {
  font-weight: 700;
  font-size: 20px;
}
</style>
