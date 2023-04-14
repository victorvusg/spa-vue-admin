<template>
  <v-dialog v-model="dialog" persistent v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" depressed small v-bind="attrs" v-on="on">
        {{ $t(`${purpose}`) }}
      </v-btn>
    </template>
    <v-card class="pa-4">
      <v-form
        ref="addServiceForm"
        v-model="valid"
        lazy-validation
        @keyup.native.enter="formSubmit()"
      >
        <v-row class="mx-0 pa-3">
          <v-col cols="12" class="pa-0 pb-2">
            <v-select
             :disabled="isAddVariantsPurpose"
              :items="serviceCategories"
              :menu-props="{ bottom: true, offsetY: true }"
              v-model="formObject.service_category_id"
              item-text="descriptions"
              item-value="id"
              :label="$t(`${formType}.category`)"
              :rules="validations.required"
              required
              @change="(val) => handleServiceCategoryChange(val)"
            ></v-select>
          </v-col>
          <v-col cols="12" class="pa-0 pb-2">
            <v-text-field
            :disabled="isAddVariantsPurpose"
              :label="$t(`${formType}.name`)"
              v-model="formObject.name"
              :rules="validations.required"
              required
            />
          </v-col>
          <v-col cols="12" class="pa-0 pb-2" v-if="isGoods">
            <v-select
              :items="metadataMappersItems"
              :disabled="isAddVariantsPurpose || !!formObject.variants.length"
              item-value="value"
              item-text="text"
              :menu-props="{ bottom: true, offsetY: true }"
              v-model="formObject.mapper"
              :label="$t(`${formType}.settings`)"
            ></v-select>
          </v-col>
          <!-- // Sold by combo -->
          <v-col cols="12" sm="6" class="pa-0" v-if="isSoldByPackage">
            <v-checkbox
              class="mt-0"
              v-model="formObject.is_combo_sold"
              :label="$t(`${formType}.is_combo_sold`)"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="6" class="pa-0 pb-2">
            <v-text-field
              type="number"
              v-if="formObject.is_combo_sold"
              :label="$t(`${formType}.combo_commission`)"
              v-model="formObject.combo_commission"
              suffix="%"
              :rules="validations.commission.concat(validations.percentage)"
              required
            />
          </v-col>
        </v-row>
        <div class="subtitle-1 px-3">{{ $t(`${formType}.variants`) }}:</div>
        <!-- Variants List -->
        <div
          v-for="(variant, index) in formObject.variants"
          :key="`variant_${index}`"
          class="my-3"
          style="border: 1px solid black; border-radius: 6px"
        >
          <v-row class="mx-0 px-3">
            <template v-if="isGoods">
              <v-col cols="12" class="pa-0 pb-2">
                <v-text-field
                  :label="$t(`${formType}.variant.product_line`)"
                  v-model="variant.product_line"
                  :rules="validations.required"
                  required
                />
              </v-col>
            </template>
            <v-col cols="12" class="pa-0 pb-2">
              <v-text-field
                :label="$t(`${formType}.variant.name`)"
                v-model="variant.name"
                :rules="validations.required"
                required
              />
            </v-col>
            <v-col cols="12" class="pa-0 pb-2">
              <v-textarea
                rows="1"
                :label="$t(`${formType}.variant.description`)"
                v-model="variant.description"
              />
            </v-col>
            <v-col cols="6" sm="6" class="pa-0 pr-4">
              <v-select
                :menu-props="{ bottom: true, offsetY: true }"
                :items="genders"
                v-model="variant.gender"
                :label="$t(`${formType}.variant.gender`)"
                :rules="validations.required"
                required
              ></v-select>
            </v-col>
            <v-col cols="6" sm="6" class="pa-0 pr-sm-4">
              <v-select
                :disabled="!isPromotion"
                :menu-props="{ bottom: true, offsetY: true }"
                :items="variantCategories"
                v-model="variant.variant_category"
                item-text="descriptions"
                item-value="name"
                :label="$t(`${formType}.variant.category`)"
                :rules="validations.required"
                required
              ></v-select>
            </v-col>
            <v-col cols="6" sm="4" class="pa-0 pr-4 pb-2">
              <v-text-field
                type="number"
                :label="$t(`${formType}.variant.sale_price`)"
                v-model="variant.sale_price"
                :rules="validations.required"
                required
              />
            </v-col>
            <v-col cols="6" sm="4" class="pa-0 pb-2">
              <v-text-field
                type="number"
                :label="$t(`${formType}.variant.commission_rate`)"
                v-model="variant.commission_rate"
                suffix="%"
                :rules="validations.commission.concat(validations.percentage)"
                required
              />
            </v-col>
            <v-col
              cols="12"
              sm="4"
              class="pb-2 caption d-flex flex-column justify-center"
            >
              <div class="mb-5">
                <div>
                  Đơn giá:
                  <span class="primary--text font-weight-bold">{{
                    variant.sale_price | currency
                  }}</span>
                </div>
                <div>
                  KTV nhận được:
                  <span class="primary--text font-weight-bold">
                    {{
                      ((variant.sale_price * variant.commission_rate) / 100)
                        | currency
                    }}
                  </span>
                </div>
              </div>
            </v-col>
            <v-col cols="12" sm="6" class="pa-0">
              <v-checkbox
                v-if="isPromotion"
                class="mt-0 error-message-hidden"
                v-model="variant.is_free"
                :label="
                  `Có phải loại được tặng? - ${
                    variant.is_free ? 'Có' : 'Không'
                  }`
                "
              ></v-checkbox>
            </v-col>
          </v-row>
          <!-- If category = goods -->
          <template v-if="isGoods">
            <div class="px-3">
              <h5>Thông tin hàng hóa</h5>
              <v-row class="mx-0 my-4">
                <v-col cols="4" class="pa-0 pr-4 pb-2">
                  <v-text-field
                    readonly
                    filled
                    rounded
                    class="rounded-lg"
                    small
                    hide-details
                    :value="$t(`${formType}.variant.price`)"
                  />
                </v-col>
                <v-col cols="8" class="pa-0 pr-4 pb-2">
                  <v-text-field
                    type="number"
                    filled
                    rounded
                    class="rounded-lg"
                    small
                    hide-details
                    v-model="variant.price"
                    suffix="x 1,000 đồng"
                  />
                </v-col>
              </v-row>
              <v-row
                class="mx-0 my-4"
                v-for="key in Object.keys(variant.metadata)"
                :key="key"
              >
                <v-col cols="4" class="pa-0 pr-4 pb-2">
                  <v-text-field
                    readonly
                    filled
                    rounded
                    class="rounded-lg"
                    small
                    hide-details
                    :value="$t(`goods_mappers.${formObject.mapper}.${key}`)"
                  />
                </v-col>
                <v-col cols="8" class="pa-0 pr-4 pb-2">
                  <v-text-field
                    filled
                    rounded
                    class="rounded-lg"
                    small
                    hide-details
                    v-model="variant.metadata[key]"
                  />
                </v-col>
              </v-row>
            </div>
          </template>
          <div style="text-align: right">
            <v-btn text color="red darken-1" @click="deleteVariant(index)">
              <span class="font-weight-bold">Xóa</span>
            </v-btn>
          </div>
        </div>
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
          <v-btn color="primary" text @click="close">
            {{ $t(`${formType}.close`) }}
          </v-btn>
          <v-btn color="primary" dark depressed @click="formSubmit()">
            Ok
          </v-btn>
        </div>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<!-- eslint-disable camelcase -->

<script>
import { mapState } from 'vuex';
import { privateAxios } from '@/api/api';
import { MilbonMapper } from '../../../helpers/metadataMappers/index';

export default {
  name: 'AddNewServiceForm',
  props: {
    purpose: {
      type: String,
      default: 'create_service',
    },
    service: {
      type: Object || null,
      default: null,
    },
    category: {
      type: Object || null,
      default: null,
    },
  },
  data() {
    return {
      dialog: false,
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
        mapper: '',
        variants: [],
      },
      validations: {
        required: [(v) => !!v || 'Không bỏ trống'],
        commission: [(v) => v !== undefined || v !== null || 'Không bỏ trống'],
        percentage: [(v) => (v >= 0 && v <= 100) || 'Không hợp lệ'],
      },
      valid: true,
      name: '',
      metadataMappers: {
        MilbonMapper,
      },
      errorMessage: '',
    };
  },
  computed: {
    ...mapState('service', ['serviceCategories']),
    metadataMappersItems() {
      return Object.keys(this.metadataMappers).map((m) => ({
        value: m,
        text: this.$t(`add_goods_form.${m}`),
      }));
    },
    variantCategories() {
      return this.serviceCategories.filter((item) => item.name !== 'promotion' && item.name !== 'extra');
    },
    selectedCategory() {
      if (this.formObject.service_category_id !== null) {
        return this.serviceCategories.find(
          (e) => e.id === this.formObject.service_category_id,
        );
      }
      return null;
    },
    selectedCategoryName() {
      return this.selectedCategory?.name || '';
    },
    isGoods() {
      return this.selectedCategory && this.selectedCategory.name === 'goods';
    },
    isPromotion() {
      return (
        this.selectedCategory && this.selectedCategory.name === 'promotion'
      );
    },
    isSoldByPackage() {
      return !this.isGoods && !this.isPromotion;
    },
    isAddVariantsPurpose() {
        return this.purpose === 'add_variants';
    },
    formType() {
      if (this.isGoods) return 'add_goods_form';
      return 'add_service_form';
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
    close() {
      this.dialog = false;
      this.$emit('cancel');
    },
    handleServiceCategoryChange() {
      if (this.selectedCategoryName && this.selectedCategoryName === 'goods') {
        [this.formObject.mapper] = Object.keys(this.metadataMappers);
        return;
      }
      this.formObject.mapper = '';
    },
    addVariant() {
      if (this.selectedCategory) {
        const metadata = this.formObject.mapper
          ? { ...this.metadataMappers[this.formObject.mapper] }
          : null;
        this.formObject.variants.push({
          id: null,
          name: '',
          description: '',
          gender: 'both',
          variant_category: this.selectedCategory.name,
          price: 0,
          commission_rate: 0,
          is_free: false,
          is_active: true,
          sale_price: 0,
          product_line: '',
          metadata,
        });
      }
    },
    deleteVariant(index) {
      this.formObject.variants.splice(index, 1);
    },
    async addVariants() {
      this.setLoading(true);
     const payload = { service_id: this.service.id, variants: this.formObject.variants };
      try {
        const createVariantsRequest = await privateAxios.post(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST,
          payload,
        );
        if (createVariantsRequest.data.IsSuccess) {
          this.setLoading(false);
          this.$emit('success');
          this.dialog = false;
        }
      } catch (error) {
        console.log(error);
        this.errorMessage = 'Có lỗi xảy ra !';
        this.setLoading(false);
      }
    },
    async createService() {
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
            this.dialog = false;
          }
        } catch (error) {
          console.log(error);
          this.errorMessage = 'Có lỗi xảy ra !';
          this.setLoading(false);
          throw error;
        }
      }
    },
    async formSubmit() {
      this.errorMessage = '';
      switch (this.purpose) {
        case 'create_service':
          this.createService();
          break;
        case 'add_variants':
          this.addVariants();
          break;
        default:
      }
    },
  },
  created() {
    if (this.service) {
      const {
        name,
        is_combo_sold,
        combo_commission,
        is_active,
        mapper,
      } = this.service;
      const service_category_id = this.service.service_category.id;
      this.formObject = {
        ...this.formObject,
        name,
        is_combo_sold,
        combo_commission,
        is_active,
        service_category_id,
        mapper,
      };
    }
  },
};
</script>
<style></style>
