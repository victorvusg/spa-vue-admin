<template>
  <div class="d-sm-flex align-center">
    <v-row class="mr-2">
      <v-col cols="12" sm="2">
        <label class="caption font-weight-bold">Hang</label>
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
      <v-col cols="12" sm="4">
        <label class="caption font-weight-bold">Ten san pham</label>
        <v-autocomplete
          :loading="isLoading"
          :disabled="isLoading || !model.service_id"
          :value="model.variant_id"
          :items="productItems"
          color="blue-grey lighten-2"
          item-text="name"
          item-value="id"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          @change="(value) => updateModelSingleField(value, 'variant_id')"
        />
      </v-col>
      <v-col cols="12" sm="2">
        <label class="caption font-weight-bold">So Luong</label>
        <v-text-field
          :value="model.quality"
          @input="(value) => updateModelSingleField(value, 'quality')"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          :disabled="isLoading || !model.service_id || !model.variant_id"
        ></v-text-field>
      </v-col>
      <v-col cols="12" sm="2">
        <label class="caption font-weight-bold">Gia nhap</label>
        <v-text-field
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
      <v-col cols="12" sm="2">
        <label class="caption font-weight-bold">Gia ban</label>
        <v-text-field
          :value="model.sale_price"
          @input="(value) => updateModelSingleField(value, 'sale_price')"
          hide-details
          class="pt-0 mt-0 rounded-lg custom-padding"
          :placeholder="''"
          dense
          filled
          rounded
          :disabled="isLoading || !model.service_id || !model.variant_id"
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
    };
  },
  computed: {
    productItems() {
      if (!this.model.service_id) return [];
      return this.products.filter(
        (p) => p.service.id === this.model.service_id,
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
