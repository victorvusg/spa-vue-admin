<template>
  <div class="intake-list-container">
    <CoreTable
      :headers="headers"
      :url="url"
      :extraParams="extraParams"
      :ref="tableRf"
    >
      <template v-slot:filter="{ isLoading }">
        <v-row>
          <v-col cols="12" md="4" class="py-0 d-flex align-center">
            <v-text-field
              v-if="searchBy === 'name'"
              class="mt-0 pt-0"
              :disabled="isLoading"
              hide-details
              :value="searchKey"
              @input="debounceInput"
              placeholder="Tên Khách Hàng"
              clearable
              @click:clear="searchKey = null"
            ></v-text-field>
            <v-text-field
              v-else
              class="mt-0 pt-0"
              type="number"
              inputmode="number"
              pattern="[0-9]*"
              :disabled="isLoading"
              hide-details
              :value="searchKey"
              @input="debounceInput"
              clearable
              placeholder="SĐT Khách"
              @click:clear="searchKey = null"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="8" class="py-0 d-flex align-center mt-4 mt-md-0">
            <v-radio-group
              v-model="searchBy"
              row
              hide-details
              class="mt-0 pt-0"
              @change="searchKey = ''"
            >
              <template v-slot:label> </template>
              <v-radio value="name">
                <template v-slot:label>
                  <div>Tìm theo <strong class="success--text">Tên</strong></div>
                </template>
              </v-radio>
              <v-radio value="phone">
                <template v-slot:label>
                  <div>
                    <div>Tìm theo <strong class="info--text">SĐT</strong></div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-col>
        </v-row>
      </template>
      <template v-slot:item.id="{ item }">{{ item.id }}</template>
      <template v-slot:item.name="{ item }">
        <!-- <span class="pink--text font-weight-bold">{{ item.name }}</span> -->
        <v-edit-dialog
          @save="save(item, 'name')"
          @cancel="cancel"
          @open="open(item.name)"
          @close="cancel"
          :return-value.sync="item.name"
        >
          {{ item.name }} <v-icon size="12">mdi-pencil</v-icon>
          <template v-slot:input>
            <v-text-field
              v-model="editValue"
              label="Edit"
              single-line
            ></v-text-field>
          </template>
        </v-edit-dialog>
      </template>
      <template v-slot:item.phone="{ item }">
        <div class="d-inline-flex aling-center">
          <span v-if="!item.phone">-</span>
          <div v-else>
            <template v-if="!$vuetify.breakpoint.smAndUp">
              <a :href="`tel:${item.phone}`">{{ item.phone | formatPhone }}</a>
            </template>
            <template v-else>{{ item.phone | formatPhone }}</template>
          </div>
          <v-edit-dialog
            @save="save(item, 'phone')"
            @cancel="cancel"
            @open="open(item.phone)"
            @close="cancel"
            :return-value.sync="item.phone"
          >
            <v-icon class="ml-1" size="12">mdi-pencil</v-icon>
            <template v-slot:input>
              <v-text-field
                v-model="editValue"
                label="Edit"
                single-line
              ></v-text-field>
            </template>
          </v-edit-dialog>
        </div>
      </template>
      <template v-slot:header.points="{ header }">
        <div class="text-right">
          {{ header.text }}
        </div>
      </template>
      <template v-slot:item.points="{ item }">
        <div class="text-right">
          {{ item.cash_point | currency }}
        </div>
      </template>
      <template v-slot:header.balance="{ header }">
        <div class="text-right">
          {{ header.text }}
        </div>
      </template>
      <template v-slot:item.balance="{ item }" class="warning--text">
        <div class="blue--text font-weight-bold text-right">
          {{ item.balance | coin }}
        </div>
      </template>
      <template v-slot:header.total_spend="{ header }">
        <div class="text-right">
          {{ header.text }}
        </div>
      </template>
      <template v-slot:item.total_spend="{ item }">
        <div class="text-right">
          <v-menu :close-on-content-click="false" offset-x left>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                text
                color="green"
                v-bind="attrs"
                v-on="on"
                class="pa-0"
                :ripple="false"
              >
                {{ (item.total_spend || 0) | currency }}
              </v-btn>
              <!-- <v-icon
                size="15px"
                class="ml-1"
                color="warning"
                >mdi mdi-alert-circle</v-icon
              > -->
            </template>
            <v-card class="detail-total-spend pa-2 caption">
              <div>
                {{ $t('customers.intakes_spend') }}:
                <span class="primary--text">{{
                  (item.intakes_spend || 0) | currency
                }}</span>
              </div>
              <div>
                {{ $t('customers.packages_spend') }}:
                <span class="brown--text">{{
                  (item.packages_spend || 0) | currency
                }}</span>
              </div>
              <div>
                {{ $t('customers.coin_spend') }}:
                <span class="blue--text">{{
                  (item.total_deposit || 0) | currency
                }}</span>
              </div>
            </v-card>
          </v-menu>
        </div>
      </template>
      <template v-slot:item.rank="{ item }">
        <span v-if="!item.rank"> - </span>
        <v-chip v-else outlined :color="rankColors[item.rank]">{{
          $t(item.rank)
        }}</v-chip>
      </template>
      <template v-slot:item.action="{ item }">
        <router-link
          :to="{ name: 'CustomerDetails', params: { customerId: item.id } }"
          >Xem</router-link
        >
        <!-- <v-btn
          color="success"
          class="font-weight-bold"
          depressed
          small
          text
          @click="openDetail(item.id)"
        >
          XEM
        </v-btn> -->
      </template>
      <template v-slot:no-data>{{
        $t('customers.no_customer_found')
      }}</template>
    </CoreTable>
  </div>
</template>
<script>
import CoreTable from '@/core/components/CoreTable';
import { privateAxios } from '@/api/api';
import { debounce } from 'lodash';

export default {
  name: 'CustomerIndex',
  components: { CoreTable },
  data() {
    return {
      tableRf: 'customerTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_CUSTOMER_LIST,
      headers: [
        { text: this.$t('customers.id'), value: 'id' },
        { text: this.$t('customers.information'), value: 'name' },
        { text: this.$t('customers.phone'), value: 'phone' },
        { text: 'Tích luỹ', value: 'points' },
        { text: this.$t('customers.balance'), value: 'balance' },
        // { text: this.$t('customers.packages_spend'), value: 'balance' },
        // { text: this.$t('customers.coin_spend'), value: 'balance' },
        {
          text: this.$t('customers.total_spend'),
          value: 'total_spend',
        },
        { text: this.$t('customers.rank'), value: 'rank' },
        { text: '', value: 'action', sortable: false },
      ],
      searchBy: 'name',
      searchKey: '',
      editValue: '',
      rankColors: {
        silver: 'grey',
        gold: 'yellow accent-4',
        diamond: 'blue',
      },
    };
  },
  methods: {
    refreshTable() {
      if (this.$refs[this.tableRf]) {
        this.$refs[this.tableRf].fetchData();
      }
    },
    debounceInput: debounce(function (value) {
      this.searchKey = value;
    }, 400),
    async save(customer, field) {
      this.setLoading(true);
      const route = `${this.url}/${customer.id}`;
      const payload = {};
      payload[field] = this.editValue;
      try {
        const customerDetailRequest = await privateAxios.put(route, payload);
        this.setLoading(false);
        customer[field] = customerDetailRequest.data.Data[field];
        this.dispatch('toast/openToast', {
          color: 'success',
          message: 'Success. Update thành công !',
        });
      } catch (error) {
        let message = 'Failed. ';
        if (field === 'phone') message += 'Có thể sđt bị trùng !';
        else message += 'Đã có lỗi xảy ra !';
        this.dispatch('toast/openToast', {
          color: 'error',
          message,
        });
      } finally {
        this.setLoading(false);
        this.editValue = '';
      }
    },
    cancel() {
      this.editValue = '';
    },
    open(name) {
      this.editValue = name;
    },
    totalSpend(item) {
      return (
        (item.total_deposit || 0) +
        (item.packages_spend || 0) +
        (item.intakes_spend || 0)
      );
    },
    // openDetail(customerId, setRourteParam = true) {
    //   this.customerId = customerId;
    //   if (setRourteParam) {
    //     this.$router.push({ name: 'Customers', query: { customerId } });
    //   }
    //   this.$nextTick(() => {
    //     this.$refs.customerDialog.openDialog();
    //   });
    // },
  },
  computed: {
    extraParams() {
      const extraParams = {};
      extraParams[this.searchBy] = this.searchKey;
      return extraParams;
    },
  },
};
</script>
