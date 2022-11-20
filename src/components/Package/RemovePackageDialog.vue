<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
    persistent
    content-class="admin-dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn depressed text color="error" small v-bind="attrs" v-on="on">
        Hủy
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex align-center justify-center">
        <span class="headline font-weight-bold"> Hủy Gói</span>
      </v-card-title>
      <v-card-text class="px-4 body-1 text-center">
        Bạn có chắc muốn hủy Gói này ?
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
        <v-btn color="error" dark depressed @click="remove" rounded>
          Huỷ
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'RemovePackageDialog',
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
    async remove() {
      this.setLoading(true);
      try {
        await privateAxios.delete(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST}/${this.pack.id}`,
        );
        this.$emit('remove-success');
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
