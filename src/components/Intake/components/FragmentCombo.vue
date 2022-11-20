<template>
  <v-card outlined>
    <v-card-text>
      <div class="mb-4 d-flex align-center justify-space-between">
        <div class="overline">
          COMBO{{ comboData.id}}
        </div>
        <div class="status success--text text-uppercase">
          valid
        </div>
      </div>

      <div class="d-flex align-center justify-space-between">
        <div>
          <h3 class="">
            {{ comboData.service.name }}
          </h3>
          <p class="mb-0">
            Expire Date: {{ comboData.expiry_date | formatDate }}
          </p>
        </div>
        <div>
          <span class="error--text">{{ comboData.number_used }}</span> /
          <span class="success--text">{{ comboData.amount }}</span>
        </div>
      </div>
    </v-card-text>
    <v-card-actions class="px-4 justify-end">
      <v-btn
        small
        outlined
        depressed
        color="success"
        @click="addToIntake"
        light
      >
        <v-icon small left>mdi-plus</v-icon>
        Add to Intake
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'FragmentCombo',
  props: {
    comboData: {
      required: true,
      type: Object,
      default: null,
    },
  },
  methods: {
    checkValid() {
      return true;
    },
    addToIntake() {
      this.$emit('addToIntake', { type: 'combo', data: this.comboData });
    },
  },
};
</script>
