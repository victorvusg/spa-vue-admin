<template>
  <v-form
    ref="addServiceForm"
    v-model="valid"
    lazy-validation
    @keyup.native.enter="formSubmit()"
  >
    <v-row class="mx-0 pa-3">
      <v-col cols="12" class="pa-0 pb-2">
        <v-select
          :items="serviceCategories"
          :menu-props="{ bottom: true, offsetY: true }"
          v-model="formObject.service_category_id"
          item-text="descriptions"
          item-value="id"
          :label="$t('add_service_form.category')"
          :rules="validations.required"
          required
        ></v-select>
      </v-col>
      <v-col cols="12" class="pa-0 pb-2">
        <v-text-field
          :label="$t('add_service_form.name')"
          v-model="formObject.name"
          :rules="validations.required"
          required
        />
      </v-col>
      <v-col
        cols="12"
        sm="6"
        class="pa-0"
        v-if="selectedCategory && selectedCategory.name !== 'promotion'"
      >
        <v-checkbox
          class="mt-0"
          v-model="formObject.is_combo_sold"
          :label="$t('add_service_form.is_combo_sold')"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" sm="6" class="pa-0 pb-2">
        <v-text-field
          type="number"
          v-if="formObject.is_combo_sold"
          :label="$t('add_service_form.combo_commission')"
          v-model="formObject.combo_commission"
          suffix="%"
          :rules="validations.commission.concat(validations.percentage)"
          required
        />
      </v-col>
    </v-row>
    <div class="subtitle-1 px-3">Các lựa chọn khi bán dịch vụ:</div>
    <v-row
      v-for="(variant, index) in formObject.variants"
      :key="`variant_${index}`"
      class="mx-0 px-3 my-3"
      style="border: 1px solid black; border-radius: 6px"
    >
      <v-col cols="12" class="pa-0 pb-2">
        <v-text-field
          :label="$t('add_service_form.variant.name')"
          v-model="variant.name"
          :rules="validations.required"
          required
        />
      </v-col>
      <v-col cols="6" sm="6" class="pa-0 pr-4">
        <v-select
          :menu-props="{ bottom: true, offsetY: true }"
          :items="genders"
          v-model="variant.gender"
          :label="$t('add_service_form.variant.gender')"
          :rules="validations.required"
          required
        ></v-select>
      </v-col>
      <v-col cols="6" sm="6" class="pa-0 pr-sm-4">
        <v-select
          :disabled="selectedCategory.name !== 'promotion'"
          :menu-props="{ bottom: true, offsetY: true }"
          :items="serviceCategories"
          v-model="variant.variant_category"
          item-text="descriptions"
          item-value="name"
          :label="$t('add_service_form.variant.category')"
          :rules="validations.required"
          required
        ></v-select>
      </v-col>
      <v-col cols="6" sm="4" class="pa-0 pr-4 pb-2">
        <v-text-field
          type="number"
          :label="$t('add_service_form.variant.price')"
          v-model="variant.price"
          :rules="validations.required"
          required
        />
      </v-col>
      <v-col cols="6" sm="4" class="pa-0 pb-2">
        <v-text-field
          type="number"
          :label="$t('add_service_form.variant.commission_rate')"
          v-model="variant.commission_rate"
          suffix="%"
          :rules="validations.commission.concat(validations.percentage)"
          required
        />
      </v-col>
      <v-col cols="12" class="pa-0 caption">
        Đơn giá:
        <span class="primary--text font-weight-bold">{{
          variant.price | currency
        }}</span>
      </v-col>
      <v-col cols="12" class="pa-0 caption mb-1">
        KTV nhận được:
        <span class="primary--text font-weight-bold">
          {{ ((variant.price * variant.commission_rate) / 100) | currency }}
        </span>
      </v-col>
      <v-col cols="12" sm="6" class="pa-0">
        <v-checkbox
          v-if="selectedCategory.name === 'promotion'"
          class="mt-0 error-message-hidden"
          v-model="variant.is_free"
          :label="`Có phải loại được tặng? - ${
            variant.is_free ? 'Có' : 'Không'
          }`"
        ></v-checkbox>
      </v-col>
      <v-col cols="12" sm="6" class="pa-0" style="text-align: right">
        <v-btn text color="red darken-1" @click="deleteVariant(index)">
          <span class="font-weight-bold">Xóa</span>
        </v-btn>
      </v-col>
    </v-row>
    <div class="d-flex align-center justify-end">
      <v-btn
        text
        color="blue darken-1"
        @click="addVariant"
        :disabled="formObject.service_category_id === null"
      >
        Thêm <v-icon size="16px">mdi mdi-plus</v-icon>
      </v-btn>
    </div>
    <v-alert dense outlined type="error" v-if="errorMessage">
      {{ errorMessage }}
    </v-alert>
    <div class="d-flex justify-end mt-8">
      <v-btn color="primary" text @click="$emit('cancel')">
        {{ $t('add_service_form.close') }}
      </v-btn>
      <v-btn color="primary" dark depressed @click="formSubmit()">
        {{ $t('add_service_form.add') }}
      </v-btn>
    </div>
  </v-form>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import { privateAxios } from '@/api/api';

export default {
  name: 'AddNewServiceForm',
  data() {
    return {
      genders: [
        {
          text: 'Nam',
          value: 'male',
        },
        {
          text: 'Nữ',
          value: 'female',
        },
        {
          text: 'Cả Nam và Nữ',
          value: 'both',
        },
      ],
      formObject: {
        name: '',
        is_combo_sold: false,
        combo_commission: 0,
        is_active: true,
        service_category_id: null,
        variants: [],
      },
      validations: {
        required: [(v) => !!v || 'Không bỏ trống'],
        commission: [(v) => v !== undefined || v !== null || 'Không bỏ trống'],
        percentage: [(v) => (v >= 0 && v <= 100) || 'Không hợp lệ'],
      },
      valid: true,
      name: '',
      errorMessage: '',
    };
  },
  computed: {
    ...mapState('service', ['serviceCategories']),
    selectedCategory() {
      if (this.formObject.service_category_id !== null) {
        return this.serviceCategories.find(
          (e) => e.id === this.formObject.service_category_id,
        );
      }
      return this.serviceCategories[0];
    },
  },
  watch: {
    'formObject.service_category_id': {
      deep: true,
      handler() {
        this.formObject.variants = [];
      },
    },
  },
  methods: {
    ...mapMutations('app', ['setLoading']),
    closeDialog() {
      this.$emit('closeDialog');
    },
    addVariant() {
      this.formObject.variants.push({
        id: null,
        name: '',
        gender: 'both',
        variant_category: this.selectedCategory.name,
        price: 0,
        commission_rate: 0,
        is_free: false,
        is_active: true,
      });
    },
    deleteVariant(index) {
      this.formObject.variants.splice(index, 1);
    },
    async formSubmit() {
      this.errorMessage = '';
      const validateResult = this.$refs.addServiceForm.validate();
      if (validateResult === true) {
        if (!this.formObject.variants.length) {
          this.errorMessage = 'Vui lòng thêm lựa chọn bán dịch vụ';
          return;
        }
        this.setLoading(true);
        try {
          const createServiceRequest = await privateAxios.post(
            process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_LIST,
            this.formObject,
          );
          if (createServiceRequest.data.IsSuccess) {
            this.$emit('success');
          }
        } catch (error) {
          console.log(error);
          this.errorMessage = 'Có lỗi xảy ra !';
          this.setLoading(false);
          throw error;
        }
      }
    },
  },
};
</script>
<style></style>
