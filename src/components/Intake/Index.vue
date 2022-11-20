<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="extraParams"
      :ref="tableRf"
    >
      <template v-slot:filter="{ isLoading }">
        <v-menu
          v-model="dateMenu"
          :close-on-content-click="false"
          max-width="290"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              :disabled="isLoading"
              hide-details
              :value="formattedDate"
              clearable
              :placeholder="formattedDate ? null : 'Xem đơn theo ngày'"
              readonly
              v-bind="attrs"
              v-on="on"
              @click:clear="date = null"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            @change="dateMenu = false"
            locale="vi"
          ></v-date-picker>
        </v-menu>
      </template>
      <template v-slot:item.customerName="{ item }">
        <div>
          <h5>{{ $t('intake.intake_num') }} - {{ item.id }}</h5>
          <router-link
            v-if="item.customer"
            :to="{
              name: 'CustomerDetails',
              params: { customerId: item.customer.id },
            }"
            >{{ item.customer.name }}</router-link
          >
          <div class="primary--text font-weight-bold" v-else>
            Khách vãng lai
          </div>
        </div>
      </template>
      <template v-slot:item.customerPhone="{ item }">
        <span v-if="!item.customer || !item.customer.id"> - </span>
        <div v-else>
          <div>{{ item.customer.phone | formatPhone }}</div>
        </div>
      </template>
      <template v-slot:item.created_at="{ item }">
        <div>
          {{ item.created_at | formatDate(true) }}
        </div>
      </template>
      <template v-slot:item.approved_date="{ item }">
        <div>
          {{ item.approved_date | formatDate(true) }}
        </div>
      </template>
      <template v-slot:item.created_at="{ item }">
        <div>
          {{ item.created_at | formatDate(true) }}
        </div>
      </template>
      <template v-slot:item.final_price="{ item }">
        <div v-if="item.is_valid" class="font-weight-bold primary--text">
          {{ item.final_price | currency }}
        </div>
        <div v-else>-</div>
      </template>
      <template v-slot:item.cash_point="{ item }">
        <div>
          {{ item.customer_earned_points | currency }}
        </div>
      </template>
      <template v-slot:item.payment_method="{ item }">
        <span
          v-if="item.is_valid"
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
      <template v-slot:item.payment_received_amount="{ item }">
        <span
          v-if="item.payment_method_id !== 'credit'"
          :class="{
            'black--text': item.payment_method_id === 'cash',
            'blue--text': item.payment_method_id === 'bank_transfer',
            'pink--text': item.payment_method_id === 'momo',
            'warning--text': item.payment_method_id === 'credit',
            'primary--text': item.payment_method_id === 'card',
          }"
        >
          {{ item.payment_received_amount | currency }}</span
        >
      </template>
      <template v-slot:item.is_valid="{ item }">
        <v-icon v-if="item.is_valid" color="primary">mdi-check</v-icon>
        <v-icon v-else color="error">mdi-clock-outline</v-icon>
      </template>
      <template v-slot:item.action="{ item, fetchData }">
        <template>
          <v-btn
            color="success"
            class="font-weight-bold"
            depressed
            small
            text
            @click="openDetail(item.id)"
          >
            XEM
          </v-btn>
          <v-btn
            dark
            depressed
            small
            text
            color="error"
            v-if="!item.is_valid"
            @click="deleteHandler(item.id, fetchData)"
          >
            HỦY
          </v-btn>
        </template>

        <!-- <template v-if="$vuetify.breakpoint.mdAndUp">
          <v-btn
            dark
            depressed
            small
            icon
            color="error"
            v-if="!item.is_valid"
            @click="deleteHandler(item.id)"
          >
            <v-icon small>mdi-delete</v-icon>
          </v-btn>
        </template> -->
      </template>
    </CoreTable>
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';
import moment from 'moment';

export default {
  name: 'IntakeIndex',
  components: { CoreTable },
  props: {
    queryParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      tableRf: 'intakeTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST,
      headers: [
        { text: 'Thông tin', value: 'customerName' },
        { text: 'SĐT', value: 'customerPhone' },
        {
          text: 'Check-in',
          value: 'created_at',
        },
        {
          text: 'Check-out',
          value: 'approved_date',
        },
        {
          text: 'Thanh Toán',
          value: 'payment_method',
        },

        {
          text: 'Tích luỹ',
          value: 'cash_point',
        },
        {
          text: 'Tổng',
          value: 'final_price',
        },
        // {
        //   text: 'Khách thanh toán',
        //   value: 'payment_received_amount',
        // },
        { text: 'Actions', value: 'action' },
        // {
        //   text: '',
        //   value: 'is_valid',
        // },
      ],
      date: null,
      dateMenu: false,
      intakeId: null,
    };
  },
  methods: {
    refreshTable() {
      if (this.$refs[this.tableRf]) {
        this.$refs[this.tableRf].fetchData();
      }
    },
    openDetail(id) {
      this.$router.push({ name: 'IntakeDetails', params: { id } });
    },
    deleteHandler(id) {
      this.dispatch('coreDialog/openDialog', {
        title: 'Xóa Đơn Check-in',
        content: 'Bạn có chắc muốn xóa đơn này ?',
        agreeBtnLabel: 'ĐỒNG Ý',
        callBackFunc: async () => {
          this.setLoading(true);
          await this.dispatch('intake/removeIntake', { intakeId: id });
          await this.refreshTable();
          this.dispatch('coreDialog/closeDialog');
          this.setLoading(false);
        },
      });
    },
  },
  computed: {
    formattedDate() {
      return this.date
        ? moment(this.date)
            .local()
            .format('DD/MM/YYYY')
        : '';
    },
    extraParams() {
      const extraParams = {};
      const parsedDate = moment(this.date);
      if (parsedDate.isValid()) {
        const fromDate = parsedDate
          .startOf('day')
          .format('yyyy-MM-DD HH:mm:ss');
        const toDate = moment(this.date)
          .endOf('day')
          .format('yyyy-MM-DD HH:mm:ss');
        extraParams.from_date = fromDate;
        extraParams.to_date = toDate;
      }
      return { ...extraParams, ...this.queryParams };
    },
  },
};
</script>
