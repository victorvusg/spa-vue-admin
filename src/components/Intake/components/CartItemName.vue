<template>
  <div class=" my-2">
    <div class="subtitle-1 font-weight-bold mb-2">
      {{ variantName(order.variant) }}
    </div>
    <div class="caption mb-2">
      <span class="grey--text">
        {{
          order.variant.service.service_category.name === 'goods'
            ? 'Người bán'
            : 'Phụ Trách bởi'
        }} </span
      >:
      <span class="font-weight-bold grey--text text--light-1">
        {{ order.employee.name }}
      </span>
    </div>
    <div
      v-if="order.discount_description"
      class="caption font-weight-bold red--text"
    >
      ({{ order.discount_description }})
    </div>
    <div class="lighten-4 px-4 pt-2 pb-2 extra-content grey rounded-lg">
      <div class="font-weight-bold caption grey--text">Ghi chú</div>
      <component
        :is="`${order.note.type}-note`"
        v-if="order.note.type !== 'other'"
        :note="order.note"
      />
      <template v-if="order.review">
        <div class="font-weight-bold caption grey--text mt-2">Đánh giá</div>
        <OrderReview :review="order.review" />
      </template>
    </div>
  </div>
</template>
<script>
import BodyNote from './BodyNote';
import FacialNote from './FacialNote';
import OrderReview from './OrderReview';

export default {
  name: 'CartItemName',
  props: ['order'],
  components: {
    FacialNote,
    BodyNote,
    OrderReview,
  },
};
</script>
