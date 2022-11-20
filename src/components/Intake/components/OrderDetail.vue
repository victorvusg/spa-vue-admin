<template>
  <v-expansion-panels
    v-model="panel"
    class="order-detail-panel"
    style="margin-top: 0px !important; margin-bottom: 0px !important"
  >
    <v-expansion-panel>
      <v-expansion-panel-header class="px-4" disable-icon-rotate>
        <v-row class="mx-n2">
          <v-col
            cols="12"
            class="pa-2 pt-0 font-weight-bold primary--text text-center"
          >
            {{ order.variant.name }}
          </v-col>
          <v-col
            cols="12"
            class="px-2 pt-2 pb-0 d-flex align-center justify-space-between"
          >
            <div>
              <div class="caption grey--text">Vào lúc</div>
              <div class="font-weight-bold">
                {{ checkinTime }}
              </div>
            </div>
            <div>
              <div class="caption grey--text">Ngày Check-in</div>
              <div class="font-weight-bold">
                {{ order.created_at | formatDate }}
              </div>
            </div>
          </v-col>
          <v-col
            cols="12"
            class="px-2 pt-4 pb-4 d-flex align-center justify-center"
            style="position: relative"
          >
            <div
              class="caption grey--text"
              style="position: absolute; top: -8px"
            >
              Phụ Trách bởi
            </div>
            <div class="font-weight-bold grey--text text--darken-1">
              {{ order.employee.name }}
            </div>
          </v-col>
          <v-col
            cols="12"
            class="
              pa-2
              py-0
              d-flex
              align-end
              justify-space-between
              flex-row-reverse
            "
          >
            <div class="font-weight-bold warning--text">Xem</div>
            <div
              class="title primary--text font-weight-bold"
              :style="{ opacity: showPrice ? 1 : 0, lineHeight: 1 }"
            >
              <template v-if="order.combo_id === null">
                {{ orderPrice | currency }} <span
                  v-if="order.discount_description"
                  class="caption grey--text"
                >
                  ({{ order.discount_description }}) </span
                ></template
              >
              <template v-else>Gói</template>
            </div>
          </v-col>
        </v-row>
        <template v-slot:actions><div></div></template>
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <div class="lighten-4 px-4 pt-2 pb-2 extra-content grey">
          <div class="font-weight-bold subtitle-2">GHI CHÚ</div>
          <component
            :is="`${order.note.type}-note`"
            v-if="order.note.type !== 'other'"
            :note="order.note"
          />
          <div v-else>{{ order.note.text }}</div>
          <template v-if="order.review">
            <div class="font-weight-bold subtitle-2 mt-2">ĐÁNH GIÁ</div>
            <OrderReview :review="order.review" />
          </template>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
import moment from 'moment';
import BodyNote from './BodyNote';
import FacialNote from './FacialNote';
import OrderReview from './OrderReview';

export default {
  name: 'OrderDetail',
  components: {
    FacialNote,
    BodyNote,
    OrderReview,
  },
  props: {
    order: {
      required: true,
    },
    showPrice: {
      default: true,
    },
  },
  data() {
    return {
      panel: null,
    };
  },
  computed: {
    checkinTime() {
      const date = moment.utc(this.order.created_at).local();
      return date.format('HH:mm');
    },
    orderPrice() {
      if (this.order.price && this.order.price < this.order.unit_price) {
        return this.order.price;
      }
      return this.order.unit_price;
    },
  },
};
</script>
<style lang="scss">
.order-detail-panel.v-expansion-panels {
  .v-expansion-panel {
    &:before {
      box-shadow: none;
    }
    background: transparent;
    .v-expansion-panel-header {
      box-shadow: none;
      border-radius: 8px;

      .v-expansion-panel-header__icon {
        position: absolute;
        bottom: 8px;
        right: 4px;
      }
    }
    .v-expansion-panel-content__wrap {
      padding: 0px 12px 12px 12px;
      .extra-content {
        box-shadow: none;
        border-bottom-left-radius: 8px;
        border-bottom-right-radius: 8px;
      }
    }
  }
}
</style>
