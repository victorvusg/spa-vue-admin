<template>
  <v-card>
    <v-card-title class="d-flex">
      <h5 class="mr-auto">Độ phổ biến của các dịch vụ</h5>
      <small>{{ orders.length }} orders</small>
    </v-card-title>
    <v-card-text v-if="orders.length > 0">
      <v-data-table
        dense
        :headers="headers"
        :items="orderStatisticComputed"
        item-key="name"
        class="elevation-1"
      >
       <template v-slot:item.name="{ item }">
         {{item.name}}
       </template>
       <template v-slot:item.total="{ item }">
        <span :class="{'green--text': item.total > 5, 'error--text': item.total <= 5}">
          {{item.total}}
        </span>
       </template>
      </v-data-table>
    </v-card-text>
    <v-card-text v-else> There's no orders </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'ServiceCount',
  components: {
  },
  data() {
    return {
      headers: [
        {
          text: 'Tên dịch vụ',
          value: 'name',
        },
        { text: 'Số lần thực hiện', value: 'total' },
      ],
    };
  },
  computed: {
    ...mapState('order', ['orders']),
    displayOrders() {
      return [...this.orders];
    },
    orderStatisticComputed() {
      const servicesArray = [];
      if (this.orders.length > 0) {
        this.orders.forEach((item) => {
          const { variant } = item;
          const { service } = variant;
          const found = servicesArray.find((o) => o.id === service.id);
          if (found) {
            found.total += 1;
          } else {
            servicesArray.push({ ...service, total: 1 });
          }
        });
        return servicesArray.sort((a, b) => b.total - a.total);
      }
      return null;
    },
  },
};
</script>
