<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
    persistent
    content-class="admin-dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed color="success" small text v-bind="attrs" v-on="on">
        Kích Hoạt
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex align-center justify-center">
        <span class="headline font-weight-bold">
          {{ $t('combos.confirm_modal_combo_headline') }}</span
        >
      </v-card-title>
      <v-card-text class="px-4 body-1 text-center">
        {{ $t('combos.confirm_modal_combo_content') }}
      </v-card-text>
      <v-card-actions
        class="d-flex align-center justify-space-between px-4 pb-4"
      >
        <v-btn
          color="error"
          text
          rounded
          dark
          depressed
          @click="dialog = false"
        >
          Thoát
        </v-btn>
        <v-btn color="error" dark depressed @click="approve" rounded>
          Kích hoạt
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'ApprovePackageDialog',
  props: {
    pack: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    async approve() {
      this.setLoading(true);
      try {
        const response = await privateAxios.put(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST}/${this.pack.id}`,
          {
            is_valid: this.pack.is_valid ? 0 : 1,
          },
        );
        this.$emit('approved-success', { item: response.data.Data });
        this.setLoading(false);
        this.dialog = false;
      } catch (error) {
        console.log(error);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Có lỗi xảy ra !',
        });
        this.setLoading(false);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
