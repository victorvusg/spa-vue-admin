<template>
  <div v-if="customer">
    <div class="d-flex align-end justify-space-between mb-2">
      <div class="title">{{ customer.name }}</div>
      <div class="subtitle-2 blue--text">
        {{ customer.balance | coin }}
      </div>
    </div>
    <div class="d-flex align-center">
      <v-icon color="primary" size="20" class="mr-2">mdi-cake-variant</v-icon>
      <div class="py-1 subtitle-2 grey--text">
        {{ customer.birthday | formatDate }}
      </div>
    </div>
    <div class="d-flex align-center">
      <v-icon color="primary" size="20" class="mr-2">mdi-phone</v-icon>
      <div class="py-1 subtitle-2 grey--text">
        {{ customer.phone | formatPhone }}
      </div>
    </div>
    <div class="d-flex align-center">
      <v-icon color="primary" size="20" class="mr-2">mdi-alpha-p-circle</v-icon>
      <div class="py-1 subtitle-2 grey--text">
        Tích luỹ được <strong>{{ customer.cash_point | currency }}</strong>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="d-flex align-end justify-space-between mb-2">
      <div class="title">Khách vãng lai</div>
      <div class="subtitle-2 grey--text">Chưa có thông tin</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'CustomerCard',
  props: {
    customer: {
      required: true,
    },
  },
  data() {
    return {
      fields: [
        {
          icon: 'mdi-cake-variant',
          key: 'birthday',
        },
        {
          icon: 'mdi-phone',
          key: 'phone',
        },
        {
          icon: 'mdi-alpha-p-circle',
          key: 'points',
        },
      ],
    };
  },
};
</script>
