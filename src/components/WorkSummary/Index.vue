<template>
  <div>
    <v-dialog
      ref="dialog"
      v-model="modal"
      :return-value="dates"
      persistent
      width="290px"
    >
      <template v-slot:activator="{ on, attrs }">
        <h2
          v-ripple
          v-bind="attrs"
          v-on="on"
          class="primary--text d-flex align-center"
        >
          {{ dates.length > 1 ? dateString : 'Chọn ngày' }}
          <v-icon class="ml-2" size="28"> mdi-calendar</v-icon>
        </h2>
      </template>
      <v-date-picker
        v-model="dates"
        range
        locale="vn"
        :max="
          new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
            .toISOString()
            .substr(0, 10)
        "
      >
        <v-spacer></v-spacer>
        <v-btn text color="primary" @click="modal = false"> Cancel </v-btn>
        <v-btn
          text
          color="primary"
          :disabled="dates.length < 2"
          @click="saveDate(dates)"
        >
          OK
        </v-btn>
      </v-date-picker>
    </v-dialog>
    <!-- List thong ke -->
    <ServiceRanking :dateRange="dateRange" />
  </div>
</template>
<script>
import moment from 'moment';
import ServiceRanking from './ServiceRanking';

export default {
  name: 'WorkSummaryIndex',
  components: {
    ServiceRanking,
  },
  data() {
    return {
      dates: [],
      dateRange: [],
      modal: false,
    };
  },
  computed: {
    dateString() {
      if (this.dates.length > 1) {
        if (this.dates[0] === this.dates[1]) {
          return `Ngày ${moment(this.dates[0]).format('DD/MM/YYYY')}`;
        }
        const fromDate = moment(this.dates[0]).format('DD/MM/YYYY');
        const toDate = moment(this.dates[1]).format('DD/MM/YYYY');
        return `${fromDate} đến ${toDate}`;
      }
      return '';
    },
  },
  methods: {
    saveDate(dates) {
      let dateArray = dates;
      if (this.dates.length > 1 && dates[0] !== dates[1]) {
        dateArray = this.dates.sort((a, b) => new Date(a) - new Date(b));
      }
      this.$nextTick(async () => {
        this.dateRange = dateArray;
        this.$refs.dialog.save(dateArray);
      });
    },
  },
  async created() {
    const start = moment.utc().local().startOf('month').format('YYYY-MM-DD');
    const end = moment.utc().local().endOf('month').format('YYYY-MM-DD');
    this.dates = [start, end];
    this.dateRange = this.dates;
  },
};
</script>
