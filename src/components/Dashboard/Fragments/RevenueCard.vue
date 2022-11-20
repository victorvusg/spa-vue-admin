<template>
  <v-card v-if="statistic">
    <v-card-title class="pb-2 px-3">
      <div class="d-flex justify-space-between" style="width: 100%">
        <h5 class="mb-0">Tồng thu nhập</h5>
        <h3 class="mb-0 ml-auto error--text font-weight-light">
          {{ statistic.total_revenue | currency }}
        </h3>
      </div>
    </v-card-title>
    <v-row class="mx-0">
      <v-col cols="12" sm="4">
        <span class="mr-auto font-weight-bold">Theo ngày</span>
        <v-card-text class="px-0 pt-1">
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Hôm nay</span>
            <h3 class="mb-0 ml-auto error--text font-weight-light">
              {{ statistic.by_date.current | currency }}
            </h3>
          </div>
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Hôm qua</span>
            <h3 class="mb-0 ml-auto primary--text font-weight-light">
              {{ statistic.by_date.last | currency }}
            </h3>
          </div>
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Hôm trước nữa</span>
            <h3 class="mb-0 ml-auto warning--text font-weight-light">
              {{ statistic.by_date.previous | currency }}
            </h3>
          </div>
        </v-card-text>
      </v-col>
      <v-col cols="12" sm="4">
        <span class="mr-auto font-weight-bold">Theo Tháng</span>
        <v-card-text class="px-0 pt-1">
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Tháng này</span>
            <h3 class="mb-0 ml-auto error--text font-weight-light">
              {{ statistic.by_month.current | currency }}
            </h3>
          </div>
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Tháng trước</span>
            <h3 class="mb-0 ml-auto primary--text font-weight-light">
              {{ statistic.by_month.last | currency }}
            </h3>
          </div>
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Tháng trước nữa</span>
            <h3 class="mb-0 ml-auto warning--text font-weight-light">
              {{ statistic.by_month.previous | currency }}
            </h3>
          </div>
        </v-card-text>
      </v-col>
      <v-col cols="12" sm="4">
        <span class="mr-auto font-weight-bold">Theo Năm</span>
        <v-card-text class="px-0 pt-1">
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Năm nay</span>
            <h3 class="mb-0 ml-auto error--text font-weight-light">
              {{ statistic.by_year.current | currency }}
            </h3>
          </div>
          <div class="d-flex align-baseline mt-2">
            <span class="mr-auto">Năm trước</span>
            <h3 class="mb-0 ml-auto  primary--text font-weight-light">
              {{ statistic.by_year.last | currency }}
            </h3>
          </div>
        </v-card-text>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'RevenueCard',
  computed: {
    ...mapState('statistic', ['statistic']),
  },
};
</script>
