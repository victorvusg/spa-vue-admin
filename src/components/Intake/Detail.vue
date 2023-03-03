<!-- eslint-disable function-paren-newline -->
<template>
  <div v-if="intake" :class="{ 'two-side-desktop-wrapper': !isMobile }">
    <v-row
      class="mx-0 two-side-content"
      :class="{ 'flex-column-reverse': isMobile }"
    >
      <v-col
        class="left-content"
        :class="{ 'pa-4': !isMobile }"
        :cols="isMobile ? 12 : 8"
      >
        <div class="mb-2 d-flex align-end justify-space-between mb-6">
          <div class="headline font-weight-bold ">
            ĐƠN SỐ
            <span class="primary--text"> #{{ intake.id }} </span>
          </div>
          <div class="headline font-weight-bold d-flex align-center">
            <template v-if="intake.is_valid">
              <v-icon size="18px" class="mr-1" color="primary">
                mdi-check-circle-outline
              </v-icon>
              {{ 'Đã thanh toán' }}
            </template>
            <template v-else>
              <v-icon size="18px" class="mr-1" color="primary">
                mdi-clock-outline
              </v-icon>
              {{ 'Đang làm' }}
            </template>
          </div>
        </div>
        <v-alert
          class="mt-4"
          outlined
          color="warning"
          prominent
          border="left"
          v-if="intake.review_form && intake.review_form.note"
        >
          <h3 class="overline">Đánh giá</h3>
          <v-divider />
          <div
            class="caption mt-4"
            style="white-space: pre-line;"
            v-html="intake.review_form.note"
          />
        </v-alert>
        <!-- Main Review -->
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-left font-weight-bold subtitle-2 grey--text">
                  TÊN DỊCH VỤ / SẢN PHẨM
                </th>
                <th class="text-right font-weight-bold subtitle-2 grey--text">
                  SỐ LƯỢNG
                </th>
                <th class="text-right font-weight-bold subtitle-2 grey--text">
                  ĐƠN GIÁ
                </th>
                <th class="text-right font-weight-bold subtitle-2 grey--text">
                  TỔNG CỘNG
                </th>
              </tr>
            </thead>
            <tbody>
              <SingleCartItem
                v-for="ticket in singleTickets"
                :order="ticket"
                :key="ticket.id"
                @update="handleUpdate"
                :disabled="intake.is_valid && intake.payment_method_id"
                @onDelete="handleDelete"
              />
              <PromotionCartItem
                v-for="deal in promotionDeals"
                :order="deal"
                :key="deal.id"
                @onDelete="handleDelete"
              />
            </tbody>
          </template>
        </v-simple-table>
      </v-col>

      <v-col class="right-content" :cols="isMobile ? 12 : 4">
        <v-card elevation="0" class="pa-3 mb-3 white">
          <CustomerCard :customer="intake.customer" />
        </v-card>
        <v-card elevation="0" class="px-3 mb-3 white">
          <InvoiceCard :intake="intake" />
        </v-card>
        <v-card elevation="0" class="px-3 mb-3 white" v-if="pointLogs.length">
          <div class="subtitle-1 font-weight-bold mb-2">
            Lịch sử dùng điểm
          </div>
          <ul>
            <li
              class="subtitle-1 mb-2"
              v-for="(log, index) in pointLogs"
              :key="index"
            >
              <span v-html="log.message" />
              <span class="caption ml-1"
                >(ghi nhận ngày {{ log.created_at | formatDate }})</span
              >
            </li>
          </ul>
        </v-card>
        <template v-if="intake.is_valid && intake.payment_method_id">
          <template v-if="intake.payment_method_id !== 'credit'">
            <v-card elevation="0" class="pa-3 mb-3 white">
              <div class="subtitle-1 font-weight-bold mb-2">
                Khách thanh toán
              </div>
              <div class="mb-2">
                <div class="subtitle-2 grey--text text--darken-1">
                  Hình thức:
                </div>
                <UpdatePaymentMethod
                  :id="intake.id"
                  v-model="intake.payment_method_id"
                  :api-url="apiUrl"
                  :payment-field="'payment_method_id'"
                  @change="emitIntakeUpdated"
                />
              </div>
              <!-- TODO: Hide for now -->
              <!-- <div class="subtitle-2 grey--text text--darken-1">
                Số tiền:
              </div>
              <div class="d-flex align-center">
                <vuetify-money
                  class="mt-n4 mb-3 mr-6 flex-grow-1"
                  v-model="paymentReceivedAmount"
                  v-bind:options="options"
                  hide-details
                />
                <v-btn
                  elevation="0"
                  color="primary"
                  @click="updatePaymentAmount"
                  >Cập nhật</v-btn
                >
              </div> -->
            </v-card>
          </template>
          <v-card elevation="0" class="pa-3 mb-3 white">
            <div class="subtitle-1 font-weight-bold mb-2">
              Khách Tip:
            </div>
            <div class="mb-2">
              <div class="subtitle-2 grey--text text--darken-1">
                Hình thức:
              </div>
              <UpdatePaymentMethod
                :id="intake.id"
                v-model="intake.tips_method"
                :api-url="apiUrl"
                :payment-field="'tips_method'"
                @change="emitIntakeUpdated"
              />
            </div>
            <div class="subtitle-2 grey--text text--darken-1">
              Số tiền:
            </div>
            <div class="d-flex align-center">
              <vuetify-money
                class="mt-n4 mb-3 mr-6 flex-grow-1"
                v-model="tipsAmount"
                v-bind:options="options"
                hide-details
              />
              <v-btn elevation="0" color="primary" @click="updateTipsAmount">
                Cập nhật
              </v-btn>
            </div>
          </v-card>
        </template>
        <div v-if="!intake.is_valid" class="mb-3">
          <ApprovalDialog :intake="intake" @approved="handleIntakeApproval" />
        </div>
        <v-btn block @click="fetchData" elevation="0" color="warning">
          Tải lại đơn
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
/* eslint-disable camelcase */
import CustomerCard from '@/components/Customer/CustomerCard';
import OrderDetail from '@/components/Intake/components/OrderDetail';
import SingleTicket from '@/components/Intake/components/SingleTicket';
import ReceiptModal from '@/components/Intake/components/ReceiptModal';
import InvoiceCard from '@/components/Intake/components/InvoiceCard';
import PromotionDeal from '@/components/Intake/components/PromotionDeal';
import ApprovalDialog from '@/components/Intake/dialogs/ApprovalDialog';
import UpdatePaymentMethod from '@/components/Shared/UpdatePaymentMethod';
import { privateAxios } from '@/api/api';

import pricingMixins from '@/mixins/pricing.mixins';
import { parseNote } from '@/helpers/intakeHelper';
import { getIntake, updateIntake } from '@/api/intake';
import SingleCartItem from './components/SingleCartItem';
import PromotionCartItem from './components/PromotionCartItem';

export default {
  name: 'intake',
  mixins: [pricingMixins],
  components: {
    CustomerCard,
    OrderDetail,
    PromotionDeal,
    InvoiceCard,
    ReceiptModal,
    SingleTicket,
    ApprovalDialog,
    UpdatePaymentMethod,
    SingleCartItem,
    PromotionCartItem,
  },
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      intake: null,
      reviewPanel: true,
      value: 0,
      options: {
        locale: 'pt-BR',
        prefix: '',
        suffix: 'đồng',
        length: 9,
        precision: 0,
      },
      payment_received_amount: 0,
      tips: 0,
      apiUrl: process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST,
    };
  },
  computed: {
    paymentReceivedAmount: {
      get() {
        return Number(this.payment_received_amount) * 1000;
      },
      set(value) {
        this.payment_received_amount = Number(value) / 1000;
      },
    },
    tipsAmount: {
      get() {
        return Number(this.tips) * 1000;
      },
      set(value) {
        this.tips = Number(value) / 1000;
      },
    },
    singleTickets() {
      if (!this.intake.orders) return [];
      return this.intake.orders
        .filter((o) => !o.promotion_hash)
        .reduce((accum, el) => {
          const order = {
            ...el,
            note: parseNote(el.note),
          };
          accum.push(order);
          return accum;
        }, []);
    },
    promotionDeals() {
      if (!this.intake.orders) return [];
      return this.intake.orders
        .filter((o) => !!o.promotion_hash)
        .reduce((list, el) => {
          const foundIndex = list.findIndex(
            (promotion) => promotion.hash === el.promotion_hash,
          );
          if (foundIndex !== -1) {
            list[foundIndex].subOrders.push({
              ...el,
              note: parseNote(el.note),
            });
          } else {
            const order = {
              hash: el.promotion_hash,
              subOrders: [
                {
                  ...el,
                  note: parseNote(el.note),
                },
              ],
            };
            list.push(order);
          }
          return list;
        }, []);
    },
    preTotal() {
      return this.calculateTotalPrice(
        [...this.singleTickets, ...this.promotionDeals],
        'unit_price',
      );
    },
    pointLogs() {
      if (!this.intake.point_logs) return [];
      return this.intake.point_logs.map((log) => ({
        ...log,
        message: log.message.replace(
          /{([^"]+)}/g,
          '<strong class="name">$1</strong>',
        ),
      }));
    },
  },
  methods: {
    mapData(intake) {
      return ['payment_received_amount', 'tips'].forEach((key) => {
        this[key] = intake[key];
      });
    },
    async fetchData() {
      this.setLoading(true);
      try {
        const response = await getIntake(this.id);
        if (response.status === 200) {
          this.intake = response.data.Data;
          this.mapData(this.intake);
        }
      } catch (error) {
        console.log(error);
      }
      this.setLoading(false);
    },
    async emitIntakeUpdated() {
      await this.$emit('intake-updated');
    },
    async handleIntakeApproval() {
      await this.fetchData();
      await this.emitIntakeUpdated();
    },
    async update(payload, errorCallback = () => {}) {
      try {
        const { id } = this.intake;
        this.setLoading(true);
        const response = await updateIntake(id, payload);
        if (response.status === 200) {
          this.dispatch('toast/openToast', {
            color: 'warning',
            message: 'Cập nhật thành công',
          });
          await this.emitIntakeUpdated();
        } else {
          errorCallback();
        }
      } catch (err) {
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Cập nhật thất bại',
        });
        errorCallback();
        console.log(err);
      } finally {
        this.setLoading(false);
      }
    },
    async updatePaymentAmount() {
      const errorCallback = () => {
        this.payment_received_amount = this.intake.payment_received_amount;
      };
      await this.update(
        { payment_received_amount: this.payment_received_amount },
        errorCallback,
      );
    },
    async updateTipsAmount() {
      const errorCallback = () => {
        this.tips = this.intake.tips;
      };
      await this.update({ tips: this.tips }, errorCallback);
    },
    billingDetail(autoPrint) {
      this.autoPrint = autoPrint;
      this.receiptDialog = true;
    },
    handleUpdate() {
      this.fetchData();
    },
    async handleDelete(id) {
      await privateAxios.delete(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST}/${id}`,
      );
      await this.fetchData();
    },
  },
  async created() {
    await this.fetchData();
  },
};
</script>
<style lang="scss"></style>
