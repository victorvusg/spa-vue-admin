<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="queryParams"
      :ref="tableRf"
    >
      <template v-slot:item.is_valid="{ item }">
        <i class="primary--text" v-if="item.is_valid">Đã kích hoạt</i>
        <i class="error--text" v-else>Chưa kích hoạt</i>
      </template>
      <template v-slot:item.customer="{ item }">
        <router-link
          class="font-weight-bold"
          v-if="item.customer"
          :to="{
            name: 'CustomerDetails',
            params: { customerId: item.customer.id },
          }"
          >{{ item.customer.name }}</router-link
        >
      </template>
      <template v-slot:item.sale_commission="{ item }">
        <span class="error--text">{{ item.sale_commission | currency }}</span>
      </template>
      <template v-slot:item.price="{ item }">
        <span class="green--text font-weight-bold" v-if="item.is_valid">
          {{ item.total_price | currency }}
        </span>
        <span class="gray--text" v-else>-</span>
      </template>
      <template v-slot:item.expiry_date="{ item }">
        <span class="error--text">{{ item.expiry_date | formatDate }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <PackageDetailDialog :id="item.id" @update="refreshTable" />
        <template v-if="view !== 'employee'">
          <!-- <v-btn
            v-if="item.is_valid"
            depressed
            color="success"
            small
            text
            @click="printReceipt(item)"
          >
            In Hóa Đơn
          </v-btn> -->
          <RemovePackageDialog
            :pack="item"
            v-if="!item.is_valid"
            @remove-success="refreshTable"
          />
          <ApprovePackageDialog
            :pack="item"
            v-if="!item.is_valid"
            @approved-success="handleApprove"
          />
        </template>
      </template>
      <template v-slot:item.payment_method="{ item }">
        <span
          :class="{
            'black--text': item.payment_method_id === 'cash',
            'blue--text': item.payment_method_id === 'bank_transfer',
            'pink--text': item.payment_method_id === 'momo',
            'warning--text': item.payment_method_id === 'credit',
            'primary--text': item.payment_method_id === 'card',
          }"
        >
          {{ $t(item.payment_method_id) }}</span
        >
      </template>
      <template v-slot:no-data>
        {{ $t('combos.no_combo_found') }}
      </template>
    </CoreTable>
    <PackageReceiptDialog :pack="receiptModel" ref="packageReceiptDialogRef" />
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';
import PackageDetailDialog from '@/components/Package/Detail/Dialog';
import ApprovePackageDialog from '@/components/Package/ApprovePackageDialog';
import RemovePackageDialog from '@/components/Package/RemovePackageDialog';
import PackageReceiptDialog from '@/components/Package/PackageReceipt/PackageReceiptDialog';

export default {
  name: 'PackageIndex',
  components: {
    PackageDetailDialog,
    ApprovePackageDialog,
    RemovePackageDialog,
    PackageReceiptDialog,
    CoreTable,
  },
  props: {
    view: {
      type: String,
      default: '',
    },
    queryParams: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      tableRf: 'comboTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST,
      receiptDialog: false,
      receiptModel: {},
      autoPrint: false,
      userId: null,
      searchString: '',
      currentPack: null,
      confirmationDialogStatus: false,
      isFetched: false,
      confirmationDialogInfo: {
        headline: '',
        content: '',
        dataSource: null,
        formDialog: null,
        formConfirm: () => {},
      },
    };
  },
  methods: {
    async handleApprove({ item }) {
      this.printReceipt(item);
      await this.refreshTable();
    },
    async fetchData() {
      this.setLoading(true);
      await this.fetchPackages();
      this.setLoading(false);
    },
    refreshTable() {
      if (this.$refs[this.tableRf]) {
        this.$refs[this.tableRf].fetchData();
      }
    },
    printReceipt(item) {
      this.receiptModel = item;
      this.$refs.packageReceiptDialogRef.open();
    },
  },
  computed: {
    headers() {
      const headers = [
        { text: this.$t('combos.id'), value: 'id' },
        { text: this.$t('combos.customer'), value: 'customer' },
        { text: this.$t('combos.expiry_date'), value: 'expiry_date' },
        { text: 'Trạng Thái', value: 'is_valid' },
        { text: this.$t('combos.price'), value: 'price' },
        {
          text: 'Thanh Toán',
          value: 'payment_method',
        },
      ];
      switch (this.view) {
        case 'employee': {
          headers.push({
            text: this.$t('employees.sale_commission'),
            value: 'sale_commission',
          });
          break;
        }
        case 'customer':
        default:
      }
      return [...headers, { text: '', value: 'action' }];
    },
  },
};
</script>
<style lang="scss" scoped></style>
