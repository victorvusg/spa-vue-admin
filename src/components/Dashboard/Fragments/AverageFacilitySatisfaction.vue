<template>
  <v-card v-if="statistic">
    <v-card-title>
      <h5>Facility Satisfaction</h5>
    </v-card-title>
    <v-card-text>
      <div class="d-flex align-center">
        <v-rating
          :readonly="true"
          :dense="true"
          :value="(roundedPoint * 100) / 5"
          background-color="grey lighten-1"
          :color="roundedPoint > 3 ? 'green' : 'red'"
          class="pl-2"
        ></v-rating>
        <!-- <v-progress-circular
          class="mr-auto"
          :value="(roundedPoint * 100) / 5"
          :color="roundedPoint > 3 ? 'green' : 'red'"
        /> -->
        <div class="ml-auto">
          <h1 class="mb-0">
            <span class="success--text">{{ roundedPoint }}</span>
            / 5
          </h1>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>
<script>
import { mapState } from 'vuex';

export default {
  name: 'AverageFacilitySatisfaction',
  computed: {
    ...mapState('statistic', ['statistic']),
    roundedPoint() {
      return Math.round(this.statistic.facility);
    },
  },
};
</script>
