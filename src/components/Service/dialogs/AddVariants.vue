<template>
  <v-dialog v-model="status" max-width="480" persistent>
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="info" depressed text small v-bind="attrs" v-on="on">
        + Thêm lựa chọn
      </v-btn>
    </template>
    <v-card class="pa-4" v-if="status">
      <v-alert dense outlined type="error" v-if="errorMessage">
        {{ errorMessage }}
      </v-alert>
      <v-form ref="addServiceForm" v-model="valid">
        <div class="subtitle-1 px-3">
          <div class="caption">Thêm các lựa chọn</div>
          <div class="font-weight-bold">{{ service.name }}</div>
        </div>
        <v-row
          v-for="(variant, index) in formObject.variants"
          :key="`variant_${index}`"
          class="mx-0 px-3 my-3"
          style="border: 1px solid black; border-radius: 6px"
        >
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
              :label="$t(`${formType}.variant.description`)"
              v-model="variant.description"
              rows="3"
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
              :disabled="selectedCategory.name !== 'promotion'"
              :menu-props="{ bottom: true, offsetY: true }"
              :items="serviceCategories"
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
              :label="$t(`${formType}.variant.price`)"
              v-model="variant.price"
              :rules="validations.required"
              required
            />
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
          <v-col cols="12" class="pa-0 caption">
            Đơn giá:
            <span class="primary--text font-weight-bold">{{
              variant.sale_price | currency
            }}</span>
          </v-col>
          <v-col cols="12" class="pa-0 caption mb-1">
            KTV nhận được:
            <span class="primary--text font-weight-bold">
              {{
                ((variant.sale_price * variant.commission_rate) / 100)
                  | currency
              }}
            </span>
          </v-col>
          <v-col cols="12" sm="6" class="pa-0">
            <v-checkbox
              v-if="selectedCategory.name === 'promotion'"
              class="mt-0 error-message-hidden"
              v-model="variant.is_free"
              :label="
                `Có phải loại được tặng? - ${variant.is_free ? 'Có' : 'Không'}`
              "
            ></v-checkbox>
          </v-col>
          <v-col cols="12" sm="6" class="pa-0" style="text-align: right">
            <v-btn text color="red darken-1" @click="deleteVariant(index)">
              <span class="font-weight-bold">Xóa</span>
            </v-btn>
          </v-col>
        </v-row>
        <div class="d-flex align-center justify-end">
          <v-btn text color="blue darken-1" @click="addVariant">
            Thêm <v-icon size="16px">mdi mdi-plus</v-icon>
          </v-btn>
        </div>
        <v-card-actions>
          <v-btn class="ml-auto" text @click="status = false"> ĐÓNG </v-btn>
          <v-btn
            color="green darken-1"
            :disabled="!valid || !formObject.variants.length"
            text
            @click="createVariants()"
          >
            TẠO
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<script>
import { privateAxios } from '@/api/api';
import { mapState } from 'vuex';

export default {
  name: 'AddVariant',
  props: {
    service: {
      require: true,
    },
    selectedCategory: {
      required: true,
    },
  },
  computed: {
    ...mapState('service', ['serviceCategories']),
    selectedCategoryName() {
      return this.selectedCategory.name;
    },
    formType() {
      if (this.selectedCategoryName === 'goods') return 'add_goods_form';
      return 'add_service_form';
    },
  },
  data() {
    return {
      status: false,
      formObject: {
        service_id: null,
        variants: [],
      },
      valid: true,
      errorMessage: null,
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
    };
  },
  created() {
    this.formObject.service_id = this.service.id;
  },
  methods: {
    async createVariants() {
      this.errorMessage = null;
      this.setLoading(true);
      try {
        const createVariantsRequest = await privateAxios.post(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST,
          this.formObject,
        );
        if (createVariantsRequest.data.IsSuccess) {
          this.setLoading(false);
          this.$emit('success');
          this.status = false;
        }
      } catch (error) {
        console.log(error);
        this.errorMessage = 'Có lỗi xảy ra !';
        this.setLoading(false);
      }
    },
    addVariant() {
      this.formObject.variants.push({
        id: null,
        name: '',
        description: '',
        gender: 'both',
        variant_category: this.selectedCategory.name,
        price: 0,
        sale_price: 0,
        commission_rate: 0,
        is_free: false,
        is_active: true,
      });
    },
    deleteVariant(index) {
      this.formObject.variants.splice(index, 1);
    },
  },
};
</script>
<style lang="scss" scoped></style>
