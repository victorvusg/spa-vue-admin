<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" persistent max-width="300">
      <template v-slot:activator="{ on, attrs }">
        <v-btn color="primary" dark v-bind="attrs" v-on="on">
          Đổi Mật Khẩu
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5 text-center">
          Thay đổi mật khẩu
        </v-card-title>
        <v-card-text>
          <v-text-field
            :type="showPassword ? 'text' : 'password'"
            v-model="newPassword"
            label="Mật khẩu mới"
            hide-details
          ></v-text-field>
          <v-checkbox v-model="showPassword" label="Hiện mật khẩu"></v-checkbox>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="close"> Đóng </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="save"
            :disabled="!newPassword"
          >
            Lưu
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<script>
import { privateAxios } from '@/api/api';
// VUE_APP_CLIENT_API_ENDPOINT_ACCOUNT
export default {
  name: 'ChangePassword',
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      newPassword: '',
      showPassword: false,
    };
  },
  methods: {
    close() {
      this.dialog = false;
      this.newPassword = '';
    },
    async save() {
      this.dialog = false;
      this.setLoading(true);
      try {
        const response = await privateAxios.post(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_ACCOUNT}/${this.id}/change-password`,
          { newPassword: this.newPassword },
        );
        if (response.status !== 200) {
          this.dispatch('toast/openToast', {
            color: 'error',
            message: 'Đã có lỗi xảy ra.',
          });
        } else {
          this.dispatch('toast/openToast', {
            color: 'success',
            message: 'Đổi mật khẩu thành công',
          });
        }
      } catch (error) {
        console.log(error);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Đã có lỗi xảy ra.',
        });
      } finally {
        this.newPassword = '';
        this.setLoading(false);
      }
    },
  },
};
</script>
