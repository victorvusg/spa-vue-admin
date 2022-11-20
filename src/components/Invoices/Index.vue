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
      <template
        v-if="!useCustomSearchSlot"
        v-slot:filter="{ isLoading }"
      ></template>
      <template v-slot:item.name="{ item }">
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
      <template v-slot:item.phone="{ item }">
        <span>{{ item.customer.phone | formatPhone }}</span>
      </template>
      <template v-slot:item.created_at="{ item }">
        <span>{{ item.created_at | formatDate }}</span>
      </template>
      <template v-slot:header.promotion_amount="{ header }">
        <div class="text-right">
          {{ header.text }}
        </div>
      </template>
      <template v-slot:item.promotion_amount="{ item }">
        <div class="text-right">
          <span class="brown--text font-weight-bold">
            <template v-if="item.promotion_amount">
              {{ item.promotion_amount | coin }}
            </template>
            <template v-else>-</template>
          </span>
        </div>
      </template>
      <template v-slot:header.amount="{ header }">
        <div class="text-right">
          {{ header.text }}
        </div>
      </template>
      <template v-slot:item.amount="{ item }">
        <template v-if="item.type === 'withdraw'">
          <div class="text-right">
            <span v-if="item.status === 'pending'"> - </span>
            <span v-else class="red--text font-weight-bold">
              -{{ item.amount | coin }}
            </span>
          </div>
        </template>
        <template v-else>
          <div class="text-right">
            <span class="primary--text font-weight-bold">
              {{ item.amount | coin }}
            </span>
          </div>
        </template>
      </template>
      <template v-slot:item.status="{ item }">
        <template v-if="item.type === 'withdraw'">
          <span v-if="item.note === 'cashout'" class="error--text">Rút Xu</span>
          <span
            v-else
            :class="item.status === 'pending' ? 'error--text' : 'primary--text'"
          >
            {{ $t(`${item.type}_status.${item.status}`) }}
            <strong> #{{ item.intake_id }} </strong>
          </span>
        </template>
        <template v-if="item.type === 'deposit'">
          <span
            :class="item.status === 'pending' ? 'error--text' : 'primary--text'"
          >
            {{ $t(`${item.type}_status.${item.status}`) }}
          </span>
        </template>
        <template></template>
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
      <template v-slot:item.action="{ item }">
        <DetailModal
          :invoiceProps="item"
          @reload-list="refreshTable"
          v-if="item.type === 'deposit' || item.note === 'cashout'"
        />
        <v-btn
          v-if="
            item.note !== 'cashout' &&
            item.type === 'withdraw' &&
            item.status === 'paid'
          "
          color="info"
          depressed
          text
          small
          @click="openIntakeDetail(item.intake_id)"
        >
          Xem
        </v-btn>
      </template>
      <template v-slot:no-data>
        {{ $t('combos.no_combo_found') }}
      </template>
    </CoreTable>
    <IntakeDetailDialog :id="intakeId" ref="intakeDialog" />
  </div>
</template>
<script>
import DetailModal from '@/components/Invoices/Detail/Modal';
import CoreTable from '@/core/components/CoreTable';
import IntakeDetailDialog from '@/components/Intake/IntakeDetailDialog';

export default {
  name: 'InvoiceIndex',
  components: {
    DetailModal,
    CoreTable,
    IntakeDetailDialog,
  },
  props: {
    mainPage: {
      default: true,
    },
    customerId: {
      default: null,
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
      tableRf: 'invoiceTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_INVOICE_LIST,
      intakeId: null,
      headers: [
        { text: this.$t('intake.id'), value: 'id' },
        { text: this.$t('intake.ten_KH'), value: 'name' },
        { text: this.$t('intake.sdt'), value: 'phone' },
        {
          text: this.$t('intake.created'),
          value: 'created_at',
        },
        // {
        //   text: 'Loại GD',
        //   value: 'type',
        // },
        {
          text: 'Số Xu',
          value: 'amount',
        },
        {
          text: 'Được tặng',
          value: 'promotion_amount',
        },
        {
          text: 'Status',
          value: 'status',
        },
         {
          text: 'Thanh Toán',
          value: 'payment_method',
        },
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
    openIntakeDetail(id) {
      this.intakeId = id;
      this.$nextTick(() => {
        this.$refs.intakeDialog.openDialog();
      });
    },
  },
};
</script>
<style lang="scss" scoped></style>
