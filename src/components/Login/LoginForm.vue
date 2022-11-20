<template>
  <v-form
    ref="loginForm"
    v-model="valid"
    lazy-validation
    class="login-form"
    @keyup.native.enter="login"
  >
    <h3>{{ $t('login_form.xin_chao') }}</h3>
    <v-text-field
      v-model="name"
      name="name"
      :label="$t('login_form.ten_dang_nhap')"
      required
      :rules="nameRules"
    />

    <v-text-field
      v-model="password"
      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
      :type="show1 ? 'text' : 'password'"
      name="password"
      :label="$t('login_form.mat_khau')"
      counter
      required
      :rules="passwordRules"
      @click:append="show1 = !show1"
    />

    <v-btn
      :disabled="!valid"
      color="success"
      class="mt-4 rounded-0"
      @click="login()"
    >
      {{ $t('login_form.dang_nhap') }}
    </v-btn>
  </v-form>
</template>
<script>
import { publicAxios, privateAxios } from '@/api/api';
import { mapState } from 'vuex';

export default {
  name: 'LoginForm',
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [(v) => !!v || this.$t('login_form.username_required')],
      password: '',
      passwordRules: [(v) => !!v || this.$t('login_form.password_required')],
      show1: false,
    };
  },
  computed: {
    ...mapState('app', ['isLoading']),
  },
  created() {
    this.dispatch('app/setShowNav', false);
  },
  methods: {
    async login() {
      this.$refs.loginForm.validate();
      if (this.valid) {
        try {
          this.setLoading(true);
          const payload = {
            grant_type: 'password',
            client_id: process.env.VUE_APP_CLIENT_ID,
            client_secret: process.env.VUE_APP_CLIENT_SECRET,
            scope: '*',
            username: this.name,
            password: this.password,
          };
          const loginResultRequest = await publicAxios.post(
            process.env.VUE_APP_CLIENT_API_ENDPOINT_AUTH_TOKEN,
            payload,
          );
          const loginResult = loginResultRequest.data;
          if (loginResult.access_token) {
            // store token to local storage
            localStorage.setItem(
              'jwt-token',
              JSON.stringify(loginResult.access_token),
            );
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

            this.$nextTick(() => {
              this.dispatch('app/setShowNav', true);
              this.$router.push({ name: 'Intake' });
              this.setLoading(false);
            });
          } else {
            // TODO: error message output
          }
        } catch (error) {
          // TODO: handling error
          console.log(error);
          this.setLoading(false);
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.login-form {
  width: 400px;
}
</style>
