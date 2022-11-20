<template>
  <v-form
    ref="addEmployeeForm"
    v-model="valid"
    lazy-validation
    @keyup.native.enter="formSubmit()"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
        :label="$t('addNewEmployeeForm.username')"
        v-model="username" required />
      </v-col>
      <v-col cols="12">
        <v-text-field
          :label="$t('addNewEmployeeForm.password')"
          v-model="password"
          type="password"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          :label="$t('addNewEmployeeForm.confirm_password')"
          type="password"
          v-model="passwordConfirm"
          :rules="passwordConfirmRules"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          :label="$t('addNewEmployeeForm.name')"
          v-model="name"
          :rules="nameRules"
          required
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          ref="phoneInput"
          :label="$t('addNewEmployeeForm.phone')"
          :error="phoneError"
          :error-messages="phoneErrorMessages"
          v-model="phone"
          :rules="phoneRules"
          @input="clearPhoneError"
          required
        />
      </v-col>
      <v-col cols="6">
        <v-btn-toggle tile class="d-flex" v-model="sex" mandatory>
          <v-btn icon width="50%">
            <v-icon>mdi-gender-male</v-icon>
          </v-btn>
          <v-btn icon width="50%">
            <v-icon>mdi-gender-female</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn color="blue darken-1" text @click="closeDialog()">
       {{$t('addNewEmployeeForm.close')}}
      </v-btn>
      <v-btn color="blue darken-1" dark @click="formSubmit()">
        {{$t('addNewEmployeeForm.add')}}
      </v-btn>
    </div>
  </v-form>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'AddNewEmployeeForm',
  data() {
    return {
      valid: false,
      username: '',
      name: '',
      password: '',
      passwordConfirm: '',
      phone: '',
      phoneError: false,
      phoneErrorMessages: [],
      nameRules: [(v) => !!v || this.$t('addNewEmployeeForm.name_required')],
      passwordConfirmRules: [
        (v) => !!v || this.$t('addNewEmployeeForm.password_required'),
        (v) => v === this.password || this.$t('addNewEmployeeForm.confirm_password_required'),
      ],
      phoneRules: [
        (v) => !!v || this.$t('addNewEmployeeForm.phone_invalid'),
        (v) => /^\+?[0-9]{3}-?[0-9]{6,12}$/.test(v) || this.$t('addNewEmployeeForm.phone_exist'),
      ],
      sex: 1,
    };
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    clearPhoneError() {
      this.phoneError = false;
      this.phoneErrorMessages = [];
    },
    async formSubmit() {
      const validateResult = this.$refs.addEmployeeForm.validate();
      if (validateResult === true) {
        try {
          const params = {
            username: this.username,
            name: this.name,
            password: this.password,
            phone: this.phone,
            // TODO: maybe implement select list for role ID
            role_id: 2,
            gender: this.sex === 0 ? 'male' : 'female',
          };
          const createEmployeeRequest = await privateAxios.post(
            process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEE_LIST,
            params,
          );
          if (createEmployeeRequest.data.IsSuccess) {
            this.$refs.addEmployeeForm.reset();
            this.$emit('submitSuccess');
          }
        } catch (error) {
          if (error.response.data.Message === 'PHONE_EXIST') {
            this.phoneError = true;
            this.phoneErrorMessages.push(this.$t('addNewEmployeeForm.phone_exist'));
          } else {
            this.phoneError = true;
            this.phoneErrorMessages.push(error.message);
          }
        }
      }
    },
  },
};
</script>
<style></style>
