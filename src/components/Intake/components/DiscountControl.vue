<template>
  <div>
    <v-form ref="discountForm" v-model="valid">
      <div>
        {{ this.$t('intake_detail.confirm') }}
      </div>

      <v-tabs v-model="tab" grow>
        <!-- <v-tab href="#tab-1" v-if="dataSource.points > 50"> Use Tickets </v-tab> -->
        <v-tab href="#tab-2"> Giảm theo số tiền </v-tab>
        <v-tab href="#tab-3"> Giảm theo % </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item value="tab-2" class="pt-3">
          <v-text-field
            label="Nhập số tiền muốn giảm"
            type="number"
            class="error-message-hidden"
            v-model="discountAmount"
            :rules="discountAmountRules"
            persistent-hint
          />
          <div
            v-if="parseInt(discountAmount)"
            class="font-weight-bold green--text mb-4"
          >
            Số tiền giảm trực tiếp: -{{ parseInt(discountAmount) | currency }}
          </div>
          <v-textarea
            v-if="parseInt(discountAmount)"
            name="input-7-1"
            :placeholder="
              discountReason ? null : 'Vui lòng nhập lý do giảm giá...'
            "
            class="error-message-hidden"
            v-model="discountReason"
            :rules="discountReasonRules"
            label="Lý do giảm"
            persistent-hint
          ></v-textarea>
        </v-tab-item>
        <v-tab-item value="tab-3" class="pt-3">
          <v-text-field
            label="Nhập số % muốn giảm"
            type="number"
            class="error-message-hidden"
            v-model="discountPercent"
            suffix="%"
            :rules="discountPercentRules"
            persistent-hint
          ></v-text-field>
          <div
            v-if="
              parseInt(discountPercent) &&
              discountPercent > 0 &&
              discountPercent <= 100
            "
            class="font-weight-bold green--text mb-4"
          >
            Số tiền giảm trực tiếp: -{{
              (parseInt(discountPercent, 10) * (dataSource.total / 100))
                | currency
            }}
            (-{{ discountPercent }}%)
          </div>
          <v-textarea
            v-if="parseInt(discountAmount) || parseInt(discountPercent)"
            name="input-7-1"
            class="error-message-hidden"
            :placeholder="
              discountReason ? null : 'Vui lòng nhập lý do giảm giá...'
            "
            v-model="discountReason"
            :rules="discountReasonRules"
            label="Lý do giảm"
          ></v-textarea>
        </v-tab-item>
      </v-tabs-items>
    </v-form>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'DiscountControlFragment',
  props: {
    dataSource: {
      type: Object,
      default: null,
      required: true,
    },
  },
  data() {
    return {
      discountPercent: 0,
      discountTypes: { 'tab-1': 'tickets', 'tab-2': 'special' },
      discountAmountRules: [
        (v) => parseInt(v, 10) >= 0 || 'Số tiền không hợp lệ',
      ],
      discountPercentRules: [
        (v) =>
          !v ||
          (parseInt(v, 10) >= 0 && parseInt(v, 10) <= 100) ||
          'Số % không hợp lệ',
      ],
      discountReasonRules: [(v) => !!v || 'Lý do giảm giá không được bỏ trống'],
      valid: true,
      tab: null,
    };
  },
  methods: {
    ...mapMutations('discount', ['updateDiscountInfo']),
  },
  mounted() {},
  computed: {
    ...mapState('app', ['appModal']),
    ...mapState('discount', ['discountInfo']),
    discountReason: {
      get() {
        return this.discountInfo.reason;
      },
      set(val) {
        this.updateDiscountInfo({ reason: val });
      },
    },
    discountAmount: {
      get() {
        return this.discountInfo.amount;
      },
      set(val) {
        this.updateDiscountInfo({ amount: parseInt(val, 10) });
      },
    },
    discountTickets: {
      get() {
        return this.discountInfo.tickets;
      },
      set(val) {
        this.updateDiscountInfo({ tickets: parseInt(val, 10) });
      },
    },
    ticketItems() {
      return Array.from(Array(this.ticketsAmount + 1).keys());
    },
    ticketsAmount() {
      const { points } = this.dataSource;
      return Math.trunc(parseInt(points, 10) / 50);
    },
    allowTickets() {
      const { total } = this.dataSource;
      return Math.ceil(parseInt(total, 10) / 200000);
    },
  },
  watch: {
    tab(newVal) {
      if (newVal === 'tab-2' || newVal === 'tab-3') {
        this.discountAmount = 0;
        this.discountPercent = 0;
        this.discountReason = '';
        this.updateDiscountInfo({ amount: 0 });
      }
    },
    discountPercent(val) {
      const res = parseInt(val, 10) * (this.dataSource.total / 100);
      console.log(res);
      this.updateDiscountInfo({ amount: res });
    },
    valid: {
      immediate: true,
      handler(val) {
        this.dispatch('coreDialog/openDialog', { agreeBtnDisable: !val });
      },
    },
  },
};
</script>
