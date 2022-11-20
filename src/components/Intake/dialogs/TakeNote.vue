<template>
  <v-dialog v-model="status" max-width="480" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">Take not for this order</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <FrontBodySVG></FrontBodySVG>
          </v-col>
          <v-col cols="6">
            <BackBodySVG></BackBodySVG>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="ml-auto"
          color="blue darken-1"
          text
          @click="closeDialog()"
        >
          Close
        </v-btn>
        <v-btn color="blue darken-1" dark depressed @click="formSubmit">
          Save note
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import FrontBodySVG from '@/assets/svg/body-front.svg';
import BackBodySVG from '@/assets/svg/body-back.svg';

export default {
  name: 'TakeNodeDialog',
  components: {
    FrontBodySVG,
    BackBodySVG,
  },
  props: {
    status: { type: Boolean, default: false, required: true },
    order: { type: Object, default: null, required: true },
  },
  data() {
    return {
      path: null,
    };
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    formSubmit() {
      this.$emit('formConfirmed');
    },
    handlePathClick(event) {
      const { target } = event;
      const groupEl = target.parentElement;
      groupEl.classList.toggle('highlight');
    },
  },
  created() {
    this.$nextTick(() => {
      this.path = document.querySelectorAll('.section path');
      this.path.forEach((item) => {
        item.addEventListener('click', this.handlePathClick);
      });
    });
  },
  beforeDestroy() {
    this.path.forEach((item) => {
      item.removeEventListener('click', this.handlePathClick);
    });
  },
};
</script>
<style lang="scss">
.section {
  pointer-events: fill;
  &:hover {
    cursor: pointer;
    fill: red;
  }

  &.highlight {
    fill: red;
  }
}
</style>
