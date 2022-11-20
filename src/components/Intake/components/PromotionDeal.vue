<template>
  <div class="promotion-deal-wrapper pa-2 primary">
    <div class="d-flex align-center justify-center">
      <div class="font-weight-bold subtitle-1 text-uppercase white--text">
        {{ name }}
      </div>
    </div>
    <v-row class="mx-0">
      <v-col
        :key="order.id"
        :cols="isMobile ? 12 : 6"
        v-for="order in order.subOrders"
        class="pa-2"
      >
        <order-detail :order="order" :showPrice="false" class="white" />
      </v-col>
    </v-row>
    <div class="title px-2 white--text font-weight-bold text-right">
      {{ dealPrice | currency }}
    </div>
  </div>
</template>
<script>
import OrderDetail from '@/components/Intake/components/OrderDetail';

export default {
  name: 'PromotionDeal',
  components: { OrderDetail },
  props: {
    order: {
      required: true,
    },
  },
  computed: {
    name() {
      return this.order.subOrders[0].variant.service.name;
    },
    dealPrice() {
      return this.order.subOrders.reduce((acc, current) => {
        if (current.price && current.price < current.unit_price) {
          return acc + current.price;
        }
        return acc + current.unit_price;
      }, 0);
    },
  },
};
</script>
<style lang="scss" scoped>
.promotion-deal-wrapper {
  border-radius: 8px;
}
</style>
