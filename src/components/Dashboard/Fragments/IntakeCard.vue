<template>
  <v-card>
    <v-card-title class="d-flex">
      <h5 class="mr-auto">Latest valid Intakes</h5>
    </v-card-title>
    <v-card-text v-if="displayIntakes.length > 0">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                Customer Name
              </th>
              <th>
                Status
              </th>
              <th class="text-right">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in displayIntakes" :key="item.id">
              <td>
                <strong>{{ item.customer.name }}</strong>
              </td>
              <td class="success--text">
                {{ item.is_valid ? 'valid' : 'invalid' }}
              </td>
              <td class="success--text text-right">
                {{ item.final_price | currency }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card-text>
    <v-card-text v-else>
      There's no customer
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';
import moment from 'moment';

export default {
  name: 'IntakeCard',
  data() {
    return {};
  },
  computed: {
    ...mapState('intake', ['intakes']),
    ...mapState('statistic', ['statistic']),
    displayIntakes() {
      return [...this.intakes].splice(0, 5);
    },
    thisMonthRevenue() {
      let sum = 0;
      this.intakes.forEach((item) => {
        sum += item.final_price;
        return item;
      });
      return sum;
    },
    thisMonth() {
      return moment().format('MMM YYYY');
    },
  },
};
</script>
