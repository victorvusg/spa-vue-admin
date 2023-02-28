<template>
  <div class="d-sm-flex align-center">
    <v-row class="mr-2">
      <v-col cols="12" sm="6">
        <label class="caption font-weight-bold">Hãng</label>
        <v-autocomplete
          :loading="isLoading"
          :disabled="isLoading"
          :value="model.service_id"
          :items="brands"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          @change="onServiceChange"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <label class="caption font-weight-bold">
          Dòng Sản Phẩm
        </label>
        <v-autocomplete
          :loading="isLoading"
          :disabled="isLoading || !model.service_id"
          v-model="productLine"
          :items="productLines"
          color="blue-grey lighten-2"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
        />
      </v-col>
      <v-col cols="12" sm="6">
        <label class="caption font-weight-bold">Tên sản phẩm</label>
        <v-autocomplete
          :loading="isLoading"
          :disabled="isLoading || !model.service_id || !productLine"
          :value="model.variant_id"
          :items="productNameItems"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          @change="(value) => onVariantChange(value)"
        />
      </v-col>
      <v-col cols="12" sm="">
        <label class="caption font-weight-bold">Số lượng</label>
        <v-text-field
          :value="model.amount"
          type="number"
          @input="(value) => updateModelSingleField(value, 'amount')"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          :disabled="isLoading || !model.service_id || !model.variant_id"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="" v-if="isAdmin">
        <label class="caption font-weight-bold">Giá nhập</label>
        <v-text-field
          type="number"
          :value="model.price"
          @input="(value) => updateModelSingleField(value, 'price')"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          :disabled="isLoading || !model.service_id || !model.variant_id"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="">
        <label class="caption font-weight-bold">Giá bán</label>
        <v-text-field
          type="number"
          :value="model.sale_price"
          @input="(value) => updateModelSingleField(value, 'sale_price')"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          :disabled="
            !isAdmin || isLoading || !model.service_id || !model.variant_id
          "
        ></v-text-field>
      </v-col>
    </v-row>
    <slot name="action" />
  </div>
</template>

<script>
export default {
  name: 'ImportRecord',
  model: {
    prop: 'model',
    event: 'change',
  },
  props: ['model', 'getProducts', 'brands', 'products'],
  data() {
    return {
      isLoading: false,
      defaultItem: {
        service_id: null,
        variant_id: 0,
        quality: 0,
        price: 0,
        sale_price: 0,
        type: 'import',
      },
      productLine: '',
    };
  },
  computed: {
    isAdmin() {
      return this.loggedRole === 'admin';
    },
    productItems() {
      if (!this.model.service_id) return [];
      return this.products.filter(
        (p) => p.service.id === this.model.service_id,
      );
    },
    productLines() {
      return this.productItems.map((i) => i.product_line);
    },
    productNameItems() {
      if (!this.productLine) return [];
      return this.productItems.filter(
        (p) => p.product_line === this.productLine,
      );
    },
  },
  methods: {
    updateModelSingleField(value, field) {
      const newValue = { ...this.model, [field]: value };
      this.$emit('change', newValue);
    },
    async onServiceChange(value) {
      this.isLoading = true;
      try {
        await this.getProducts(value);
        const newValue = { ...this.defaultItem, service_id: value };
        this.$emit('change', newValue);
        this.isLoading = false;
      } catch (err) {
        console.log(err);
      }
    },
    onVariantChange(value) {
      const item = this.productItems.find((i) => i.id === value);
      this.$emit('on-multiple-change', {
        variant_id: value,
        price: item.price,
        sale_price: item.sale_price,
      });
    },
  },
};
</script>

<style lang="scss">
.v-text-field--rounded.custom-padding {
  .v-input__slot {
    padding: 0 8px;
  }
}
</style>
