<template>
  <div class="intake-item-review-wrapper">
    <v-card-actions class="pa-0">
      <span class="grey--text text--darken-2 font-weight-light text-caption"
        >Dịch vụ</span
      >
      <v-rating
        :value="review.service_point"
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
        readonly
        x-small
      ></v-rating>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <span class="grey--text text--darken-2 font-weight-light text-caption"
        >Tay nghề</span
      >
      <v-rating
        :value="review.skill"
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
        readonly
        x-small
      ></v-rating>
    </v-card-actions>
    <v-card-actions class="pa-0">
      <span class="grey--text text--darken-2 font-weight-light text-caption"
        >Thái Độ</span
      >
      <v-rating
        :value="review.attitude"
        color="yellow darken-3"
        background-color="grey darken-1"
        empty-icon="$ratingFull"
        readonly
        x-small
      ></v-rating>
    </v-card-actions>
  </div>
</template>
<script>
export default {
  props: ['review'],
};
</script>
<style lang="scss" scoped>
.intake-item-review-wrapper {
  .text-caption {
    min-width: 55px;
  }
}
</style>
