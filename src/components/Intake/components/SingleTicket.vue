<template>
  <div class="white" style="border-radius: 8px">
    <order-detail
      class="my-2"
      :order="order"
      style="border: thin dashed rgb(105, 158, 60)"
    />
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
};
</script>
<style lang="scss" scoped>
.promotion-deal-wrapper {
  border: thin dashed rgb(105, 158, 60);
}
</style>
