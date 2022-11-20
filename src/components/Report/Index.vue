<template>
  <div>
    <div class="d-flex align-center justify-space-between flex-wrap">
      <v-dialog
        ref="dialog"
        v-model="modal"
        :return-value.sync="dates"
        persistent
        width="290px"
      >
        <template v-slot:activator="{ on, attrs }">
          <h2
            v-ripple
            v-bind="attrs"
            v-on="on"
            class="primary--text d-flex align-center"
          >
            {{ dates.length > 1 ? dateString : 'Chọn ngày' }}
            <v-icon class="ml-2" size="28"> mdi-calendar</v-icon>
          </h2>
        </template>
        <v-date-picker
          v-model="dates"
          range
          locale="vi"
          :max="maxDate"
          :min="minDate"
        >
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
          <v-btn
            text
            color="primary"
            :disabled="dates.length < 2"
            @click="saveDate(dates)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-dialog>
      <h2>
        Tổng Cộng:
        <span class="font-weight-bold primary--text">
          {{ totalRevenue | currency }}
        </span>
      </h2>
    </div>
    <v-row>
      <v-col cols="12" md="4">
        <v-list-item three-line class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title>Đơn Check-in</v-list-item-title>
            <v-list-item-subtitle>
              Số lượng: <strong>{{ intakes.length }} đơn</strong>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Tổng đơn:
              <strong class="purple--text">{{ intakesTotal | currency }}</strong>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="4">
        <v-list-item three-line class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title>Gói dịch vụ</v-list-item-title>
            <v-list-item-subtitle>
              Số lượng: <strong>{{ combos.length }} gói</strong>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Tổng thu:
              <strong class="purple--text">{{ combosTotal | currency }}</strong>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
      <v-col cols="12" md="4">
        <v-list-item three-line class="pa-0">
          <v-list-item-content class="pa-0">
            <v-list-item-title>Xu Khách Nạp</v-list-item-title>
            <v-list-item-subtitle>
              Số lượng: <strong>{{ invoices.length }} Bills</strong>
            </v-list-item-subtitle>
            <v-list-item-subtitle>
              Tổng thu:
              <strong class="purple--text">{{
                invoicesTotal | currency
              }}</strong>
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-col>
    </v-row>
    <h3>Bảng Thống Kê</h3>
    <v-tabs
      show-arrows
      background-color="transparent"
      v-model="tab"
      class="pt-4"
    >
      <v-tab href="#intakes"> Đơn </v-tab>
      <v-tab href="#combos"> Gói bán </v-tab>
      <v-tab href="#invoices"> Nạp Xu </v-tab>
      <v-tab href="#commission"> Commission </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="pt-4">
      <v-tab-item :value="'intakes'">
        <IntakeSummary
          :dataSet="intakes"
          @update-record="fetchSummary(dates)"
        />
      </v-tab-item>
      <v-tab-item :value="'combos'">
        <ComboSummary :dataSet="combos" />
      </v-tab-item>
      <v-tab-item :value="'invoices'">
        <InvoiceSummary :dataSet="invoices" />
      </v-tab-item>
      <v-tab-item :value="'commission'">
        <CommissionSummary :dataSet="employees" :dateParams="dateParams" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import { privateAxios } from '@/api/api';
import moment from 'moment';
import { isEmpty } from 'lodash';
import IntakeSummary from './Summary/IntakeSummary';
import ComboSummary from './Summary/ComboSummary';
import CommissionSummary from './Summary/CommissionSummary';
import InvoiceSummary from './Summary/InvoiceSummary';

export default {
  name: 'ReportIndex',
  components: {
    IntakeSummary,
    ComboSummary,
    InvoiceSummary,
    CommissionSummary,
  },
  data() {
    return {
      data: null,
      dates: [],
      isEmpty,
      tab: 'intakes',
      modal: false,
      isFetching: false,
    };
  },
  watch: {},
  computed: {
    minDate() {
      if (this.loggedRole !== 'admin') {
        const currentDate = moment();

        return currentDate
          .clone()
          .subtract(7, 'days')
          .toISOString();
      }
      return '0';
    },
    maxDate() {
      return new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10);
    },
    totalRevenue() {
      return this.totalIncome + this.combosTotal + this.invoicesTotal;
    },
    intakes() {
      return this.data ? this.data.intakes : [];
    },
    totalIncome() {
       if (!this.data) return 0;
      let total = 0;
      if ('intakes' in this.data) {
        const cashIntakes = this.data.intakes.filter(
          (intake) => intake.payment_method_id !== 'credit',
        );
        total += cashIntakes.reduce(
          (sum, current) => sum + current.final_price,
          0,
        );
      }
      return total;
    },
    intakesTotal() {
      if (!this.data) return 0;
      let total = 0;
      if ('intakes' in this.data) {
        const cashIntakes = this.data.intakes.filter(
          (intake) => intake.payment_method_id !== 'credit',
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
       if (!this.data) return 0;
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
    employees() {
      return this.data ? this.data.employees : [];
    },
    invoicesTotal() {
       if (!this.data) return 0;
      let total = 0;
      if ('invoices' in this.data) {
        total += this.data.invoices.reduce(
          (sum, current) => sum + current.amount,
          0,
        );
      }
      return total;
    },
    dateString() {
      if (this.dates.length > 1) {
        if (this.dates[0] === this.dates[1]) {
          return `Ngày ${moment(this.dates[0]).format('DD/MM/YYYY')}`;
        }
        const fromDate = moment(this.dates[0]).format('DD/MM/YYYY');
        const toDate = moment(this.dates[1]).format('DD/MM/YYYY');
        return `${fromDate} đến ${toDate}`;
      }
      return '';
    },
    dateParams() {
      if (this.dates.length) {
        return {
          from_date: `${moment(this.dates[0]).format('YYYY-MM-DD')}`,
          to_date: `${moment(this.dates[1]).format('YYYY-MM-DD')}`,
        };
      }
      return {};
    },
  },
  methods: {
    saveDate(dates) {
      let dateArray = dates;
      if (this.dates.length > 1 && dates[0] !== dates[1]) {
        dateArray = this.dates.sort((a, b) => new Date(a) - new Date(b));
      }
      this.$nextTick(async () => {
        this.$refs.dialog.save(dateArray);
        await this.fetchSummary(dateArray);
      });
    },
    async fetchSummary(dates) {
      if (!dates.length) return;
      this.isFetching = true;
      this.setLoading(true);
      const params = {
        from: `${moment(dates[0]).format('YYYY-MM-DD')}`,
        to: `${moment(dates[1]).format('YYYY-MM-DD')}`,
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
        this.isFetching = false;
        this.setLoading(false);
      }
    },
  },
  async created() {
    const date = moment
      .utc()
      .local()
      .format('YYYY-MM-DD');
    this.dates = [date, date];
    await this.fetchSummary(this.dates);
  },
};
</script>
<style lang="scss">
.service-list {
  .v-data-table__expanded__content {
    background-color: #fafafa !important;
    box-shadow: none !important;
    .variants {
      background-color: #fff;
    }
  }
}
</style>
