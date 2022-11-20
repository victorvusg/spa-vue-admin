<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="350"
    content-class="admin-dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="info" depressed text small v-bind="attrs" @click="open">
        Xem
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex align-center justify-center">
        <span class="headline font-weight-bold"> Thông tin gói</span>
      </v-card-title>
      <v-divider />
      <v-card-text class="pa-4" v-if="item">
        <div class="combo-history">
          <h3>Gói khách mua:</h3>
          <div
            class="combo-history-items"
            v-for="(combo, index) in paidCombos"
            :key="index"
          >
            <p class="mb-0 font-weight-bold primary--text">
              {{ combo.variant.service.name }}
            </p>
            <p class="mb-0 caption font-weight-bold">
              {{ variantName(combo.variant) }}
            </p>
            <p
              class="mb-0 caption"
              v-if="combo.amount - combo.number_used !== 0"
            >
              Trị giá:
              <span class="primary--text">
                {{ combo.total_price | currency }}
              </span>
            </p>
            <p
              class="mb-0 caption"
              v-if="combo.amount - combo.number_used !== 0"
            >
              Khả dụng:
              <span class="font-weight-bold error--text">
                {{ combo.amount - combo.number_used }} lượt
              </span>
            </p>
            <p class="mb-0 caption" v-if="combo.number_used">
              Đã dùng:
              <span class="font-weight-bold">
                {{ combo.number_used }} lượt
              </span>
            </p>
            <ul>
              <li
                class="caption font-weight-bold primary--text"
                v-for="order in combo.orders"
                :key="order.id"
              >
                {{ order.created_at | formatDate }} -
                <v-btn
                  text
                  class="error--text"
                  x-small
                  @click="
                    $router.push({
                      name: 'IntakeDetail',
                      params: { intakeid: order.intake_id },
                    });
                    dispatch('coreDialog/closeDialog');
                  "
                  >Xem</v-btn
                >
              </li>
            </ul>
          </div>
          <template v-if="item.promotion_type === 'promotion-combos'">
            <h3 class="mt-4">Gói tặng khách:</h3>
            <div
              class="combo-history-items"
              v-for="(combo, index) in promotionCombos"
              :key="`promotion_${index}`"
            >
              <p class="mb-0 font-weight-bold primary--text">
                {{ combo.variant.service.name }}
              </p>
              <p class="mb-0 caption font-weight-bold">
                {{ variantName(combo.variant) }}
              </p>
              <p
                class="mb-0 caption"
                v-if="combo.amount - combo.number_used !== 0"
              >
                Khả dụng:
                <span class="font-weight-bold error--text">
                  {{ combo.amount - combo.number_used }} lượt
                </span>
              </p>
              <p class="mb-0 caption" v-if="combo.number_used">
                Đã dùng:
                <span class="font-weight-bold">
                  {{ combo.number_used }} lượt
                </span>
              </p>
              <ul>
                <li
                  class="caption font-weight-bold primary--text"
                  v-for="order in combo.orders"
                  :key="order.id"
                >
                  {{ order.created_at | formatDate }} -
                  <v-btn
                    text
                    class="error--text"
                    x-small
                    @click="
                      $router.push({
                        name: 'IntakeDetail',
                        params: { intakeid: order.intake_id },
                      });
                      dispatch('coreDialog/closeDialog');
                    "
                    >Xem</v-btn
                  >
                </li>
              </ul>
            </div>
          </template>
          <template v-if="isValid">
            <h3 class="font-weight-bold mt-4">Hình thức thanh toán:</h3>
            <UpdatePaymentMethod
              :id="item.id"
              v-model="item.payment_method_id"
              :api-url="'api/v1/packages'"
              :payment-field="'payment_method_id'"
              @change="isDirty = true"
            />
          </template>
        </div>
      </v-card-text>
      <v-card-actions class="d-flex align-center justify-end px-4 pb-4">
        <v-btn color="error" rounded dark depressed @click="close">
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { getPackage } from '@/api/packages';
import UpdatePaymentMethod from '@/components/Shared/UpdatePaymentMethod';

export default {
  name: 'PackageDetailDialog',
  components: {
    UpdatePaymentMethod,
  },
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      item: null,
      isDirty: false,
    };
  },
  methods: {
    close() {
      if (this.isDirty) this.$emit('update');
      else this.dialog = false;
    },
    async open() {
      this.setLoading(true);
      this.item = null;
      try {
        const response = await getPackage(this.id);
        if (response.status === 200) {
          this.item = response.data.Data;
          this.dialog = true;
        }
      } catch (err) {
        console.log(err);
      }
      this.setLoading(false);
    },
  },
  computed: {
    isValid() {
      return this.item ? this.item.is_valid : false;
    },
    promotionCombos() {
      return this.item.combos.filter((combo) => combo.is_promotion_combo);
    },
    paidCombos() {
      return this.item.combos.filter((combo) => !combo.is_promotion_combo);
    },
  },
};
</script>
