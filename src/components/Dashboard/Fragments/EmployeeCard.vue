<template>
  <v-card>
    <v-card-title class="d-flex">
      <h5 class="mr-auto">Thông tin nhân viên</h5>
    </v-card-title>
    <v-radio-group v-model="queryString" row class="px-4">
      <v-radio label="Tháng này" :value="0"></v-radio>
      <v-radio label="Tháng trước" :value="'_prev'"></v-radio>
    </v-radio-group>
    <v-card-text>
      <v-data-table
        :headers="headers"
        :items="employeeList"
        :items-per-page="20"
        :hide-default-header="$vuetify.breakpoint.smAndUp"
      >
        <template
          v-slot:header="{ props: { headers } }"
          v-if="$vuetify.breakpoint.smAndUp"
        >
          <thead>
            <tr>
              <th
                v-for="(header, index) in headers"
                :key="index"
                :class="{ 'text-right': index !== 0 }"
              >
                {{ header.text }}
              </th>
            </tr>
          </thead>
        </template>
        <template v-slot:item.name="{ item }">
          <span class="font-weight-bold">
            {{ item.name }}
          </span>
        </template>
        <template v-slot:item.total_sales="{ item }">
          <div class="font-weight-bold error--text text-right">
            {{
                item[`total_sales${queryString ? queryString : ''}`] | currency
            }}
          </div>
        </template>
        <template v-slot:item.work_commission="{ item }">
          <div class="primary--text text-right">
            {{
                item[`working_commission${queryString ? queryString : ''}`] | currency
            }}
          </div>
        </template>
        <template v-slot:item.sale_commission="{ item }">
          <div class="primary--text text-right">
            {{
                item[`sale_commission${queryString ? queryString : ''}`] | currency
            }}
          </div>
        </template>
        <template v-slot:item.topup_commission="{ item }">
          <div class="primary--text text-right">
            {{
                item[`topup_commission${queryString ? queryString : ''}`] | currency
            }}
          </div>
        </template>
        <template v-slot:item.total="{ item }">
          <div class="primary--text text-right">
            {{
                (item[`sale_commission${queryString ? queryString : ''}`] +
                  item[`working_commission${queryString ? queryString : ''}`] +
                  item[`topup_commission${queryString ? queryString : ''}`]) | currency
            }}
          </div>
        </template>
        <template v-slot:no-data>{{
          $t('customers.no_customer_found')
        }}</template>
      </v-data-table>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'EmployeeCard',
  data() {
    return {
      queryString: 0,
      headers: [
        { text: this.$t('employees.name'), value: 'name' },
        { text: 'Tổng tiền dịch vụ đã làm ', value: 'total_sales' },
        { text: 'Working Commisssion', value: 'work_commission', sortable: false },
        { text: 'Sale Commission', value: 'sale_commission', sortable: false },
        { text: 'Topup Commission', value: 'topup_commission', sortable: false },
        { text: 'Tổng cộng', value: 'total' },
      ],
    };
  },
  computed: {
    ...mapState('statistic', ['statistic']),
    ...mapState('employee', ['employees']),
    employeeList() {
      if (this.queryString) {
        return this.employees.sort((a, b) => b.total_sales_prev - a.total_sales_prev);
      }
      return this.employees.sort((a, b) => b.total_sales - a.total_sales);
    },
  },
};
</script>
<style lang="scss">
.highlight-employee {
  background: #ffe8e8;
}
</style>
