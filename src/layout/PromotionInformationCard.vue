<template>
  <v-card class="mx-auto mb-3" elevation="0" :color="'grey lighten-3'" @mouseover="isHover = true" @mouseleave="isHover = false">
    <v-list-item three-line>
      <v-list-item-content class="pb-0">
        <div class="d-flex align-start justify-space-between">
          <div class="d-flex flex-column">
            <v-list-item-subtitle class="mb-2"> Gói Ưu Đãi </v-list-item-subtitle>
            <v-list-item-title class="headline">
              {{ dataSource.name }}
            </v-list-item-title>
          </div>

          <div>
            {{ $t('orderInfomartionCard.price') }}:
            <span class="info--text">{{ dataSource.price | currency }}</span>
          </div>
        </div>
        <template v-for="(order, index) in dataSource.orders">
          <v-card :key="`order_${index}`" class="mx-auto mb-3" elevation="0" :color="'grey lighten-3'" @mouseover="isHover = true" @mouseleave="isHover = false">
            <v-list-item three-line>
              <v-list-item-content class="pb-0">
                <div class="overline mb-2 d-sm-flex justify-space-between">
                  <div>ORDER{{ order.id }}</div>
                </div>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-list-item-subtitle class="mb-2">
                      {{ $t('orderInfomartionCard.service') }}
                    </v-list-item-subtitle>
                    <v-list-item-subtitle class="mt-2 title">
                      {{ variantName(order.variant) }}
                    </v-list-item-subtitle>
                  </v-col>

                  <v-col cols="12" md="6" class="d-md-flex align-end justify-center flex-column">
                    <v-list-item-subtitle class="mb-2">
                      {{ $t('orderInfomartionCard.assigned_employee') }}
                    </v-list-item-subtitle>
                    <router-link
                      :to="{
                        name: 'EmployeeDetail',
                        params: { employeeid: order.employee.id },
                      }"
                    >
                      <v-list-item-title class="headline mb-3">{{ order.employee.name }}</v-list-item-title>
                    </router-link>
                  </v-col>
                </v-row>
                <div class="mb-3">
                  <v-list-item-subtitle class="mb-2"> Ngày tạo đơn </v-list-item-subtitle>
                  <v-list-item-title class="headline">
                    {{ order.created_at | formatDate(true) }}
                  </v-list-item-title>
                </div>
                <template v-if="order.note.note || order.note.text">
                  <v-list-item-subtitle class="mb-2"> Ghi chú dịch vụ </v-list-item-subtitle>
                  <v-card outlined class="mb-4" light>
                    <v-card-subtitle class="pa-3">
                      <template v-if="order.note.text">
                        <h3>Chi tiết</h3>
                        <pre>{{ order.note.text }}</pre>
                      </template>
                      <v-divider class="my-3" v-if="order.note.note && order.note.text" />
                      <template v-if="order.note.type === 'facial'">
                        <h3 class="mb-1">Độ ẩm / Độ dầu:</h3>
                        <v-row class="ma-0">
                          <v-col class="pa-0" cols="6" sm="3" v-for="(value, key) in order.note.note" :key="key">
                            <h4 :class="`${key}--text`">{{ $t(key) }}</h4>
                            <p class="mb-1">
                              Độ ẩm:
                              <strong>{{ order.note.note[key].humidity }} %</strong>
                            </p>
                            <p>
                              Độ dầu:
                              <strong>{{ order.note.note[key].oil }} %</strong>
                            </p>
                          </v-col>
                        </v-row>
                      </template>
                      <template v-if="order.note.type === 'body'">
                        <h3>Các vùng đau nhức:</h3>
                        <div class="d-flex flex-wrap">
                          <div class="part" v-for="part in order.note.note" :key="part">
                            {{ $t(part) }}
                          </div>
                        </div>
                      </template>
                      <template v-if="note.type === 'other'">
                        <span style="white-space: pre">{{ order.note.note }}</span>
                      </template>
                    </v-card-subtitle>
                  </v-card>
                </template>
                <div class="row" v-if="order.review">
                  <v-col cols="12" sm="4">
                    <h4 class="mb-3">Service Point</h4>
                    <v-rating readonly length="5" size="16" :value="order.review.service_point"></v-rating>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <h4 class="mb-3">Attitude Point</h4>
                    <v-rating readonly length="5" size="16" :value="order.review.attitude"></v-rating>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <h4 class="mb-3">Skill Point</h4>
                    <v-rating readonly length="5" size="16" :value="order.review.skill"></v-rating>
                  </v-col>
                </div>
              </v-list-item-content>
            </v-list-item>
            <v-card-actions class="px-4 pb-4" v-if="renderSlotStatus">
              <slot></slot>
            </v-card-actions>
          </v-card>
        </template>
        <!-- <div class="mb-3">
          <v-list-item-subtitle class="mb-2">
              Ngày tạo đơn
            </v-list-item-subtitle>
            <v-list-item-title class="headline">
              {{ dataSource.created_at | formatDate(true) }}
            </v-list-item-title>
        </div>
        <template v-if="note.note || note.text">
          <v-list-item-subtitle class="mb-2">
            Ghi chú dịch vụ
          </v-list-item-subtitle>
          <v-card outlined class="mb-4" light>
            <v-card-subtitle class="pa-3">
              <template v-if="note.text">
                <h3>Chi tiết</h3>
                <pre>{{ note.text }}</pre>
              </template>
              <v-divider class="my-3" v-if="note.note && note.text" />
              <template v-if="note.type === 'facial'">
                <h3 class="mb-1">Độ ẩm / Độ dầu:</h3>
                <v-row class="ma-0">
                  <v-col
                    class="pa-0"
                    cols="6"
                    sm="3"
                    v-for="(value, key) in note.note"
                    :key="key"
                  >
                    <h4 :class="`${key}--text`">{{ $t(key) }}</h4>
                    <p class="mb-1">
                      Độ ẩm: <strong>{{ note.note[key].humidity }} %</strong>
                    </p>
                    <p>
                      Độ dầu: <strong>{{ note.note[key].oil }} %</strong>
                    </p>
                  </v-col>
                </v-row>
              </template>
              <template v-if="note.type === 'body'">
                <h3>Các vùng đau nhức:</h3>
                <div class="d-flex flex-wrap">
                  <div class="part" v-for="part in note.note" :key="part">
                    {{ $t(part) }}
                  </div>
                </div>
              </template>
              <template v-if="note.type === 'other'">
                <span style="white-space: pre">{{ note.note }}</span>
              </template>
            </v-card-subtitle>
          </v-card>
        </template>
        <div class="row" v-if="dataSource.review">
          <v-col cols="12" sm="4">
            <h4 class="mb-3">Service Point</h4>
            <v-rating
              readonly
              length="5"
              size="16"
              :value="dataSource.review.service_point"
            ></v-rating>
          </v-col>
          <v-col cols="12" sm="4">
            <h4 class="mb-3">Attitude Point</h4>
            <v-rating
              readonly
              length="5"
              size="16"
              :value="dataSource.review.attitude"
            ></v-rating>
          </v-col>
          <v-col cols="12" sm="4">
            <h4 class="mb-3">Skill Point</h4>
            <v-rating
              readonly
              length="5"
              size="16"
              :value="dataSource.review.skill"
            ></v-rating>
          </v-col>
        </div>
        <div class="mb-4" v-if="dataSource.combo_id">
          <v-list-item-subtitle class="mb-2">
            Chữ ký xác nhận của khách hàng
          </v-list-item-subtitle>
          <v-card outlined height="200px" width="200px">
            <img
              :src="note.signature"
              height="200px"
              width="200px"
              alt="saved signature"
              style="margin-left: auto; margin-right: auto"
            />
          </v-card>
        </div> -->
      </v-list-item-content>
    </v-list-item>
    <v-card-actions class="px-4 pb-4" v-if="renderSlotStatus">
      <slot></slot>
    </v-card-actions>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'PromotionInformationCard',
  props: {
    dataSource: {
      type: Object,
      required: true,
      default: null,
    },
    editable: {
      type: Boolean,
      require: true,
      default: false,
    },
    paymentMethod: {
      default: 'cash',
    },
  },
  data() {
    return {
      employeeId: 0,
      isHover: false,
      note: {},
    };
  },
  methods: {
    changeHandle() {
      if (this.employeeId !== this.dataSource.employee_id) {
        this.$emit('onChange', true);
      } else {
        this.$emit('onChange', false);
      }
    },
  },
  computed: {
    ...mapState('employee', ['employees']),
    renderSlotStatus() {
      return Object.keys(this.$slots).length > 0;
    },
  },
  mounted() {
    this.employeeId = this.dataSource.employee_id;
    // this.note = JSON.parse(this.dataSource.note);
  },
};
</script>
<style lang="scss">
.part {
  border-radius: 12px;
  font-size: 12px;
  background: #ff9f9f;
  height: 24px;
  border-color: rgba(0, 0, 0, 0.12);
  color: rgba(0, 0, 0, 0.87);
  padding: 0 12px;
  margin: 4px;
  font-weight: 600;
}
</style>
