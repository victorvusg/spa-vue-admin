<template>
  <v-card :class="{ 'card-error': !validStatus }" outlined>
    <v-card-text>
      <div class="overline text-uppercase d-flex justify-space-between">
        <span
          v-bind:class="{
            'success--text': dataSource.displayData.type === 'service',
            'error--text': dataSource.displayData.type === 'combo',
          }"
          >{{ dataSource.displayData.type }}</span
        >
        <v-btn small icon color="error" @click="removeTicket">
          <v-icon small>mdi-backspace</v-icon>
        </v-btn>
      </div>
      <div class="mb-4">
        {{ dataSource.displayData.name }}
      </div>
      <v-autocomplete
        :items="employeesData"
        clearable
        label="Assign employee for this ticket"
        v-model="dataSource.employee_id"
        :rules="employeeIdRules"
        item-text="name"
        item-value="id"
      >
      </v-autocomplete>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'FragmentIntakeTicket',
  props: {
    employeesData: {
      type: Array,
      required: true,
      default: [],
    },
    dataSource: {
      type: Object,
      required: true,
      default: null,
    },
    valid: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  data() {
    return {
      employeeIdRules: [(v) => !!v || 'employee id required'],
      validStatus: this.valid,
    };
  },
  methods: {
    removeTicket() {
      this.$emit('removeTicket');
    },
  },
  watch: {
    'dataSource.employee_id': function () {
      this.$emit('validChanged');
      this.validStatus = true;
    },
  },
};
</script>
<style scoped lang="scss">
.card-error {
  border-color: red !important;
}
</style>
