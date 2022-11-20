<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="extraParams"
      :ref="tableRf"
    >
      <template v-slot:item.id="{ item }">
        {{ item.id }}
      </template>
      <template v-slot:item.name="{ item }">
        <span class="success--text font-weight-bold">{{ item.name }}</span>
      </template>
      <template v-slot:item.phone="{ item }">
        <span v-if="!item.phone">-</span>
        <div v-else>
          <template v-if="!$vuetify.breakpoint.smAndUp">
            <a :href="`tel:${item.phone}`">
              {{ item.phone | formatPhone }}
            </a>
          </template>
          <template v-else>
            {{ item.phone | formatPhone }}
          </template>
        </div>
      </template>
      <template v-slot:item.work_commission="{ item }">
        {{ item.working_commission | currency }}
      </template>
      <template v-slot:item.sale_commission="{ item }">
        {{ item.sale_commission | currency }}
      </template>
      <template v-slot:item.topup_commission="{ item }">
        {{ item.topup_commission | currency }}
      </template>
      <template v-slot:item.action="{ item }">
        <ChangePassword :id="item.user_id" />
      </template>
      <template v-slot:no-data>
        {{ $t('employees.no_ktv_found') }}
      </template>
    </CoreTable>
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';
import ChangePassword from './ChangePassword';

export default {
  name: 'EmployeeIndex',
  components: {
    CoreTable,
    ChangePassword,
  },
  data() {
    return {
      tableRf: 'employeeTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEE_LIST,
      headers: [
        { text: this.$t('employees.id'), value: 'id' },
        { text: this.$t('employees.name'), value: 'name' },
        { text: this.$t('employees.phone'), value: 'phone' },
        { text: 'working commisssion', value: 'work_commission' },
        { text: 'sale commission', value: 'sale_commission' },
        { text: 'topup commission', value: 'topup_commission' },
        { text: '', value: 'action', sortable: false },
      ],
      searchString: '',
      addEmployeeDialog: false,
    };
  },
  computed: {
    extraParams() {
      return {
        roleId: 2,
      };
    },
  },
};
</script>
<style></style>
