<template>
  <v-dialog v-model="status" max-width="480" persistent>
    <v-card>
      <v-card-title>
        <span class="headline">{{ this.headline }}</span>
      </v-card-title>
      <v-card-text v-if="this.contentType === 'text'">
        {{ this.content }}
      </v-card-text>
      <v-card-text v-else>
        <component
          :is="this.content"
          :dataSource="this.dataSource"
          @discountTicketChange="handleTicketChange"
          @discountTypeChange="handleDiscountTypeChanges"
          @discountInfoUpdate="handleDiscountInfoUpdate"
        ></component>
      </v-card-text>
      <v-card-actions>
        <v-btn
          class="ml-auto"
          text
          @click="closeDialog()"
        >
          Đóng
        </v-btn>
        <v-btn color="error" dark depressed @click="formSubmit" :disabled="!valid">
          Đồng ý
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import discountControl from '@/components/Intake/components/DiscountControl';

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
    contentType: {
      type: String,
      default: 'text',
      required: false,
    },
    dataSource: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      loading: false,
      ticket: 0,
      valid: false,
    };
  },
  components: {
    discountControl,
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    formSubmit() {
      this.loading = true;
      this.$emit('formConfirmed', { ticket: this.ticket });
    },
    handleTicketChange(ticket) {
      this.ticket = ticket;
    },
    handleDiscountTypeChanges(value) {
      if (value === 'tickets') this.valid = true;
      if (value !== 'tickets') this.valid = false;
    },
    handleDiscountInfoUpdate(info) {
      if (info.type === 'tickets') this.valid = true;
      if (info.type !== 'tickets') this.valid = info.valid;
    },
  },
  mounted() {
  },
};
</script>
<style lang="scss" scoped></style>
