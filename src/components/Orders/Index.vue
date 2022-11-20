<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="extraParams"
      :ref="tableRf"
      :itemsPerPage="itemsPerPage"
    >
      <template
        v-for="(_, name) in $scopedSlots"
        :slot="name"
        slot-scope="slotData"
      >
        <slot :name="name" />
      </template>
      <!-- <template
        v-if="!useCustomSearchSlot"
        v-slot:filter="{ isLoading }"
      ></template> -->
      <template v-slot:item.employee="{ item }">
        <span>{{ item.employee.name }}</span>
      </template>
      <template v-slot:item.created_at="{ item }">
        <span>{{ item.created_at | formatDate }}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <span v-if="item.combo_id">Gói</span>
        <span v-else>{{ item.price | currency }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <DetailModal :order="item" />
      </template>
      <template v-slot:no-data>
        {{ $t('combos.no_combo_found') }}
      </template>
    </CoreTable>
  </div>
</template>
<script>
import DetailModal from '@/components/Orders/Detail';
import CoreTable from '@/core/components/CoreTable';

export default {
  name: 'OrderIndex',
  components: {
    DetailModal,
    CoreTable,
  },
  props: {
    mainPage: {
      default: true,
    },
    queryParams: {
      type: Object,
      default: () => {},
    },
    itemsPerPage: {
      default: 10,
    },
    useCustomSearchSlot: {
      default: false,
    },
  },
  data() {
    return {
      tableRf: 'orderTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST,
      intakeId: null,
      headers: [
        { text: 'Trị liệu', value: 'name' },
        { text: 'Phụ trách bởi', value: 'employee' },
        { text: 'Tạo lúc', value: 'created_at' },
        { text: 'Giá', value: 'price' },
        { text: 'Actions', value: 'action' },
      ],
      customerDetailId: null,
    };
  },
  computed: {
    extraParams() {
      const extraParams = {
        ...this.queryParams,
      };
      return extraParams;
    },
  },
  methods: {
    refreshTable() {
      if (this.$refs[this.tableRf]) {
        this.$refs[this.tableRf].fetchData();
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
