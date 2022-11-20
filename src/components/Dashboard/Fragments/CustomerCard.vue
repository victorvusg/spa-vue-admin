<template>
  <v-card>
    <v-card-title class="d-flex">
      <h5 class="mr-auto">Latest Customers</h5>
    </v-card-title>
    <v-card-text v-if="filteredCustomers.length > 0">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">Customer Name</th>
              <th class="text-right">Points</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in filteredCustomers" :key="item.id">
              <td>
                <strong>{{ item.name }}</strong>
              </td>
              <td class="success--text text-right">{{ item.cash_point | currency }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-text v-else> There's no customer </v-card-text>
  </v-card>
</template>
<script>
import moment from 'moment';
import { mapState } from 'vuex';

export default {
  name: 'CustomerCard',
  data() {
    return {};
  },
  computed: {
    ...mapState('customer', ['customers']),
    filteredCustomers() {
      const customers = this.customers
        .filter((item) => moment(item.created_at).month() === moment().month())
        .splice(0, 5);
      return customers;
    },
  },
};
</script>
