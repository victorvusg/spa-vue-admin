<template>
  <v-dialog v-model="dialog" persistent max-width="400px" scrollable>
    <template v-slot:activator="{ on, attrs }">
      <v-btn v-bind="attrs" block v-on="on" elevation="0" color="primary">
        Chốt đơn
      </v-btn>
    </template>
    <v-card v-if="dialog">
      <v-card-title class="headline d-flex align-center justify-center">
        Chốt đơn
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="pt-2 px-4">
        <div class="subtitle-1  font-weight-bold">Giảm thêm</div>
        <div>
          <v-checkbox
            class="mt-n1"
            v-model="isDiscount"
            hide-details
            @change="
              discount = 0;
              discountNote = '';
            "
          >
            <template v-slot:label>
              <div>Áp dụng</div>
            </template>
          </v-checkbox>
          <template v-if="isDiscount">
            <p class="mt-4 mb-n2 body-1 font-weight-bold">
              Số tiền giảm:
              <span class="green--text">{{
                additionalDiscountPrice | currency
              }}</span>
            </p>
            <v-form v-model="formValid">
              <v-radio-group
                v-model="type"
                mandatory
                @change="discount = 0"
                hide-details
                class="mb-2"
              >
                <v-radio value="amount">
                  <template v-slot:label>
                    <div class="d-flex flex-column">
                      <label>Theo số tiền</label>
                      <v-text-field
                        v-if="type === 'amount'"
                        type="number"
                        v-model="discount"
                        outlined
                        dense
                        :rules="discountAmountRules"
                      ></v-text-field>
                    </div>
                  </template>
                </v-radio>
                <v-radio value="percent">
                  <template v-slot:label>
                    <div>
                      <label> Theo phần trăm (%) </label>
                      <v-text-field
                        type="number"
                        v-if="type === 'percent'"
                        v-model="discount"
                        outlined
                        dense
                        :rules="discountPercentRules"
                      ></v-text-field>
                    </div>
                  </template>
                </v-radio>
              </v-radio-group>
              <p class="mt-4 mb-n2 body-1 font-weight-bold">
                Lý do giảm
              </p>
              <v-textarea
                name="input-7-1"
                hide-details
                class="pt-2"
                :placeholder="
                  discountNote ? null : 'Vui lòng nhập lý do giảm giá...'
                "
                v-model="discountNote"
                :rules="discountReasonRules"
              ></v-textarea>
            </v-form>
          </template>
        </div>

        <div class="caption mt-2">
          <i>
            <strong>Lưu ý: </strong>Vui lòng kiểm tra kỹ các thông tin.
            <span class="error--text">Không thể hoàn tác</span> sau khi đóng
            đơn.</i
          >
        </div>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error darken-1" text @click="close">
          Thoát
        </v-btn>
        <v-btn
          color="green darken-1"
          text
          :disabled="!formValid"
          @click="approve"
        >
          Chốt
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
// import { privateAxios } from '@/api/api';
import pricingMixins from '@/mixins/pricing.mixins';
import { approveIntake } from '@/api/intake';

export default {
  name: 'ApprovalDialog',
  mixins: [pricingMixins],
  props: {
    intake: {
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      isDiscount: false,
      type: 'amount',
      discount: 0,
      discountNote: '',
      formValid: true,
    };
  },
  computed: {
    discountAmountRules() {
      return [
        (v) =>
          (parseInt(v, 10) >= 0 && parseInt(v, 10) <= this.preTotal) ||
          'Số tiền không hợp lệ',
      ];
    },
    discountPercentRules() {
      return [
        (v) =>
          !v ||
          (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 100) ||
          'Số % không hợp lệ',
      ];
    },
    discountReasonRules() {
      if (parseInt(this.discount, 10)) {
        return [(v) => !!v || 'Lý do giảm giá không được bỏ trống'];
      }
      return [];
    },
    preTotal() {
      return this.calculateTotalPrice(this.intake.orders, 'unit_price');
    },
    additionalDiscountPrice() {
      if (this.type === 'amount') {
        return this.discount;
      }
      if (this.type === 'percent') {
        return (this.discount * this.preTotal) / 100;
      }
      return 0;
    },
  },
  methods: {
    close() {
      this.dialog = false;
      this.isDiscount = false;
      this.type = 'amount';
      this.discount = 0;
      this.discountNote = '';
      this.formValid = true;
    },
    async approve() {
      this.setLoading(true);
      const payload = {
        discount_point: 0,
        additional_discount_price: this.additionalDiscountPrice,
        discount_note: this.discountNote,
      };
      try {
        const response = await approveIntake(this.intake.id, payload);
        if (response.status === 200) {
          this.setLoading(false);
          this.$emit('approved');
          this.close();
        }
      } catch (error) {
        this.setLoading(false);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: this.$t(error.response.data.Message),
        });
      }
    },
  },
};
</script>
