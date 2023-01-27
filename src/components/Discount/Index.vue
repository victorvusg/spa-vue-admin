<template>
  <div class="service-list" v-if="isFetched">
    <v-row>
      <v-col cols="12" sm="6">
        <v-btn depressed color="secondary" small @click="refresh">
          <v-icon small dark>mdi-refresh</v-icon>
        </v-btn>
        <CreateNewDiscount @success="fetchDiscounts" />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          :label="$t('services.search')"
          single-line
          dense
          filled
          v-model="searchString"
          clearable
          rounded
        />
      </v-col>
    </v-row>
    <v-data-iterator
      :items="discounts"
      :search="searchString"
      v-if="discounts"
      :footer-props="{
        itemsPerPageText: 'Per Page',
      }"
    >
      <template v-slot:default="props">
        <template v-for="discount in props.items">
          <v-list-item :key="discount.id">
            <v-list-item-avatar>
              <v-progress-circular
                :size="25"
                v-if="isBeingEdited(discount.id)"
                color="primary"
                indeterminate
              ></v-progress-circular>
              <v-checkbox
                off-icon="mdi-checkbox-blank-circle-outline"
                on-icon="mdi-checkbox-marked-circle"
                v-model="discount.is_active"
                :ripple="false"
                v-else
                @click="updateActiveValue(discount)"
              />
            </v-list-item-avatar>

            <v-list-item-content>
              <div>{{ discount.name }}</div>
              <div class="text-caption">
                <i v-if="discount.is_active" class="primary--text"
                  >Đang áp dụng</i
                >
                <i v-else class="grey--text text--light-1">Đã tắt</i>
              </div>
              <div>
                <DeleteDiscount
                  :disabled="isBeingEdited(discount.id)"
                  :item="discount"
                />
              </div>
            </v-list-item-content>
            <v-list-item-action>
              <DetailDialog
                :disabled="isBeingEdited(discount.id)"
                :discount="discount"
              />
            </v-list-item-action>
          </v-list-item>
          <v-divider :key="`divider_${discount.id}`" />
        </template>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import DetailDialog from '@/components/Discount/DetailDialog';
import CreateNewDiscount from '@/components/Discount/CreateNewDiscount';
import DeleteDiscount from '@/components/Discount/DeleteDiscount';

export default {
  name: 'DiscountIndex',
  components: {
    DetailDialog,
    CreateNewDiscount,
    DeleteDiscount,
  },
  data() {
    return {
      isFetched: false,
      isUpdating: false,
      searchString: '',
    };
  },
  computed: {
    ...mapState('discount', ['discounts', 'isEditing']),
    ...mapState('customer', ['ranks']),
  },
  methods: {
    ...mapActions('discount', ['fetchDiscounts', 'updateDiscount']),
    ...mapActions('service', ['fetchServices']),
    isBeingEdited(id) {
      return this.isEditing.includes(id);
    },
    async updateActiveValue(item) {
      item.isEditing = true;
      try {
        await this.updateDiscount({ id: item.id, is_active: item.is_active });
        item.isEditing = false;
      } catch (error) {
        console.log(error);
      }
    },
    async refresh() {
      this.setLoading(true);
      await this.fetchDiscounts();
      this.setLoading(false);
    },
  },
  async created() {
    this.isFetched = false;
    this.setLoading(true);
    const promiseArray = [
      this.fetchServices(),
      this.dispatch('customer/FETCH_RANKS'),
      this.fetchDiscounts(),
    ];
    await Promise.all(promiseArray);
    this.isFetched = true;
    this.setLoading(false);
  },
};
</script>
