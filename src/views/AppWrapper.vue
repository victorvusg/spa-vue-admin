<template>
  <div v-if="isFetched">
    <router-view name="navbar"></router-view>
    <v-main class="grey lighten-5">
      <router-view />
    </v-main>
  </div>
</template>

<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'AppWrapper',
  data() {
    return {
      isFetched: false,
    };
  },
  methods: {
    async getPaymentMethods() {
      try {
        this.isFetched = false;
        this.setLoading(true);
        const response = await privateAxios.get('api/v1/payment-method');
        if (response.status === 200) {
          this.dispatch('app/SET_PAYMENT_METHODS', response.data.Data || []);
          this.isFetched = true;
        }
        this.setLoading(false);
      } catch (err) {
        this.setLoading(false);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'GetPaymentMethods Failed !',
        });
      }
    },
  },
  async created() {
    await this.getPaymentMethods();
  },
};
</script>
