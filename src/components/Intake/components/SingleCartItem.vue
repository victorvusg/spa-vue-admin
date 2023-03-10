<template>
  <tr class="py-4">
    <td class="text-left">
      <div class="d-flex align-center">
        <v-btn
          class="d-flex align-center red--text mr-2"
          icon
          @click="$emit('onDelete', order.id)"
          v-if="!disabled"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <cart-item-name :order="orderForm" />
      </div>
    </td>
    <td class="text-right subtitle-2 font-weight-bold">
      <v-edit-dialog
        v-if="!disabled"
        large
        persistent
        :return-value.sync="orderForm.amount"
        @save="save"
        @cancel="cancel"
        @open="open"
        @close="close"
        save-text="Lưu"
        cancel-text="Hủy"
      >
        {{ order.amount }}
        <template v-slot:input>
          <v-text-field
            v-model="orderForm.amount"
            label="Edit"
            single-line
            type="number"
            :rules="[greaterThanZero]"
          ></v-text-field>
        </template>
      </v-edit-dialog>
      <span v-else>
        {{ order.amount }}
      </span>
    </td>
    <td class="text-right subtitle-2 font-weight-bold">
      {{ orderForm.unit_price | currency }}
    </td>
    <td class="text-right subtitle-2  font-weight-bold">
      <template v-if="orderForm.combo_id === null">
        {{ orderPrice | currency }}
      </template>
      <template v-else>Gói</template>
    </td>
  </tr>
</template>
<script>
import moment from 'moment';
import { privateAxios } from '@/api/api';
import BodyNote from './BodyNote';
import FacialNote from './FacialNote';
import OrderReview from './OrderReview';
import CartItemName from './CartItemName';

export default {
  name: 'OrderDetail',
  components: {
    FacialNote,
    BodyNote,
    OrderReview,
    CartItemName,
  },
  props: {
    order: {
      required: true,
    },
    showPrice: {
      default: true,
    },
    disabled: {
      default: false,
    },
  },
  data() {
    return {
      panel: null,
      orderForm: {},
      greaterThanZero: (v) => v > 0 || 'Số lượng không hợp lệ',
    };
  },
  created() {
    this.orderForm = JSON.parse(JSON.stringify(this.order));
  },
  computed: {
    checkinTime() {
      const date = moment.utc(this.order.created_at).local();
      return date.format('HH:mm');
    },
    orderPrice() {
      if (this.order.price && this.order.price < this.order.unit_price) {
        return this.order.price * this.order.amount;
      }
      return this.order.unit_price * this.order.amount;
    },
  },
  methods: {
    async save() {
      try {
        await privateAxios.put(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST}/${this.order.id}`,
          { amount: this.orderForm.amount },
        );
        this.$emit('update', true);
      } catch (err) {
        console.log(err);
      }
    },
    cancel() {
      this.orderForm.amount = this.order.amount;
    },
    open() {
      this.orderForm.amount = this.order.amount;
    },
    close() {},
  },
};
</script>
<style lang="scss">
.order-detail-panel.v-expansion-panels {
  .v-expansion-panel {
    &:before {
      box-shadow: none;
    }
    background: transparent;
    .v-expansion-panel-header {
      box-shadow: none;
      border-radius: 8px;

      .v-expansion-panel-header__icon {
        position: absolute;
        bottom: 8px;
        right: 4px;
      }
    }
    .v-expansion-panel-content__wrap {
      padding: 0px 12px 12px 12px;
      .extra-content {
        box-shadow: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
}
</style>
