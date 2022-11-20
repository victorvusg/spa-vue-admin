<template>
  <v-form
    ref="addCustomerForm"
    v-model="valid"
    lazy-validation
    @keyup.native.enter="formSubmit()"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          :label="$t('addNewCustomerForm.name')"
          v-model="name"
          :rules="nameRules"
          required
        />
      </v-col>
      <v-col cols="6">
        <v-text-field
          ref="phoneInput"
          :label="$t('addNewCustomerForm.phone')"
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
        {{$t('addNewCustomerForm.close')}}
      </v-btn>
      <v-btn color="blue darken-1" dark @click="formSubmit()">
        {{$t('addNewCustomerForm.add')}}
      </v-btn>
    </div>
  </v-form>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'AddNewCustomerForm',
  data() {
    return {
      valid: false,
      name: '',
      email: '',
      phone: '',
      phoneError: false,
      phoneErrorMessages: [],
      nameRules: [(v) => !!v || this.$t('addNewCustomerForm.name_required')],
      phoneRules: [
        (v) => !!v || this.$t('addNewCustomerForm.phone_required'),
        (v) => /^\+?[0-9]{3}-?[0-9]{6,12}$/.test(v) || this.$t('addNewCustomerForm.phone_invalid'),
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
      const validateResult = this.$refs.addCustomerForm.validate();
      if (validateResult === true) {
        try {
          const params = {
            name: this.name,
            email: this.email,
            phone: this.phone,
            gender: this.sex === 0 ? 'male' : 'female',
          };
          const createCustomerRequest = await privateAxios.post(
            process.env.VUE_APP_CLIENT_API_ENDPOINT_CUSTOMER_LIST,
            params,
          );
          if (createCustomerRequest.data.IsSuccess) {
            this.$refs.addCustomerForm.reset();
            this.$emit('submitSuccess');
          }
        } catch (error) {
          if (error.response.data.Message === 'PHONE_EXIST') {
            this.phoneError = true;
            this.phoneErrorMessages.push(this.$t('addNewCustomerForm.phone_exist'));
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
