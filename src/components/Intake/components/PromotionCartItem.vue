<template>
  <tr class="py-4">
    <td class="text-left">
      <div class="d-flex align-center  my-2">
        <v-btn
          class="d-flex align-center red--text mr-2"
          icon
          @click="$emit('onDelete', order.id)"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <div>
          <div class="subtitle-1 font-weight-bold mb-2">
            {{ name }}
          </div>
          <div class="pl-4">
            <cart-item-name
              v-for="subOrder in order.subOrders"
              :key="subOrder.id"
              :order="subOrder"
            />
          </div>
        </div>
      </div>
    </td>
    <td class="text-right subtitle-2 font-weight-bold">1</td>
    <td class="text-right subtitle-2 font-weight-bold">
      {{ dealPrice | currency }}
    </td>
    <td class="text-right subtitle-2  font-weight-bold">
      {{ dealPrice | currency }}
    </td>
  </tr>
</template>
<script>
import OrderDetail from '@/components/Intake/components/OrderDetail';
import CartItemName from './CartItemName';

export default {
  name: 'PromotionDeal',
  components: { OrderDetail, CartItemName },
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
