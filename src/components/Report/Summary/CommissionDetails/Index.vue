<template>
  <v-dialog
    :scrollable="false"
    persistent
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" v-bind="attrs" v-on="on" text> Chi tiết </v-btn>
    </template>
    <template v-if="dialog">
      <v-toolbar
        :class="{ 'mobile-toolbar': isMobile }"
        dark
        color="primary"
        elevation="0"
        rounded="false"
        style="z-index: 2"
      >
        <v-toolbar-title>Thống kê commission</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card
        class="grey lighten-3"
        :class="{ 'two-side-desktop-wrapper': !isMobile }"
        elevation="0"
      >
        <template>
          <v-row
            class="mx-0 two-side-content"
            :class="{ 'flex-column-reverse': isMobile }"
          >
            <v-col
              class="left-content"
              :class="{ 'pa-4': !isMobile }"
              :cols="isMobile ? 12 : 8"
            >
              <div class="headline mb-2 primary white--text py-2 text-center">
                Từ {{ dateParams.from_date | formatDate }} đến
                {{ dateParams.to_date | formatDate }}
              </div>
              <v-card class="mb-4" elevation="0">
                <div class="title pt-4 px-4">Làm dịch vụ</div>
                <WorkingCommissionList :queryParams="queryParams" />
              </v-card>
              <v-card class="mb-4" elevation="0">
                <div class="title pt-4 px-4">Bán Gói</div>
                <SaleCommissionList :queryParams="queryParams" />
              </v-card>
              <v-card class="mb-4" elevation="0">
                <div class="title pt-4 px-4">Nạp xu</div>
                <DepositCommission :queryParams="queryParams" />
              </v-card>
            </v-col>
            <v-col class="right-content" :cols="isMobile ? 12 : 4">
              <v-card elevation="0" class="pa-3 mb-3">
                <div class="display-1 mb-4">{{ item.name }}</div>
                <div>
                  <strong>Hoa hồng làm dịch vụ: </strong
                  >{{ item.working_commission | currency }}
                </div>
                <div>
                  <strong>Hoa hồng bán gói: </strong
                  >{{ item.sale_commission | currency }}
                </div>
                <div>
                  <strong>Hoa hồng nạp xu: </strong
                  >{{ item.topup_commission | currency }}
                </div>
                <div class="subtitle-1 mt-2">
                  <strong>Tổng cộng </strong
                  ><span class="primary--text font-weight-bold">{{
                    (item.topup_commission +
                      item.sale_commission +
                      item.working_commission)
                      | currency
                  }}</span>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </template>
  </v-dialog>
</template>
<script>
import SaleCommissionList from './SaleCommissionList';
import WorkingCommissionList from './WorkingCommissionList';
import DepositCommission from './DepositCommission';

export default {
  name: 'CommissionDetails',
  components: {
    SaleCommissionList,
    WorkingCommissionList,
    DepositCommission,
  },
  props: {
    item: {
      required: true,
    },
    dateParams: {
      default: () => {},
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    queryParams() {
      return {
        employee_id: this.item.id,
        ...this.dateParams,
      };
    },
  },
};
</script>
<style lang="scss">
</style>
