<template>
  <v-dialog
    class="white"
    :scrollable="false"
    persistent
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
    v-model="dialog"
  >
    <template v-slot:activator="{ on }">
      <v-btn class="ml-2" depressed small @click="open">
        <v-icon left small>mdi-plus</v-icon>
        <span>Tạo chương trình</span>
      </v-btn>
    </template>
    <v-toolbar
      :class="{ 'mobile-toolbar': isMobile }"
      dark
      color="primary"
      elevation="0"
      rounded="false"
      style="z-index: 2"
    >
      <v-toolbar-items>
        <v-btn dark text @click="save" :disabled="!valid"> Tạo </v-btn>
      </v-toolbar-items>
      <v-spacer></v-spacer>
      <v-toolbar-title>Tạo khuyến mãi</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card
      :class="{ 'two-side-desktop-wrapper': !isMobile }"
      elevation="0"
      class="white"
    >
      <v-form
        ref="discountForm"
        v-model="valid"
        v-if="dialog && discountForm"
        class="row mx-0 two-side-content"
        :class="{ 'flex-column': isMobile }"
      >
        <v-col class="left-content pb-15 px-6" :cols="isMobile ? 12 : 8">
          <!-- Discount Name -->
          <div>
            <div class="section-label title mb-2">Nội dung chương trình</div>
            <div class="section-content">
              <v-text-field
                filled
                v-model="discountForm.name"
                :rules="rules.required"
              ></v-text-field>
            </div>
          </div>
          <!-- Days of week -->
          <div>
            <div class="section-label title d-flex align-center">
              <span
                >Áp dụng các ngày trong tuần:
                <v-dialog
                  v-model="dayDialog"
                  scrollable
                  max-width="300px"
                  v-if="$vuetify.breakpoint.smAndDown"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      class="primary--text px-0"
                      v-bind="attrs"
                      v-on="on"
                      small
                      text
                    >
                      Chọn ngày
                    </v-btn>
                  </template>
                  <v-card v-if="dayDialog">
                    <v-card-title> Chọn ngày </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text style="height: 300px">
                      <v-checkbox
                        v-for="day in days"
                        v-model="discountForm[day]"
                        :label="$t(day)"
                        :key="`apply_${day}`"
                      ></v-checkbox>
                    </v-card-text>
                    <v-divider></v-divider>
                    <v-card-actions class="d-flex align-center justify-end">
                      <v-btn
                        color="blue darken-1"
                        text
                        @click="dayDialog = false"
                      >
                        Đóng
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog></span
              >
            </div>
            <div class="section-content" v-if="$vuetify.breakpoint.smAndDown">
              {{ dayOfWeeksResults }}
            </div>
            <div v-else class="section-content d-flex justify-space-between">
              <v-checkbox
                v-for="day in days"
                v-model="discountForm[day]"
                :label="$t(day)"
                :key="`apply_${day}`"
              ></v-checkbox>
            </div>
          </div>
          <!-- All/Guest/Member Only -->
          <div>
            <div class="section-label title mb-2">Đối tượng khách hàng</div>
            <div class="section-content">
              <v-radio-group
                class="mt-0"
                v-model="discountForm.conditions.apply_to_conditions.key"
                column
                @change="applyToHandle"
              >
                <v-radio label="Tất cả" value="all" />
                <v-radio label="Khách chưa là thành viên" value="non-member" />
                <v-radio label="Chỉ dành cho Thành Viên" value="member" />
              </v-radio-group>
            </div>
          </div>
          <!-- Member only list -->
          <div
            v-if="discountForm.conditions.apply_to_conditions.key === 'member'"
          >
            <div class="section-label title mb-2">Áp dụng cho thành viên:</div>
            <div class="section-content d-flex align-center">
              <v-checkbox
                v-for="rank in ranks"
                :key="rank.id"
                class="caption mr-2 mt-0"
                v-model="discountForm.conditions.apply_to_conditions.value"
                :label="$t(rank.id)"
                :value="rank.id"
              />
            </div>
          </div>
          <!-- apply on  -->
          <div>
            <div class="section-label title mb-2">Giảm giá đối với:</div>
            <div class="section-content d-flex align-center">
              <v-radio-group
                class="mt-0"
                v-model="discountForm.conditions.apply_on_conditions.key"
                column
                :rules="rules.required"
                @change="applyOnHandle"
              >
                <v-radio
                  v-for="option in applyOptions"
                  :key="option"
                  :value="option"
                  :label="`${$t(`apply_on.${option}`)}`"
                />
              </v-radio-group>
            </div>
          </div>
          <div>
            <div class="section-label title mb-2">Thiết Lập Giá Trị</div>
            <div class="section-content">
              <!-- Apply all or whole_bill  -->
              <template v-if="applyOn === 'all' || applyOn === 'whole_bill'">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      label="Loại giá trị"
                      :items="types"
                      dense
                      v-model="
                        discountForm.conditions.apply_on_conditions.value.type
                      "
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      dense
                      label="Giá trị giảm"
                      class="pt-0"
                      type="number"
                      v-model="
                        discountForm.conditions.apply_on_conditions.value.value
                      "
                      :suffix="
                        discountForm.conditions.apply_on_conditions.value
                          .type === 'amount'
                          ? 'nghìn '
                          : '%'
                      "
                      :rules="
                        rules[
                          discountForm.conditions.apply_on_conditions.value.type
                        ]
                      "
                    ></v-text-field>
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <legend
                  id="input-185"
                  class="v-label theme--light font-weight-bold body-1 mb-2"
                >
                  Danh sách áp dụng
                </legend>
                <v-card
                  class="mb-4"
                  outlined
                  elevation="0"
                  v-for="(item, index) in discountForm.conditions
                    .apply_on_conditions.value"
                  :key="index"
                >
                  <v-row class="mx-0">
                    <v-col :cols="isMobile ? 12 : 6">
                      <v-autocomplete
                        :items="autocompleteData"
                        v-model="
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ].id
                        "
                        placeholder="Lựa chọn..."
                        color="blue-grey lighten-2"
                        :label="$t(`apply_on.${applyOn}`)"
                        :rules="rules.required"
                      />
                    </v-col>
                    <v-col :cols="isMobile ? 12 : 3">
                      <v-select
                        label="Hình thức giảm giá"
                        v-model="
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ].type
                        "
                        :items="['percentage', 'amount']"
                        @change="
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ].value = 0
                        "
                      >
                        <template slot="selection" slot-scope="{ item, index }">
                          <span>{{ $t(`discount.${item}`) }}</span>
                        </template>
                        <template slot="item" slot-scope="{ item }">
                          <div class="d-flex">
                            <span>{{ $t(`discount.${item}`) }}</span>
                          </div>
                        </template>
                      </v-select>
                    </v-col>
                    <v-col :cols="isMobile ? 12 : 3">
                      <v-text-field
                        type="number"
                        label="Giá trị giảm"
                        v-model="
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ].value
                        "
                        :suffix="
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ].type === 'amount'
                            ? 'nghìn '
                            : '%'
                        "
                        :rules="
                          rules[
                            discountForm.conditions.apply_on_conditions.value[
                              index
                            ].type
                          ]
                        "
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <div class="mx-4 body-1" v-if="applyOn === 'variants'">
                    <div class="font-weight-bold">Tính toán:</div>
                    <div
                      v-html="
                        priceCalculation(
                          discountForm.conditions.apply_on_conditions.value[
                            index
                          ],
                        )
                      "
                    />
                  </div>
                  <v-fab-transition>
                    <v-btn
                      color="red"
                      fab
                      dark
                      x-small
                      absolute
                      top
                      right
                      style="
                        height: 28px;
                        width: 28px;
                        top: -14px;
                        right: -14px;
                      "
                      @click="deleteApplyOnItem(index)"
                    >
                      <v-icon size="12">mdi-close</v-icon>
                    </v-btn>
                  </v-fab-transition>
                </v-card>
                <div class="d-flex align-center justify-end mt-3">
                  <v-btn
                    dense
                    color="primary"
                    elevation="0"
                    outlined
                    @click="addApplyOnItem"
                  >
                    <v-icon>mdi-plus</v-icon> Thêm
                  </v-btn>
                </div>
              </template>
            </div>
          </div>
        </v-col>
        <v-col class="right-content" :cols="isMobile ? 12 : 4">
          <div class="d-flex flex-column align-center">
            <div class="section-label title mb-2">Diễn ra trong thời gian</div>
            <div class="section-content">
              <v-row class="d-flex">
                <v-col cols="6">
                  <v-select :items="hours" label="Giờ" v-model="fromTime[0]" />
                </v-col>
                <v-col cols="6">
                  <v-select
                    :items="minutes"
                    label="Phút"
                    v-model="fromTime[1]"
                  />
                </v-col>
                <v-col cols="12" class="d-flex alig-center justify-center"
                  >Đến</v-col
                >
                <v-col cols="6">
                  <v-select :items="hours" label="Giờ" v-model="toTime[0]" />
                </v-col>
                <v-col cols="6">
                  <v-select :items="minutes" label="Phút" v-model="toTime[1]" />
                </v-col>
              </v-row>
              <div></div>
            </div>
          </div>
          <!-- Date setup -->
          <div class="d-flex flex-column align-center">
            <div class="section-label title mb-2">Diễn ra từ ngày</div>
            <div class="section-content">
              <v-date-picker
                @change="handleDateRange"
                v-model="fromDateToDate"
                range
                locale="vi-vi"
              >
                <div
                  class="d-flex align-center justify-space-between"
                  style="width: 100%"
                >
                  <div>
                    <div>Từ ngày</div>
                    <div>
                      <span v-if="discountForm.fromDate">
                        {{ discountForm.fromDate | formatDate }}
                      </span>
                      <span v-else>--/--/--</span>
                    </div>
                  </div>
                  <div>
                    <div>Đến ngày</div>
                    <div>
                      <span v-if="discountForm.toDate">
                        {{ discountForm.toDate | formatDate }}
                      </span>
                      <span v-else>--/--/--</span>
                    </div>
                  </div>
                </div>
              </v-date-picker>
            </div>
          </div>
        </v-col>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
/* eslint-disable prefer-destructuring */
// import moment from 'moment';
import { mapActions, mapState } from 'vuex';

export default {
  name: 'CreateNewDiscount',
  data() {
    return {
      discountForm: {
        name: '',
        conditions: {
          apply_to_conditions: {
            key: 'all',
            value: [],
          },
          apply_on_conditions: {
            key: 'all',
            value: {
              type: 'percentage',
              value: 0,
            },
          },
        },
        is_active: true,
        fromTime: '',
        toTime: '',
        fromDate: '',
        toDate: '',
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      },
      fromTime: ['09', '00', '00'],
      toTime: ['19', '00', '00'],
      valid: true,
      fromDateToDate: [],
      applyOptions: [
        // 'whole_bill',
        'all',
        'service_categories',
        'services',
        'variants',
      ],
      fromDateMenu: false,
      toDateMenu: false,
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      dayDialog: false,
      dialog: false,
      types: [
        {
          value: 'percentage',
          text: 'Phần trăm',
        },
        {
          value: 'amount',
          text: 'Số tiền',
        },
      ],
      rules: {
        required: [(v) => !!v || 'Không bỏ trống'],
        percentage: [(v) => (v > 0 && v <= 100) || 'Không hợp lệ'],
        amount: [(v) => v > 0 || 'Không hợp lệ'],
      },
    };
  },
  computed: {
    ...mapState('customer', ['ranks']),
    ...mapState('service', ['serviceCategories', 'services', 'variants']),
    hours() {
      return [...Array(24).keys()].map((i) => (i < 10 ? `0${i}` : `${i}`));
    },
    minutes() {
      return [...Array(60).keys()].map((i) => (i < 10 ? `0${i}` : `${i}`));
    },
    ranksData() {
      return [
        ...this.ranks.map((r) => ({
          value: r.id,
          text: `Thành viên ${this.$t(r.id)}`,
        })),
      ];
    },
    serviceCategoriesData() {
      return [
        ...this.serviceCategories
          .filter((el) => {
            const { value } = this.discountForm.conditions.apply_on_conditions;
            if (Array.isArray(value)) {
              return !value.includes(el.id) && el.name !== 'promotion';
            }
            return el.name !== 'promotion';
          })
          .map((it) => ({
            value: it.id,
            text: it.descriptions,
          })),
      ];
    },
    servicesData() {
      const services = [];
      Object.values(this.services)
        .filter((el) => {
          const { value } = this.discountForm.conditions.apply_on_conditions;
          if (Array.isArray(value)) {
            return !value.includes(el.id) && el.name !== 'promotion';
          }
          return el.name !== 'promotion';
        })
        .forEach((v) => {
          services.push(
            ...v.services.map((s) => ({
              value: s.id,
              text: s.name || 'Chưa có tên',
            })),
          );
        });
      return services;
    },
    variantsData() {
      return [
        ...this.variants
          .filter((el) => {
            const { value } = this.discountForm.conditions.apply_on_conditions;
            if (Array.isArray(value)) {
              return (
                !value.includes(el.id) &&
                el.service.service_category.name !== 'promotion'
              );
            }
            return el.service.service_category.name !== 'promotion';
          })
          .map((fv) => ({
            value: fv.id,
            text: fv.name || 'Chưa có tên',
          })),
      ];
    },
    autocompleteData() {
      switch (this.discountForm.conditions.apply_on_conditions.key) {
        case 'service_categories':
          return this.serviceCategoriesData;
        case 'services':
          return this.servicesData;
        case 'variants':
          return this.variantsData;
        default:
          return [];
      }
    },
    dayOfWeeksResults() {
      return this.days
        .filter((d) => this.discountForm[d])
        .map((d) => this.$t(d))
        .join(', ');
    },
    applyOn() {
      return this.discountForm.conditions.apply_on_conditions.key;
    },
  },
  methods: {
    ...mapActions('discount', ['createDiscount']),
    applyToHandle(val) {
      if (val === 'member') {
        this.discountForm.conditions.apply_to_conditions.value.push(
          ...this.ranks.map((r) => r.id),
        );
        return;
      }
      this.discountForm.conditions.apply_to_conditions.value = [];
    },
    applyOnHandle(val) {
      switch (val) {
        case 'whole_bill':
        case 'all':
          this.discountForm.conditions.apply_on_conditions.value = {
            type: 'percentage',
            value: 0,
          };
          break;
        default:
          this.discountForm.conditions.apply_on_conditions.value = [
            {
              id: null,
              type: 'percentage',
              value: 0,
            },
          ];
          break;
      }
    },
    handleDateRange(value) {
      const sorted = value.sort((a, b) => new Date(a) - new Date(b));
      this.discountForm.fromDate = sorted[0];
      this.discountForm.toDate = sorted[1];
    },
    open() {
      this.dialog = true;
    },
    cancel() {
      this.discountForm = {
        name: '',
        conditions: {
          apply_to_conditions: {
            key: 'all',
            value: [],
          },
          apply_on_conditions: {
            key: 'all',
            value: {
              type: 'percentage',
              value: 0,
            },
          },
        },
        is_active: true,
        fromTime: '',
        toTime: '',
        fromDate: '',
        toDate: '',
        mon: true,
        tue: true,
        wed: true,
        thu: true,
        fri: true,
        sat: true,
        sun: true,
      };
      this.fromTime = ['09', '00', '00'];
      this.toTime = ['19', '00', '00'];
      this.valid = true;
      this.fromDateToDate = [];
      this.dialog = false;
    },
    addApplyOnItem() {
      this.discountForm.conditions.apply_on_conditions.value.push({
        id: null,
        type: 'percentage',
        value: 0,
      });
    },
    deleteApplyOnItem(index) {
      this.discountForm.conditions.apply_on_conditions.value.splice(index, 1);
    },
    async save() {
      this.discountForm.fromTime = this.fromTime.join(':');
      this.discountForm.toTime = this.toTime.join(':');
      this.setLoading(true);
      try {
        await this.createDiscount(this.discountForm);
        this.$emit('success', true);
        this.cancel();
      } catch (err) {
        console.log(err);
      }
      this.setLoading(false);
    },
  },
};
</script>
