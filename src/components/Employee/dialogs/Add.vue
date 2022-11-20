<template>
  <v-dialog v-model="status" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="headline">{{$t('addNewEmployeeDialog.title')}}</span>
      </v-card-title>
      <v-card-text>
        <AddNewEmployeeForm
        @closeDialog="handleCloseDialog()"
        @submitSuccess="handleFormSubmitSuccess()"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import AddNewEmployeeForm from '@/components/Employee/forms/Add';

export default {
  name: 'AddNewEmployeeDialog',
  components: {
    AddNewEmployeeForm,
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
