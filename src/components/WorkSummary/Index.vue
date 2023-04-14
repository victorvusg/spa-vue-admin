<template>
  <div>
    <v-dialog ref="dialog" v-model="modal" :return-value="dates" persistent width="290px">
      <template v-slot:activator="{ on, attrs }">
        <h2 v-ripple v-bind="attrs" v-on="on" class="primary--text d-flex align-center">
          {{ dates.length > 1 ? dateString : 'Chọn ngày' }}
          <v-icon class="ml-2" size="28"> mdi-calendar</v-icon>
        </h2>
      </template>
      <v-date-picker v-model="dates" range locale="vn" :max="
        new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
          .toISOString()
          .substr(0, 10)
      ">
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
        <v-btn text color="primary" :disabled="dates.length < 2" @click="onDateSave(dates)">
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
    <h2 class="mb-2">
      Tổng số tour dịch vụ:
      <span class="red--text">{{ orders.length }}</span>
    </h2>
    <v-tabs v-model="tab" background-color="transparent" color="primary" grow>
      <v-tab :key="'totalOrders'">
        Tổng tours
      </v-tab>
      <v-tab :key="'serviceRanking'">
        Xếp hạng
      </v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab">
      <v-tab-item :key="'totalOrders'">
        <v-card flat>
          <TotalSummary :orders="orders" :employees="employees" />
        </v-card>
      </v-tab-item>
      <v-tab-item :key="'serviceRanking'">
        <v-card flat>
          <ServiceRanking :orders="orders" :serviceCategories="serviceCategories" />
        </v-card>
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import moment from 'moment';
import { privateAxios as api } from '@/api/api';
import ServiceRanking from './ServiceRanking';
import TotalSummary from './TotalSummary';

export default {
  name: 'WorkSummaryIndex',
  components: {
    ServiceRanking,
    TotalSummary,
  },
  data() {
    return {
      tab: '',
      dates: [],
      dateRange: [],
      isFetched: false,
      employees: [],
      serviceCategories: [],
      orders: [],
      modal: false,
    };
  },
  computed: {
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
  },
  methods: {
    onDateSave(dates) {
      let dateArray = dates;
      if (this.dates.length > 1 && dates[0] !== dates[1]) {
        dateArray = this.dates.sort((a, b) => new Date(a) - new Date(b));
      }
      this.$nextTick(async () => {
        this.dateRange = dateArray;
        this.$refs.dialog.save(dateArray);
        this.setLoading(true);
        await this.getOrders(this.dateRange);
        this.setLoading(false);
      });
    },
    async fetchEmployees() {
      try {
        const response = await api.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEE_LIST,
          {
            params: {
              roleId: 2,
              per_page: 10000,
            },
          },
        );
        if (response.status === 200) {
          this.employees = response.data.Data;
        }
      } catch (err) {
        console.log(err);
      }
    },
    async fetchServiceCategories() {
      try {
        const serviceCategoriesListRequest = await api.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_CATEGORY_LIST,
        );
        if (serviceCategoriesListRequest.status === 200) {
          this.serviceCategories = serviceCategoriesListRequest.data.Data.filter(
            (el) => el.name !== 'promotion',
          );
        }
      } catch (error) {
        // TODO: error handling
        // console.log(error.toString());
      }
    },
    async getOrders(dateRange) {
      try {
        if (!dateRange.length) return;
        const response = await api.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST,
          {
            params: {
              from_date: dateRange[0],
              to_date: dateRange[1],
              per_page: 999999999,
            },
          },
        );
        if (response.status === 200) {
          this.orders = response.data.Data;
        }
      } catch (err) {
        console.log(err);
      }
    },
  },
  async created() {
    this.setLoading(true);
    const start = moment.utc().local().startOf('month').format('YYYY-MM-DD');
    const end = moment.utc().local().endOf('month').format('YYYY-MM-DD');
    this.dates = [start, end];
    this.dateRange = this.dates;
    await this.fetchEmployees();
    await this.fetchServiceCategories();
    await this.getOrders(this.dateRange);
    this.setLoading(false);
  },
};
</script>
