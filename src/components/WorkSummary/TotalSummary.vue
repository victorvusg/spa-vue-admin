<template>
  <v-expansion-panels>
    <v-expansion-panel v-for="(record, index) in sortedList"
      :key="index" class="service-rank-item grey lighten-3 mb-2">
      <v-expansion-panel-header>
        <div class="d-flex align-center">
          <div class="d-flex align-center pa-4 rank-position">
            {{ index + 1 }}
          </div>
          <div class="pl-2">
            <div class="rank-employee mb-1">
              {{ record.name }}
            </div>
            <div>
              Tổng số tours: <strong :class="{
                'red--text': record.totalOrders,
                'grey--text text--lighten-1': !record.totalOrders,
              }">{{ record.totalOrders }}</strong>
            </div>
          </div>
        </div>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div v-for="(item, i) in record.groupsOfOrders" :key="i">
          <v-divider class="my-2"/>
          <div class="subtitle-1 primary--text mb-2 text-uppercase">
            {{ item.category }}
          </div>
          <ul>
            <li v-for="(order, index) in item.orders" :key="index" class="caption">
              {{ variantName(order.variant) }}
              <span v-if="order.variant.gender !== 'both'">- {{ $t(order.variant.gender) }}</span>
            </li>
          </ul>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>

export default {
  name: 'WorkSummaryIndex',
  props: {
    orders: {
      default: () => [],
    },
    employees: {
      default: () => [],
    },
  },
  data() {
    return {
      tab: null,
    };
  },
  methods: {
    groupingOrderByCategory(orders) {
      const groups = orders.reduce((acc, order) => {
        const category = order.variant.variant_category;
        if (acc[category]) {
          acc[category].total += 1;
          acc[category].orders.push(order);
        } else {
          acc[category] = {
            total: 1,
            category,
            orders: [order],
          };
        }
        return acc;
      }, {});
      return Object.values(groups).sort((a, b) => b.total - a.total);
    },
  },
  computed: {
    sortedList() {
      return this.employees.map((empl) => {
        const orders = this.orders.filter((o) => o.employee.id === empl.id);
        return {
          ...empl,
          totalOrders: orders.length,
          groupsOfOrders: this.groupingOrderByCategory(orders),
        };
      }).sort(
        (a, b) => b.totalOrders - a.totalOrders,
      );
    },
  },
};
</script>
<style lang="scss" scoped>
.service-rank-item {
  border-radius: 8px;

  &::after {
    display: none;
  }

  &::before {
    box-shadow: none;
  }

  .v-expansion-panel-header {
    padding: 0px;
  }

  .rank-position {
    font-weight: 700;
    border-right: 2px solid white;
  }

  .rank-employee {
    font-weight: 700;
  }
}
</style>
