<template>
    <v-dialog v-model="dialog" persistent max-width="290">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :color="$t(`change_payment.button_color_${paymentTypeValue}`)"
          v-bind="attrs"
          block
          v-on="on"
        >
          {{ $t(`change_payment.button_text_${paymentTypeValue}`) }}
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="headline"> Thay Đổi Thanh Toán </v-card-title>
        <v-card-text>
          Bạn có chắc muốn đổi sang hình thức
          <strong
            >thanh toán bằng
            {{ $t(`change_payment.to_${paymentTypeValue}`) }}</strong
          >.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="error darken-1" text @click="dialog = false">
            Hủy
          </v-btn>
          <v-btn color="green darken-1" text @click="changePaymentType()">
            Đồng Ý
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'ChangePaymentTypeDialog',
  props: ['paymentType', 'intakeId'],
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    paymentTypeValue() {
      return this.paymentType !== 'cash' ? 'cash' : 'credit';
    },
  },
  methods: {
    async changePaymentType() {
      try {
        this.setLoading(true);
        const response = await privateAxios.put(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST}/${this.intakeId}`,
          {
            payment_method_id: this.paymentTypeValue,
          },
        );
        if (response.status === 200) {
          this.setLoading(false);
          this.$emit('update-success');
        }
        this.dialog = false;
      } catch (error) {
        console.log(error);
        this.setLoading(false);
        throw error;
      }
    },
  },
};
</script>
