<template>
  <v-card
    v-if="resource"
    class="grey lighten-3"
    :class="{ 'two-side-desktop-wrapper': !isMobile }"
    elevation="0"
  >
    <v-row
      class="mx-0 two-side-content"
      :class="{ 'flex-column-reverse': isMobile }"
    >
      <v-col
        class="left-content"
        :class="{ 'pa-4': !isMobile }"
        :cols="isMobile ? 12 : 8"
      >
        <div class="mb-8">
          <div class="body-1 font-weight-bold mb-2">GÓI ĐÃ MUA</div>
          <PackageIndex :queryParams="packageQueryParams" />
        </div>
        <div class="mb-8">
          <div class="body-1 font-weight-bold mb-2">DANH SÁCH GIAO DỊCH</div>
          <InvoiceIndex
            :queryParams="queryParams"
            :itemsPerPage="5"
            :useCustomSearchSlot="true"
          >
            <template v-slot:filter>
              <div class="d-flex flex-wrap subtitle-2">
                <div class="d-flex align-center mr-4">
                  <v-icon size="14px" class="mr-1" color="primary">
                    mdi-record
                  </v-icon>
                  Đã nạp:
                  <span class="ml-1 primary--text">
                    {{ resource.total_deposit || 0 | coin }}
                  </span>
                </div>
                <div class="d-flex align-center mr-4">
                  <v-icon size="14px" class="mr-1" color="brown">
                    mdi-record
                  </v-icon>
                  Được tặng:
                  <span class="ml-1 brown--text">
                    {{ resource.total_promotion_amount || 0 | coin }}
                  </span>
                </div>
                <div class="d-flex align-center mr-4">
                  <v-icon size="14px" class="mr-1" color="red">
                    mdi-record
                  </v-icon>
                  Đã dùng:
                  <span class="ml-1 red--text">
                    -{{ resource.total_withdraw || 0 | coin }}
                  </span>
                </div>
                <div class="d-flex align-center mr-4">
                  <v-icon size="14px" class="mr-1" color="blue">
                    mdi-record
                  </v-icon>
                  Còn lại:
                  <span class="ml-1 blue--text">
                    {{ resource.balance || 0 | coin }}
                  </span>
                </div>
              </div>
            </template>
          </InvoiceIndex>
        </div>
        <div class="mb-8">
          <div class="body-1 font-weight-bold mb-2">DANH SÁCH ĐƠN</div>
          <IntakeIndex
            :itemsPerPage="5"
            :queryParams="queryParams"
            v-if="resource.id"
          />
        </div>
        <div>
          <div class="body-1 font-weight-bold mb-2">DANH SÁCH TRỊ LIỆU</div>
          <OrderIndex
            :itemsPerPage="5"
            :queryParams="queryParams"
            v-if="resource.id"
          />
        </div>
      </v-col>
      <v-col class="right-content" :cols="isMobile ? 12 : 4">
        <v-card elevation="0" class="pa-3 mb-3">
          <CustomerCard :customer="resource" />
        </v-card>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';
import CustomerCard from '@/components/Customer/CustomerCard';

export default {
  name: 'CustomerDetail',
  components: {
    CustomerCard,
    PackageIndex: () =>
      import(
        /* webpackChunkName: "PackageIndex" */ '@/components/Package/Index'
      ),
    InvoiceIndex: () =>
      import(
        /* webpackChunkName: "DiscountIndex" */ '@/components/Invoices/Index'
      ),
    OrderIndex: () =>
      import(/* webpackChunkName: "OrderIndex" */ '@/components/Orders/Index'),
    IntakeIndex: () =>
      import(/* webpackChunkName: "IntakeIndex" */ '@/components/Intake/Index'),
  },
  data() {
    return {
      dialog: false,
      isFetched: false,
      id: null,
    };
  },
  computed: {
    ...mapState('customer', ['resource']),
    queryParams() {
      return {
        customer_id: this.resource.id,
      };
    },
    packageQueryParams() {
      return {
        is_valid: 1,
        customer_id: this.resource.id,
      };
    },
  },
  methods: {
    async fetchData() {
      this.isFetched = false;
      this.setLoading(true);
      await this.dispatch('customer/FETCH_DETAILS', this.id);
      this.setLoading(false);
      this.isFetched = true;
    },
    clearData() {},
  },
  destroyed() {
    this.dispatch('customer/RESET_RESOURCE');
  },
  async created() {
    const { customerId } = this.$route.params;
    if (customerId) {
      this.id = customerId;
      await this.fetchData();
    }
  },
};
</script>
<style lang="scss"></style>
