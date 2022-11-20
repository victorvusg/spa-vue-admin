<template>
  <v-card>
    <v-card-title class="d-flex">
      <h5 class="mr-auto">Service Count</h5>
      <small>{{ orders.length }} orders</small>
    </v-card-title>
    <v-card-text v-if="orders.length > 0">
      <chart-bar :dataSource="orderStatisticComputed" v-if="!!orderStatisticComputed"></chart-bar>
    </v-card-text>
    <v-card-text v-else>
      There's no orders
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';
import ChartBar from './ChartBar';

export default {
  name: 'OrderCard',
  components: {
    ChartBar,
  },
  data() {
    return {
    };
  },
  computed: {
    ...mapState('order', ['orders']),
    displayOrders() {
      return [...this.orders];
    },
    orderStatisticComputed() {
      const servicesArray = { labels: [], datasets: [{ data: [], label: 'Service Count', backgroundColor: '#0f3d3c' }] };
      if (this.orders.length > 0) {
        this.orders.forEach((item) => {
          const { variant } = item;
          const { service } = variant;
          if (servicesArray.labels.findIndex((labelItem) => labelItem === service.name) < 0) {
            servicesArray.labels.push(service.name);
            servicesArray.datasets[0].data.push(1);
          } else {
            const found = servicesArray.labels.findIndex((labelItem) => labelItem === service.name);
            servicesArray.datasets[0].data[found] += 1;
          }
        });
        return servicesArray;
      }
      return null;
    },
  },
};
</script>
