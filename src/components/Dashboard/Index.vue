<template>
  <div>
    <div class="mb-4 d-flex align-center">
      <h3 class="mr-auto">{{ $t('dashboard.dashboard') }}</h3>
    </div>
    <template v-if="!isFetched">
      <div class="buttons d-flex px-3 align-center justify-space-between">
        <v-skeleton-loader type="button"></v-skeleton-loader>
        <v-skeleton-loader type="button"></v-skeleton-loader>
      </div>
      <v-row class="mx-0">
        <v-col cols="12">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" md="6">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="3">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
        <v-col cols="12" lg="9">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
        <v-col cols="12">
          <v-skeleton-loader type="article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </template>
    <template v-if="isFetched">
      <div class="buttons d-flex px-3 align-center justify-space-between">
        <v-btn depressed color="secondary" small @click="fetchAll()">
          <v-icon small dark>mdi-refresh</v-icon>
        </v-btn>
        <SummaryDetailsDialog />
      </div>
      <v-row class="mx-0">
        <v-col cols="12">
          <revenue-card></revenue-card>
        </v-col>
        <v-col cols="12" md="6">
          <average-facility-satisfaction></average-facility-satisfaction>
        </v-col>
        <v-col cols="12" md="6">
          <average-customer-satisfaction></average-customer-satisfaction>
        </v-col>
        <v-col cols="12" lg="3">
          <customer-card></customer-card>
        </v-col>
        <v-col cols="12" lg="9">
          <EmployeeCard />
        </v-col>
        <v-col cols="12">
          <ServiceCount />
        </v-col>
      </v-row>
    </template>
  </div>
</template>
<script>
// import moment from 'moment';
import { mapState, mapActions } from 'vuex';
import CustomerCard from './Fragments/CustomerCard';
import EmployeeCard from './Fragments/EmployeeCard';
import ServiceCount from './Fragments/ServiceCount';
import AverageCustomerSatisfaction from './Fragments/AverageCustomerSatisfaction';
import AverageFacilitySatisfaction from './Fragments/AverageFacilitySatisfaction';
import RevenueCard from './Fragments/RevenueCard';
import SummaryDetailsDialog from './Fragments/Summary/SummaryDetailsDialog';

export default {
  name: 'DasboardComponent',
  data() {
    return {
      isFetched: false,
    };
  },
  components: {
    CustomerCard,
    EmployeeCard,
    ServiceCount,
    AverageCustomerSatisfaction,
    AverageFacilitySatisfaction,
    RevenueCard,
    SummaryDetailsDialog,
  },
  computed: {
    ...mapState('statistic', ['statistic']),
  },
  methods: {
    ...mapActions('statistic', ['fetchStatistic']),
    ...mapActions('customer', ['fetchCustomers']),
    ...mapActions('intake', ['fetchIntakes']),
    ...mapActions('order', ['fetchOrders']),
    ...mapActions('employee', ['fetchEmployees']),
    async fetchAll() {
      // const fromDateString = `${moment().format('YYYY-MM')}-01 00:00:00`;
      const orders = this.fetchOrders({
        filterOptions: { is_valid: 1 },
      });
      const intakes = this.fetchIntakes({
        filterOptions: { is_valid: 1 },
      });
      const customers = this.fetchCustomers();
      const statisticFecth = this.fetchStatistic();
      const employeesFetch = this.fetchEmployees();
      this.setLoading(true);
      await Promise.all([
        orders,
        intakes,
        customers,
        statisticFecth,
        employeesFetch,
      ]);
      this.isFetched = true;
      this.setLoading(false);
    },
  },
  async created() {
    await this.fetchAll();
  },
};
</script>
<style></style>
