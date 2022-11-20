<template>
  <v-dialog v-model="status" max-width="480" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ this.headline }}</span>
      </v-card-title>
      <v-card-text>
        {{ this.content }}
      </v-card-text>
      <v-card-actions>
        <v-btn class="ml-auto" text @click="closeDialog()"> ĐÓNG </v-btn>
        <v-btn color="error" dark depressed @click="formSubmit()">
          ĐỒNG Ý
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'IntakeConfirmationDialog',
  props: {
    status: {
      type: Boolean,
      default: 'false',
      require: false,
    },
    headline: {
      type: String,
      default: 'headline',
      require: true,
    },
    content: {
      type: String,
      default: 'Confirm content',
      require: true,
    },
    dataSource: {
      type: Object,
      default: null,
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    formSubmit() {
      this.$emit('formConfirmed', { item: this.dataSource });
    },
  },
};
</script>
<style lang="scss" scoped></style>
