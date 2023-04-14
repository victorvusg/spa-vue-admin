<template>
  <v-dialog v-model="dialog" persistent v-bind="$attrs">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        @click="open"
        outlined
        text
        class="ml-1"
        x-small
        :value="0"
        color="primary"
        >Sửa</v-btn
      >
    </template>
    <v-card class="pa-4">
      <v-form
        ref="addServiceForm"
        v-model="valid"
        lazy-validation
        @keyup.native.enter="save()"
      >
        <v-row class="mx-0 px-3">
          <template v-if="isGoods">
            <v-col cols="12" class="pa-0 pb-2">
              <v-text-field
                :label="$t(`${formType}.variant.product_line`)"
                v-model="form.product_line"
                :rules="validations.required"
                required
              />
            </v-col>
          </template>
          <v-col cols="12" class="pa-0 pb-2">
            <v-text-field
              :label="$t(`${formType}.variant.name`)"
              v-model="form.name"
              :rules="validations.required"
              required
            />
          </v-col>
          <v-col cols="12" class="pa-0 pb-2">
            <v-textarea
              rows="1"
              :label="$t(`${formType}.variant.description`)"
              v-model="form.description"
            />
          </v-col>
          <v-col cols="6" sm="6" class="pa-0 pr-4">
            <v-select
              :menu-props="{ bottom: true, offsetY: true }"
              :items="genders"
              v-model="form.gender"
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
              v-model="form.variant_category"
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
              v-model="form.sale_price"
              :rules="validations.required"
              required
            />
          </v-col>
          <v-col cols="6" sm="4" class="pa-0 pb-2">
            <v-text-field
              type="number"
              :label="$t(`${formType}.variant.commission_rate`)"
              v-model="form.commission_rate"
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
              v-model="form.is_free"
              :label="
                `Có phải loại được tặng? - ${variant.is_free ? 'Có' : 'Không'}`
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
                  v-model="form.price"
                  suffix="x 1,000 đồng"
                />
              </v-col>
            </v-row>
            <v-row
              class="mx-0 my-4"
              v-for="key in Object.keys(form.metadata)"
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
                  :value="$t(`goods_mappers.${serviceMapper}.${key}`)"
                />
              </v-col>
              <v-col cols="8" class="pa-0 pr-4 pb-2">
                <v-text-field
                  filled
                  rounded
                  class="rounded-lg"
                  small
                  hide-details
                  v-model="form.metadata[key]"
                />
              </v-col>
            </v-row>
          </div>
        </template>
        <v-alert dense outlined type="error" v-if="errorMessage">
          {{ errorMessage }}
        </v-alert>
        <div class="d-flex justify-end mt-8">
          <v-btn color="primary" text @click="close">
            {{ $t(`${formType}.close`) }}
          </v-btn>
          <v-btn color="primary" dark depressed @click="save()">
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

export default {
  name: 'EditVariantDialog',
  props: ['variant'],
  data() {
    return {
      dialog: false,
      defaultValue: {
        name: '',
        description: '',
        gender: 'both',
        price: 0,
        commission_rate: 0,
        is_free: false,
        sale_price: 0,
        product_line: '',
        variant_category: '',
        metadata: {},
      },
      form: {},
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
      validations: {
        required: [(v) => !!v || 'Không bỏ trống'],
        commission: [(v) => v !== undefined || v !== null || 'Không bỏ trống'],
        percentage: [(v) => (v >= 0 && v <= 100) || 'Không hợp lệ'],
      },
      valid: true,
      errorMessage: '',
    };
  },
  created() {
    this.form = { ...this.defaultValue };
  },
  methods: {
    open() {
      this.dialog = true;
      this.form = JSON.parse(JSON.stringify(this.variant));
    },
    close() {
      this.form = JSON.parse(JSON.stringify(this.variant));
      this.dialog = false;
    },
    async save() {
      this.setLoading(true);
      const {
        id,
        name,
        description,
        gender,
        price,
        commission_rate,
        is_free,
        sale_price,
        product_line,
        metadata,
        variant_category,
      } = this.form;
      const url = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST}/${id}`;
      try {
        await privateAxios.put(url, {
          name,
          description,
          gender,
          price,
          commission_rate,
          is_free,
          sale_price,
          product_line,
          metadata,

          variant_category,
        });
        this.dispatch('service/PUSH_VARIANTS', [
          {
            id,
            name,
            description,
            gender,
            price,
            commission_rate,
            is_free,
            sale_price,
            product_line,
            variant_category,
            metadata,
          },
        ]);
        this.setLoading(false);
        this.dispatch('toast/openToast', {
          color: 'success',
          message: 'Success. Update thành công !',
        });
      } catch (error) {
        const message = 'Failed. Đã có lỗi xảy ra !';
        this.dispatch('toast/openToast', {
          color: 'error',
          message,
        });
      } finally {
        this.setLoading(false);
        this.close();
      }
    },
  },
  computed: {
    ...mapState('service', ['serviceCategories']),
    variantCategories() {
      return this.serviceCategories.filter((item) => item.name !== 'promotion' && item.name !== 'extra');
    },
    isGoods() {
      if (
        !this.variant ||
        !this.variant.service ||
        !this.variant.service.service_category
      ) {
        return false;
      }
      return this.variant.service.service_category.name === 'goods';
    },
    isPromotion() {
      if (
        !this.variant ||
        !this.variant.service ||
        !this.variant.service.service_category
      ) {
        return false;
      }
      return this.variant.service.service_category.name === 'promotion';
    },
    formType() {
      if (this.isGoods) return 'add_goods_form';
      return 'add_service_form';
    },
    serviceMapper() {
      if (!this.variant || !this.variant.service) {
        return '';
      }
      return this.variant.service.mapper;
    },
  },
};
</script>
