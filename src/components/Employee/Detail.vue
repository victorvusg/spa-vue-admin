<template>
  <DetailPage :heading="heading" :breadcrumbs="breadcrumbsItems">
    <div>
      {{ $t('employee.title') }}
    </div>
    <v-row>
      <v-col cols="12" sm="6">
        <template v-if="employeeDetail">
          <div class="d-flex">
            <h4 class="mb-2 mr-auto">{{ 'Kỹ Thuật Viên'.toUpperCase() }}</h4>
          </div>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey darken-1">mdi-account</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title> {{ employeeDetail.name }}</v-list-item-title>
              <v-list-item-subtitle>Họ & Tên</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <a :href="`tel:${employeeDetail.phone}`">
                <v-icon color="grey darken-1">mdi-phone</v-icon>
              </a>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{
                employeeDetail.phone | formatPhone
              }}</v-list-item-title>
              <v-list-item-subtitle>Mobile</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey darken-1">mdi-email</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{
                employeeDetail.email || '-'
              }}</v-list-item-title>
              <v-list-item-subtitle>Email</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey darken-1">mdi-human</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                >{{
                  Math.round(employeeDetail.attitude_point) || '0'
                }}
                điểm</v-list-item-title
              >
              <v-list-item-subtitle>Điểm thái độ</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey darken-1">mdi-briefcase</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
                >{{
                  Math.round(employeeDetail.skill_point) || '0'
                }}
                điểm</v-list-item-title
              >
              <v-list-item-subtitle>Điểm tay nghề</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-divider inset></v-divider>

          <v-list-item>
            <v-list-item-icon>
              <v-icon color="grey darken-1">mdi-chart-pie</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>Working commission</v-list-item-title>
              <v-list-item-subtitle
                >Tháng này:
                {{ (employeeDetail.working_commission || 0) | currency }}
              </v-list-item-subtitle>
              <v-list-item-subtitle
                >Tháng trước:
                {{ (employeeDetail.working_commission_prev || 0) | currency }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action></v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Sales commission</v-list-item-title>
              <v-list-item-subtitle
                >Tháng này:
                {{
                  (employeeDetail.sale_commission || 0) | currency
                }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Tháng trước:
                {{
                  (employeeDetail.sale_commission_prev || 0) | currency
                }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action></v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Topup commission</v-list-item-title>
              <v-list-item-subtitle
                >Tháng này:
                {{
                  (employeeDetail.topup_commission || 0) | currency
                }}</v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Tháng trước:
                {{
                  (employeeDetail.topup_commission_prev || 0) | currency
                }}</v-list-item-subtitle
              >
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-action></v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>Điểm chuyên cần</v-list-item-title>
              <v-list-item-subtitle>
                Tháng này:
                <span
                  :class="
                    employeeDetail.attendance > 0
                      ? 'green--text'
                      : 'error--text'
                  "
                  >{{ getAttendancePoint(employeeDetail.attendance) }}</span
                >
              </v-list-item-subtitle>
              <v-list-item-subtitle>
                Tháng trước:
                <span
                  :class="
                    employeeDetail.attendance_prev > 0
                      ? 'green--text'
                      : 'error--text'
                  "
                  >{{
                    getAttendancePoint(employeeDetail.attendance_prev)
                  }}</span
                >
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
        </template>
      </v-col>
      <v-col cols="12" sm="6" v-if="employeeDetail">
        <div class="d-flex">
          <h4 class="mb-2 mr-auto">CÔNG VIỆC ĐÃ HOÀN THÀNH</h4>
        </div>
        <template v-if="tasks.length">
          <v-data-iterator
            :items="tasks"
            style="max-height: ; overflow-y: auto"
            :footer-props="{
              itemsPerPageText: 'Per Page',
            }"
          >
            <template v-slot:default="props">
              <v-list-item
                class="task"
                v-for="(task, index) in props.items"
                :key="index"
                :to="{
                  name: 'IntakeDetail',
                  params: { intakeid: task.intake_id },
                }"
              >
                <v-list-item-avatar>
                  <v-icon>mdi-timelapse</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="primary--text font-weight-bold">
                    {{ task.variant.service.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle class="font-weight-bold">
                    {{ variantName(task.variant) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    Lúc {{ task.created_at | formatDate(true) }}
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <span>
                      Mã đơn -
                      <strong>{{ task.intake_id }}</strong>
                    </span>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <strong> ORDER{{ task.id }} </strong>
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-row class="ma-0 text-right">
                    <v-col class="pa-0" cols="12">
                      <v-list-item-subtitle> Commission </v-list-item-subtitle>
                    </v-col>
                    <v-col class="pa-0" cols="12">
                      <span class="primary--text">
                        {{ task.working_commission | currency }}
                      </span>
                    </v-col>
                  </v-row>
                </v-list-item-action>
              </v-list-item>
            </template>
          </v-data-iterator>
        </template>
        <template v-else>
          <div class="d-flex align-center justify-center flex-column pa-10">
            <v-icon size="48px" color="error">mdi mdi-block-helper</v-icon>
            <h4 class="mt-2">Danh sách trống</h4>
          </div>
        </template>
      </v-col>
      <v-col cols="12" v-if="employeeDetail">
        <PackageIndex
          v-if="employeeDetail"
          :view="'employee'"
          :mainPage="false"
        />
        <JudgementsIndex :employee="employeeDetail" class="mt-4" />
      </v-col>
    </v-row>
  </DetailPage>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DetailPage from '@/layout/DetailPage';
import routeHelper from '@/helpers/routeHelper';
import PackageIndex from '@/components/Package/Index';
import JudgementsIndex from '@/components/Judgement/Index';

export default {
  name: 'EmployeeDetail',
  components: {
    DetailPage,
    PackageIndex,
    JudgementsIndex,
  },
  data() {
    return {
      heading: this.$t('employee.heading'),
      breadcrumbsItems: [
        {
          text: this.$t('breadcrumbs.dashboard'),
          disabled: false,
          href: routeHelper.getPath('Dashboard'),
        },
        {
          text: this.$t('breadcrumbs.employee'),
          disabled: false,
          href: routeHelper.getPath('Employees'),
        },
      ],
      totalComboItems: 0,
      headers: [
        { text: this.$t('combos.id'), value: 'id' },
        { text: this.$t('combos.service'), value: 'service' },
        { text: this.$t('combos.customer'), value: 'customer' },
        { text: this.$t('combos.price'), value: 'price' },
        { text: this.$t('combos.usage'), value: 'usage' },
        { text: this.$t('combos.expiry_date'), value: 'expiry_date' },
        {
          text: this.$t('employees.sale_commission'),
          value: 'sale_commission',
        },
      ],
    };
  },
  computed: {
    ...mapState('employee', ['employeeDetail']),
    tasks() {
      if (this.employeeDetail) {
        return this.employeeDetail.tasks;
      }
      return [];
    },
    combos() {
      if (this.employeeDetail) {
        return this.employeeDetail.combos;
      }
      return [];
    },
  },
  methods: {
    ...mapActions('employee', ['fetchEmployeeDetail']),
    getAttendancePoint(point) {
      if (!point) {
        return 0;
      }
      if (point < 0) {
        return `Bị trừ ${point * -1} điểm`;
      }
      return `Được cộng ${point} điểm`;
    },
    updatePageLayout() {
      this.breadcrumbsItems.push({
        text: this.employeeDetail.name,
        disabled: true,
        href: `/employees/${this.employeeDetail.id}`,
      });
    },
  },
  async mounted() {
    this.setLoading(true);
    await this.fetchEmployeeDetail(this.$route.params.employeeid);
    this.setLoading(false);
  },
};
</script>
