<template>
  <v-dialog
    v-model="status"
    persistent
    width="1200"
  >
    <v-card>
      <v-card-title>
        <span class="headline">{{$t('addIntakeDialog.headline')}}</span>
      </v-card-title>
      <v-card-text>
        <AddIntakeForm
        @closeDialog="handleCloseDialog()"
        @submitSuccess="handleFormSubmitSuccess()"/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import AddIntakeForm from '@/components/Intake/forms/Add';

export default {
  name: 'AddIntakeDialog',
  components: {
    AddIntakeForm,
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
