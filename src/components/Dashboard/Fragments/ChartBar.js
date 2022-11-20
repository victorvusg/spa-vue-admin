import { HorizontalBar } from 'vue-chartjs';

export default {
  extends: HorizontalBar,
  name: 'ChartBar',
  props: {
    dataSource: {
      type: Object,
    },
  },
  data: () => ({
    options: {
      responsive: true,
      type: 'horizontalBar',
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            ticks: {
              beginAtZero: true,
              stepSize: 1,
            },
          },
        ],
      },
    },
  }),
  computed: {
    computedDataSets() {
      return this.dataSource;
    },
  },
  mounted() {
    this.renderChart(this.computedDataSets, this.options);
  },
};
