<template>
  <v-form
    ref="addServiceCategoryForm"
    v-model="valid"
    lazy-validation
    @keyup.native.enter="formSubmit()"
  >
    <v-row>
      <v-col cols="12">
        <v-text-field
          :label="'category name'"
          :rules="nameRules"
          v-model="name"
          required
        />
      </v-col>
      <v-col cols="12">
        <v-text-field :label="'category desc'" v-model="description" />
      </v-col>
    </v-row>
    <div class="d-flex justify-end">
      <v-btn color="blue darken-1" text @click="closeDialog()">
        {{ $t('addNewServiceForm.close') }}
      </v-btn>
      <v-btn color="blue darken-1" dark depressed @click="formSubmit()">
        {{ $t('addNewServiceForm.add') }}
      </v-btn>
    </div>
  </v-form>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'AddNewServiceCategoryForm',
  data() {
    return {
      valid: false,
      name: '',
      nameRules: [(v) => !!v || 'Name is required'],
      description: '',
    };
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    async formSubmit() {
      this.$refs.addServiceCategoryForm.validate();
      if (this.valid) {
        try {
          const params = {
            name: this.name,
            descriptions: this.description,
          };
          const createServiceCategory = await privateAxios.post(
            process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_CATEGORY_LIST,
            params,
          );
          if (createServiceCategory.data.IsSuccess) {
            this.$refs.addServiceCategoryForm.reset();
            this.$emit('submitSuccess');
          }
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
};
</script>
<style></style>
