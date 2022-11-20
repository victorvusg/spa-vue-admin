<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    persistent
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" small dark v-bind="attrs" v-on="on">
        Xem sao kê
      </v-btn>
    </template>
    <v-card>
      <v-app-bar color="primary" dark>
        <v-app-bar-nav-icon
          v-if="!$vuetify.breakpoint.smAndUp"
          @click.stop="summaryDrawer = !summaryDrawer"
        ></v-app-bar-nav-icon>

        <v-toolbar-title>Chi tiết sao kê</v-toolbar-title>

        <v-spacer></v-spacer>
        <v-btn
          icon
          dark
          @click="
            dialog = false;
            data = {};
          "
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-app-bar>

      <v-navigation-drawer
        v-model="summaryDrawer"
        absolute
        left
        temporary
        v-if="!$vuetify.breakpoint.smAndUp"
      >
        <div
          class="d-flex align-center justify-center"
          style="height: 56px; font-size: 1.25rem"
        >
          Chọn mục xem
        </div>
        <v-tabs
          fixed-tabs
          background-color="transparent"
          v-model="tab"
          vertical
        >
          <v-tab href="#intakes"> Đơn đã xong </v-tab>
          <v-tab href="#combos"> Gói đã bán </v-tab>
          <v-tab href="#invoices"> Nạp Xu </v-tab>
          <v-tab href="#employees"> Hoa Hồng Nhân viên </v-tab>
        </v-tabs>
      </v-navigation-drawer>
      <template v-if="dialog">
        <v-row class="mx-0 px-4">
          <v-col class="pr-md-3" cols="12" md="3">
            <v-row>
              <v-col cols="12" class="pb-0"
                >Tổng <span class="success--text">Dịch Vụ</span></v-col
              >
              <v-col cols="12" class="success--text text-right pt-0">
                {{ intakesTotal | currency }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0"
                >Tổng <span class="blue--text">Bán Gói</span></v-col
              >
              <v-col cols="12" class="blue--text text-right pt-0">{{
                combosTotal | currency
              }}</v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0"
                >Tổng Khách <span class="warning--text">Nạp Xu</span></v-col
              >
              <v-col cols="12" class="warning--text text-right pt-0"
                >{{ invoicesTotal | currency }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0">Tổng Thu</v-col>
              <v-col cols="12" class="text-right pt-0">
                {{ totalRevenue | currency }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0"
                >Tổng <span class="error--text">Commission</span></v-col
              >
              <v-col cols="12" class="error--text text-right pt-0">
                -{{ commissionTotal | currency }}
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="pb-0 primary--text font-weight-bold"
                >Còn lại</v-col
              >
              <v-col
                cols="12"
                class="primary--text font-weight-bold text-right pt-0"
              >
                {{ (totalRevenue - commissionTotal) | currency }}
              </v-col>
            </v-row>
          </v-col>
          <v-col
            cols="12"
            md="9"
            class="pl-md-3"
            :style="
              $vuetify.breakpoint.mdAndUp
                ? { 'border-left': '1px solid black' }
                : ''
            "
          >
            <v-row class="mx-0 error-message-hidden date-input-summary">
              <v-col cols="12" sm="5" class="pt-1 pt-sm-3">
                <v-menu
                  v-model="menuFromDate"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formattedFromDate"
                      clearable
                      label="Từ ngày"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="fromDate = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="fromDate"
                    @change="menuFromDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="5">
                <v-menu
                  v-model="menuToDate"
                  :close-on-content-click="false"
                  max-width="290"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="formattedToDate"
                      clearable
                      label="Đến ngày"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                      :disabled="!fromDate"
                      @click:clear="toDate = null"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="toDate"
                    :min="fromDate"
                    @change="menuToDate = false"
                  ></v-date-picker>
                </v-menu>
              </v-col>
              <v-col cols="12" sm="2" class="d-flex align-center">
                <v-btn
                  depressed
                  block
                  color="primary"
                  @click="fetchSummary"
                  :disabled="!fromDate || !toDate"
                >
                  Xem
                </v-btn>
              </v-col>
            </v-row>
            <v-tabs
              fixed-tabs
              background-color="transparent"
              v-model="tab"
              v-if="$vuetify.breakpoint.smAndUp"
              class="pt-4"
            >
              <v-tab href="#intakes"> Đơn đã xong </v-tab>
              <v-tab href="#combos"> Gói đã bán </v-tab>
              <v-tab href="#invoices"> Nạp Xu </v-tab>
              <v-tab href="#employees"> Hoa Hồng Nhân viên </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab" class="pt-4">
              <v-tab-item :value="'intakes'">
                <IntakeSummary :dataSet="intakes" />
              </v-tab-item>
              <v-tab-item :value="'combos'">
                <ComboSummary :dataSet="combos" />
              </v-tab-item>
              <v-tab-item :value="'invoices'">
                <InvoiceSummary :dataSet="invoices" />
              </v-tab-item>
              <v-tab-item :value="'employees'">
                <CommissionSummary :dataSet="employees" />
              </v-tab-item>
            </v-tabs-items>
          </v-col>
        </v-row>
      </template>
    </v-card>
  </v-dialog>
</template>
<script>
import moment from 'moment';
import { privateAxios } from '@/api/api';
import IntakeSummary from './IntakeSummary';
import ComboSummary from './ComboSummary';
import CommissionSummary from './CommissionSummary';
import InvoiceSummary from './InvoiceSummary';

export default {
  name: 'SummaryDetailsDialog',
  components: {
    IntakeSummary,
    ComboSummary,
    CommissionSummary,
    InvoiceSummary,
  },
  data() {
    return {
      data: {},
      dialog: false,
      summaryDrawer: false,
      tab: 'intakes',
      fromDate: null,
      menuFromDate: false,
      toDate: null,
      menuToDate: false,
    };
  },
  computed: {
    formattedToDate() {
      return this.toDate ? moment(this.toDate).format('DD/MM/YYYY') : '';
    },
    formattedFromDate() {
      return this.fromDate ? moment(this.fromDate).format('DD/MM/YYYY') : '';
    },
    totalRevenue() {
      return this.intakesTotal + this.combosTotal + this.invoicesTotal;
    },
    intakes() {
      return this.data ? this.data.intakes : [];
    },
    intakesTotal() {
      let total = 0;
      if ('intakes' in this.data) {
        const cashIntakes = this.data.intakes.filter(
          (intake) => intake.payment_method_id === 'cash',
        );
        total += cashIntakes.reduce(
          (sum, current) => sum + current.final_price,
          0,
        );
      }
      return total;
    },
    combos() {
      return this.data ? this.data.combos : [];
    },
    combosTotal() {
      let total = 0;
      if ('combos' in this.data) {
        total += this.data.combos.reduce(
          (sum, current) => sum + current.total_price,
          0,
        );
      }
      return total;
    },
    invoices() {
      return this.data ? this.data.invoices : [];
    },
    invoicesTotal() {
      let total = 0;
      if ('invoices' in this.data) {
        total += this.data.invoices.reduce(
          (sum, current) => sum + current.amount,
          0,
        );
      }
      return total;
    },
    employees() {
      return this.data ? this.data.employees : [];
    },
    commissionTotal() {
      let total = 0;
      if ('employees' in this.data) {
        total += this.data.employees.reduce(
          (sum, current) =>
            sum +
            (current.working_commission || 0) +
            (current.sale_commission || 0) +
            (current.topup_commission || 0),
          0,
        );
      }
      return total;
    },
  },
  methods: {
    async fetchSummary() {
      this.setLoading(true);
      const params = {
        from: `${this.fromDate} 00:00:00`,
        to: `${this.toDate} 23:59:59`,
      };
      try {
        const statisticRequest = await privateAxios.get(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_STATISTIC}/summary-details`,
          { params },
        );

        if (statisticRequest.status === 200) {
          this.data = statisticRequest.data.Data;
        }
      } catch (error) {
        console.log(error);
      } finally {
        this.setLoading(false);
      }
    },
  },
  watch: {
    fromDate() {
      this.toDate = null;
    },
    tab() {
      this.summaryDrawer = false;
    },
  },
};
</script>
<style lang="scss">
.date-input-summary {
  .v-input__slot {
    margin-bottom: 0px !important;
  }
}
</style>
