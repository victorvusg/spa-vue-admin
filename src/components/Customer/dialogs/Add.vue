<template>
  <v-dialog
    v-model="status"
    persistent
    max-width="600px"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{$t('addNewCustomerDialog.title')}}</span>
      </v-card-title>
      <v-card-text>
        <AddNewCustomerForm
        @closeDialog="handleCloseDialog()"
        @submitSuccess="handleFormSubmitSuccess()"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import AddNewCustomerForm from '@/components/Customer/forms/Add';

export default {
  name: 'AddNewCustomerDialog',
  components: {
    AddNewCustomerForm,
  },
  props: {
    status: {
      type: Boolean,
      default: false,
      require: true,
    },
  },
  methods: {
    handleCloseDialog() {
      this.$emit('closeDialog');
    },
    handleFormSubmitSuccess() {
      this.$emit('submitSuccess');
    },
  },
};
</script>
<style></style>
