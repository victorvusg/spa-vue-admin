<template>
  
</template>
<script>
import UpdatePaymentMethod from '@/components/Shared/UpdatePaymentMethod';

export default {
  name: 'PackageDetail',
  components: {
    UpdatePaymentMethod,
  },
  props: {
    pack: {
      type: Object,
      required: true,
    },
  },
  computed: {
    paymentMethod:{
      get(){
        return this.pack.payment_method_id;
      },
      set(val) {
        this.$emit('change_payment_method', val);
      }
    },
    promotionCombos() {
      return this.pack.combos.filter((combo) => combo.is_promotion_combo);
    },
    paidCombos() {
      return this.pack.combos.filter((combo) => !combo.is_promotion_combo);
    },
  },
};
</script>
