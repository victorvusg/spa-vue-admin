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
        <div class="mb-2 d-flex align-end justify-space-between">
          <div class="title">
            Đơn số
            <span class="font-weight-bold primary--text">
              #{{ intake.id }}
            </span>
          </div>
          <div class="caption font-weight-bold d-flex align-center">
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
        <!-- Main Review -->
        <v-card
          elevation="0"
          v-if="intake.review_form && intake.review_form.note"
          class="mt-2 pa-4 white"
          style="border: thin dashed rgb(105, 158, 60); border-radius: 4px"
        >
          <h3 class="mb-1 red--text">Đánh giá</h3>
          <div
            style="white-space: pre-line;"
            v-html="intake.review_form.note"
          />
        </v-card>

        <!-- Single tickets  -->
        <div v-if="singleTickets.length" class="mt-2">
          <h4>Dịch vụ lẻ</h4>
          <v-row class="mt-n2">
            <v-col
              :cols="isMobile ? 12 : 6"
              v-for="ticket in singleTickets"
              :key="ticket.id"
            >
              <SingleTicket :order="ticket" />
            </v-col>
          </v-row>
        </div>

        <!-- Promotion Tickets -->
        <div v-if="promotionDeals.length" class="mt-2">
          <h4>Deal Ưu Đãi</h4>
          <v-row>
            <v-col cols="12" v-for="deal in promotionDeals" :key="deal.id">
              <PromotionDeal :order="deal" />
            </v-col>
          </v-row>
        </div>
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

import pricingMixins from '@/mixins/pricing.mixins';
import { parseNote } from '@/helpers/intakeHelper';
import { getIntake, updateIntake } from '@/api/intake';

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
  },
  async created() {
    await this.fetchData();
  },
};
</script>
<style lang="scss"></style>
