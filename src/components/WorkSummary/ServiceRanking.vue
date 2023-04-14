<template>
  <div>
    <v-tabs v-model="tab" vertical>
      <v-tabs-slider color="yellow"></v-tabs-slider>

      <v-tab v-for="category in serviceCategories" :key="category.id" class="px-1">
        {{ category.name }}
      </v-tab>
      <v-tabs-items v-model="tab" class="pa-2">
        <v-tab-item v-for="category in serviceCategories" :key="category.id">
          <v-expansion-panels>
            <v-expansion-panel v-for="(record, index) in mappedData[category.name].sort(
              (a, b) => b.quantity - a.quantity,
            )" :key="index" class="service-rank-item grey lighten-3 mb-2">
              <v-expansion-panel-header>
                <div class="d-flex align-center">
                  <div class="d-flex align-center pa-4 rank-position">
                    {{ index + 1 }}
                  </div>
                  <div class="pl-2">
                    <div class="rank-employee mb-1">
                      {{ record.employee.name }}
                    </div>
                    <div>
                      <span>{{
                        category.name === 'goods'
                        ? 'Số sản phẩm bán được: '
                        : 'Số tour: '
                      }}</span>
                      <strong :class="{
                        'red--text': record.quantity,
                        'grey--text text--lighten-1': !record.quantity,
                      }">{{ record.quantity }}</strong>
                    </div>
                  </div>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <ul>
                  <li v-for="(variant, index) in record.variants"
                    :key="index" class="caption"
                    :class="{
                    'grey--text text--lighten-1': uncountableServiceIds.includes(
                      variant.service_id,
                    ),
                  }">
                    {{ variantName(variant) }}
                    <span v-if="variant.gender !== 'both'">- {{ $t(variant.gender) }}</span>:
                    <span class="font-weight-bold"> {{ variant.count }}</span>
                  </li>
                </ul>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </div>
</template>
<script>

export default {
  name: 'WorkSummaryIndex',
  props: {
    orders: {
      default: () => [],
    },
    serviceCategories: {
      default: () => [],
    },
  },
  data() {
    return {
      tab: null,
      // ID = 28: DỊCH VỤ CỔ VAI GÁY
      uncountableServiceIds: [28],
    };
  },
  computed: {
    mappedData() {
      const categories = {};
      this.serviceCategories.forEach((s) => {
        categories[s.name] = [];
      });
      this.orders.forEach((order) => {
        const countable = !this.uncountableServiceIds.includes(
          order.variant.service_id,
        );
        const serviceName = order.variant.variant_category;
        const targetArray = categories[serviceName];
        const foundIndex = targetArray.findIndex(
          (el) => el.employee.id === order.employee.id,
        );
        if (foundIndex !== -1) {
          if (countable) {
            targetArray[foundIndex].quantity += 1;
          }
          const foundVariantIndex = targetArray[foundIndex].variants.findIndex(
            (v) => v.id === order.variant.id,
          );
          if (foundVariantIndex === -1) {
            targetArray[foundIndex].variants.push({
              id: order.variant.id,
              service_id: order.variant.service_id,
              name: this.variantName(order.variant),
              gender: order.variant.gender,
              count: 1,
            });
          } else {
            // eslint-disable-next-line no-plusplus
            targetArray[foundIndex].variants[foundVariantIndex].count += 1;
          }
        } else {
          targetArray.push({
            employee: order.employee,
            quantity: countable ? 1 : 0,
            variants: [
              {
                id: order.variant.id,
                service_id: order.variant.service_id,
                name: this.variantName(order.variant),
                gender: order.variant.gender,
                count: 1,
              },
            ],
          });
        }
      });
      return categories;
    },
  },
};
</script>
<style lang="scss" scoped>
.service-rank-item {
  border-radius: 8px;

  &::after {
    display: none;
  }

  &::before {
    box-shadow: none;
  }

  .v-expansion-panel-header {
    padding: 0px;
  }

  .rank-position {
    font-weight: 700;
    border-right: 2px solid white;
  }

  .rank-employee {
    font-weight: 700;
  }
}
</style>
