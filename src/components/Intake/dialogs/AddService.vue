<template>
  <v-dialog
    v-model="status"
    persistent
    width="1200"
  >
    <v-card>
      <v-card-title>
        <span class="headline">Add Service to Intake</span>
      </v-card-title>
      <v-card-text>
        <AddServiceForm
        :customer="customer"
        :employees="employees"
        @closeDialog="handleCloseDialog()"
        @submitSuccess="handleFormSubmitSuccess"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import AddServiceForm from '@/components/Intake/forms/AddService';

export default {
  name: 'AddIntakeDialog',
  components: {
    AddServiceForm,
  },
  props: {
    status: {
      type: Boolean,
      default: false,
      require: true,
    },
    customer: {
      type: Object,
      default: null,
      require: true,
    },
    employees: {
      type: Array,
      default: null,
      require: true,
    },
    contentComponent: {
      type: String,
      default: null,
      require: true,
    },
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeDialog');
    },
    handleFormSubmitSuccess(tickets) {
      this.$emit('formConfirmed', tickets);
    },
  },
  mounted() {
  },
};
</script>
<style></style>
