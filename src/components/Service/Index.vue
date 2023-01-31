<template>
  <div class="service-list">
    <div class="d-flex align-center justify-space-between py-4">
      <h3>{{ $t('services.manage') }}</h3>
      <v-btn
        depressed
        small
        color="primary"
        @click="toggleDialog('AddNewServiceForm', true)"
        ><v-icon left small>mdi-plus</v-icon>
        <span> {{ $t('services.add') }}</span></v-btn
      >
    </div>
    <v-card class="pa-4 rounded-lg d-flex align-center mb-8" elevation="4">
      <div class="flex-grow-1">
        <label class="font-weight-bold subtitle-2"
          >{{ $t('services.search') }}
        </label>
        <v-text-field
          class="rounded-lg"
          :placeholder="''"
          dense
          filled
          rounded
          v-model="searchString"
          clearable
          hide-details
        />
      </div>
      <div>
        <v-btn
          style="margin-top: 23px"
          class="ml-2"
          depressed
          color="primary"
          @click="fetchData()"
          ><v-icon small dark>mdi-refresh</v-icon></v-btn
        >
      </div>
    </v-card>
    <!-- <div class="d-flex  mb-4 align-center">
      <div class=" mr-auto d-flex align-center justify-center"></div>
      <div class="searchbox ml-auto"></div>
    </div> -->
    <v-card class="rounded-lg overflow-hidden" elevation="4">
      <v-tabs
        show-arrows
        fixed-tabs
        hide-slider
        v-model="tab"
        background-color="grey lighten-4"
        color="black"
        class="service-tabs custom"
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab
          :href="'#tab-' + index"
          v-for="(category, index) in services"
          :key="index"
          >{{ category.descriptions }} {{ tab }}</v-tab
        >
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(category, i) in services"
          :key="'menu' + i"
          :value="'tab-' + i"
        >
          <v-expansion-panels v-model="panel" class="custom">
            <v-data-iterator
              style="width: 100%"
              :items="category.services"
              :search="searchString"
              :footer-props="{
                itemsPerPageText: 'Per Page',
              }"
            >
              <template v-slot:default="props">
                <v-expansion-panel
                  v-for="service in props.items"
                  :key="service.id"
                >
                  <v-expansion-panel-header>
                    <v-list-item-content>
                      <v-list-item-title class="primary--text font-weight-bold">
                        {{ service.name }}
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        <template
                          v-if="
                            service.service_category.name !== 'promotion' &&
                              service.service_category.name !== 'goods'
                          "
                          >Hoa hồng bán gói:
                          {{ service.combo_commission }}%</template
                        >
                        <template
                          v-if="service.service_category.name === 'promotion'"
                          >Giá ưu đãi:
                          <span class="primary--text">{{
                            promotionPrice(service.variants) | currency
                          }}</span>
                        </template>
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-data-table
                      :headers="headers"
                      :items="service.variants"
                      :items-per-page="15"
                      class="variant-item"
                    >
                      <template v-slot:item.name="{ item }">
                        <div class="d-flex align-center">
                          <span class="font-weight-bold">
                            {{ variantName(item) || '-' }}
                          </span>
                          <v-edit-dialog
                            @save="save(item, 'name')"
                            @cancel="cancel"
                            @open="open(item.name)"
                            @close="cancel"
                            :return-value.sync="item.name"
                          >
                            <v-icon class="ml-1" size="12">mdi-pencil</v-icon>
                            <template v-slot:input>
                              <v-text-field
                                v-model="editValue"
                                label="Edit"
                                single-line
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </div>
                      </template>
                      <template v-slot:item.commission_rate="{ item }">
                        <div class="d-flex align-center">
                          <span>{{ item.commission_rate }}%</span>
                          <v-edit-dialog
                            @save="save(item, 'commission_rate')"
                            @cancel="cancel"
                            @open="open(item.commission_rate)"
                            @close="cancel"
                            :return-value.sync="item.commission_rate"
                          >
                            <v-icon class="ml-1" size="12">mdi-pencil</v-icon>
                            <template v-slot:input>
                              <v-text-field
                                v-model="editValue"
                                label="Edit"
                                single-line
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </div>
                      </template>
                      <template v-slot:item.price="{ item }">
                        <div class="d-flex align-center" v-if="!item.is_free">
                          <span>
                            {{ item.sale_price | currency }}
                          </span>
                          <v-edit-dialog
                            @save="save(item, 'sale_price')"
                            @cancel="cancel"
                            @open="open(item.sale_price)"
                            @close="cancel"
                            :return-value.sync="item.sale_price"
                          >
                            <v-icon class="ml-1" size="12">mdi-pencil</v-icon>
                            <template v-slot:input>
                              <v-text-field
                                v-model="editValue"
                                label="Edit"
                                single-line
                              ></v-text-field>
                            </template>
                          </v-edit-dialog>
                        </div>
                        <span v-else> Gói tặng </span>
                      </template>
                      <template v-slot:item.active="{ item }">
                        <div class="d-flex align-center">
                          <v-btn
                            dark
                            x-small
                            :value="1"
                            v-if="!item.is_active"
                            color="green"
                            @click="toggleActive(item, 1)"
                            >Mở</v-btn
                          >
                          <v-btn
                            dark
                            x-small
                            :value="0"
                            v-if="!!item.is_active"
                            color="error"
                            @click="toggleActive(item, 0)"
                            >Tắt</v-btn
                          >
                        </div>
                      </template>
                      <template v-slot:no-data>
                        {{ $t('services.no_service') }}
                      </template>
                    </v-data-table>
                    <div class="text-right">
                      <AddVariants
                        :service="service"
                        :selectedCategory="service.service_category"
                        @success="fetchData"
                      />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </template>
              <template v-slot:no-results>
                <div class="px-6 pt-8 text-center">Không tìm thấy kết quả</div>
              </template>
            </v-data-iterator>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
    <v-dialog
      v-model="addServiceDialogStatus"
      :fullscreen="!$vuetify.breakpoint.smAndUp"
      :hide-overlay="!$vuetify.breakpoint.smAndUp"
      transition="dialog-bottom-transition"
      max-width="900px"
      persistent
    >
      <v-card>
        <v-toolbar dark color="primary" v-if="!$vuetify.breakpoint.smAndUp">
          <v-toolbar-title>Tạo Dịch Vụ</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="addServiceDialogStatus = false">
              Đóng
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <div class="pa-4">
          <template v-if="addServiceDialogStatus">
            <AddNewServiceForm
              @cancel="addServiceDialogStatus = false"
              @success="createdServiceSuccess()"
            />
          </template>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import AddNewServiceForm from '@/components/Service/forms/Add';
import { privateAxios } from '@/api/api';
import AddVariants from '@/components/Service/dialogs/AddVariants';

export default {
  name: 'ServiceIndex',
  components: {
    AddNewServiceForm,
    AddVariants,
  },
  data() {
    return {
      editValue: '',
      tab: null,
      panel: null,
      expanded: [],
      servicesItems: [],
      addServiceDialogStatus: false,
      modalTitle: this.$t('services.modal_service'),
      modalSubtitle: this.$t('services.default_ratio'),
      formComponent: 'AddNewServiceForm',
      searchString: '',
    };
  },
  watch: {
    tab() {
      this.panel = null;
    },
  },
  computed: {
    ...mapState('service', ['services']),
    headers() {
      const headers = [
        { text: 'Mô tả', value: 'name', sortable: false },
        {
          text: 'Hoa hồng (%)',
          value: 'commission_rate',
          sortable: false,
        },
        { text: this.$t('services.price'), value: 'price', sortable: false },
        { text: 'Mở/Tắt', value: 'active', sortable: false },
        { text: '', value: 'data-table-expand', sortable: false },
      ];
      if (this.tab === 'tab-goods') {
        headers.splice(3, 0, {
          text: this.$t('services.stock'),
          value: 'stock',
          sortable: false,
        });
      }
      return headers;
    },
  },
  methods: {
    ...mapActions('service', ['fetchServices']),
    toggleDialog(type = 'AddNewServiceForm', status) {
      if (type === 'AddNewServiceCategoryForm') {
        this.modalTitle = 'Add new Service Category';
        this.modalSubtitle = '';
      }

      if (type === 'ServiceCategoriesIndex') {
        this.modalTitle = 'All Service Categories';
        this.modalSubtitle = '';
      }

      this.formComponent = type;
      this.addServiceDialogStatus = status;
    },
    comboRatio(_decimal) {
      const gcd = (a, b) => (b ? gcd(b, a % b) : a);

      let top = _decimal.toString().replace(/\d+[.]/, '');
      // eslint-disable-next-line no-restricted-properties
      const bottom = Math.pow(10, top.length);
      if (_decimal > 1) {
        top = +top + Math.floor(_decimal) * bottom;
      }
      const x = gcd(top, bottom);
      return `mua ${bottom / x} tặng ${top / x - bottom / x}`;
    },
    async createdServiceSuccess() {
      await this.fetchData();
      this.addServiceDialogStatus = false;
    },
    async toggleActive(variant, value) {
      this.setLoading(true);
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST}/${variant.id}`;
      try {
        const variantUpdateRequest = await privateAxios.put(route, {
          is_active: value,
        });
        this.setLoading(false);
        variant.is_active = variantUpdateRequest.data.Data.is_active;
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
      }
    },
    async save(variant, field) {
      this.setLoading(true);
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST}/${variant.id}`;
      const payload = {};
      payload[field] = this.editValue;
      try {
        const variantUpdateRequest = await privateAxios.put(route, payload);
        this.setLoading(false);
        variant[field] = variantUpdateRequest.data.Data[field];
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
        this.editValue = '';
      }
    },
    cancel() {
      this.editValue = '';
    },
    open(name) {
      this.editValue = name;
    },
    async fetchData() {
      this.setLoading(true);
      await this.fetchServices();
      this.setLoading(false);
    },
  },
  async created() {
    await this.fetchData();
  },
};
</script>
<style lang="scss">
.service-list {
  .v-data-table__expanded__content {
    background-color: #fafafa !important;
    box-shadow: none !important;
    .variants {
      background-color: #fff;
    }
  }
}
</style>
