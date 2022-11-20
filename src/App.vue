<template>
  <v-app>
    <Toast />
    <CoreDialog />
    <router-view v-if="isRouteable"></router-view>
    <v-overlay :value="isLoading" class="master-overlay" z-index="9999999">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-app>
</template>

<script>
import { mapState } from 'vuex';
import { privateAxios } from '@/api/api';
import CoreDialog from '@/core/components/CoreDialog';
import Toast from '@/core/components/Toast';

export default {
  name: 'App',
  data() {
    return {
      isRouteable: false,
    };
  },
  components: { CoreDialog, Toast },
  computed: {
    ...mapState('app', ['isLoading']),
  },
  async created() {
    try {
      this.isRouteable = false;
      this.setLoading(true);
      // Get Logged User Info
      const response = await privateAxios.get(
        process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEEINFO,
      );
      if (!response.data.IsSuccess) {
        return;
      }
      // Store logged User Info to Local Storage
      localStorage.setItem(
        'user',
        JSON.stringify({
          id: response.data.Data.id,
          name: response.data.Data.name,
          role: response.data.Data.role.name,
        }),
      );
    } catch (err) {
      console.log(err);
      localStorage.removeItem('jwt-token');
      localStorage.removeItem('user');
      this.$router.push({ name: 'Login' });
    } finally {
      this.isRouteable = true;
      this.setLoading(false);
    }
  },
};
</script>
<style lang="scss">
.c-container {
  position: relative;
  width: 100vw;
  min-height: 100%;
}
</style>
