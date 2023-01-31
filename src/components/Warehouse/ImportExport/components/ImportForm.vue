<template>
  <v-dialog v-model="dialog" persistent scrollable max-width="1024px">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
        Nhập
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span class="text-h5">Nhập hàng</span>
        <v-btn @click="addItem" class="primary" text small>
          <v-icon small>
            mdi-plus
          </v-icon>
          Thêm hàng
        </v-btn>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text style="height: 400px;">
        <template v-for="(item, index) in newItems">
          <ImportRecord
            :brands="brands"
            :products="products"
            :getProducts="getProducts"
            v-model="newItems[index]"
            :key="index"
          >
            <template v-slot:action>
              <div class="text-right mt-2">
                <v-btn text color="error" small @click="deleteItem(index)">
                  <v-icon small>
                    mdi-delete
                  </v-icon>
                  Xoa
                </v-btn>
              </div>
            </template>
          </ImportRecord>
          <v-divider
            :key="'divider_' + index"
            v-if="index < newItems.length - 1"
          ></v-divider>
        </template>
      </v-card-text>
      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="close">
          Thoat
        </v-btn>
        <v-btn color="primary" text @click="close">
          Luu
        </v-btn>
        <!-- <v-btn color="blue darken-1" text @click="save">
          Save
        </v-btn> -->
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<!-- eslint-disable no-unused-expressions -->
<script>
import { privateAxios } from '@/api/api';
import ImportRecord from './ImportRecord';

export default {
  name: 'ImportForm',
  components: {
    ImportRecord,
  },
  data() {
    return {
      dialog: false,
      newItems: [],
      defaultItem: {
        service_id: null,
        variant_id: 0,
        quality: 0,
        price: 0,
        sale_price: 0,
        type: 'import',
      },
      loadingItemIndex: -1,
      brands: [],
      products: [],
    };
  },
  methods: {
    filteredProductOptions(serviceId) {
      return this.products.filter((p) => p.service.id === serviceId);
    },
    setDefaultPricingValue(itemIndex) {
      const { variant_id: variantId } = this.newItems[itemIndex];
      const { price, sale_price: salePrice } = this.products.find(
        (p) => p.id === variantId,
      );
      this.newItems[itemIndex] = {
        ...this.newItems[itemIndex],
        price,
        sale_price: salePrice,
      };
    },
    async getProducts(serviceId) {
      try {
        const response = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST,
          {
            params: {
              service_id: serviceId,
            },
          },
        );
        const { Data } = response.data;
        const merge = [...this.products, ...Data];
        this.products = merge.filter(
          (obj, index) => index === merge.findIndex((o) => obj.id === o.id),
        );
      } catch (err) {
        console.log(err);
      }
    },
    async getBrands() {
      try {
        this.loadingItemIndex = 0;
        const response = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_LIST,
          {
            params: {
              category_name: 'goods',
            },
          },
        );
        const { Data } = response.data;
        this.brands = Data;
        this.loadingItemIndex = -1;
      } catch (err) {
        console.log(err);
      }
    },
    addItem() {
      this.newItems.push({ ...this.defaultItem });
    },
    async init() {
      this.addItem();
      await this.getBrands(0);
    },
    deleteItem(index) {
      this.newItems.splice(index, 1);
      this.closeDelete();
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.newItems = [{ ...this.defaultItem }];
      });
    },
  },
  created() {
    this.init();
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
  },
};
</script>
