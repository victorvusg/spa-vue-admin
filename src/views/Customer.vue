<template>
  <ViewLayout :viewTitle="$t('customers.mange_customer')">
    <CustomerIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'CustomerView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    CustomerIndex: () =>
      import(
        /* webpackChunkName: "CustomerIndex" */ '@/components/Customer/Index'
      ),
  },
  data() {
    return {
      breadcrumbsItems: [
        {
          text: this.$t('breadcrumbs.dashboard'),
          disabled: false,
          href: routeHelper.getPath('Dashboard'),
        },
        {
          text: this.$t('breadcrumbs.customers'),
          disabled: true,
          href: '/customers',
        },
      ],
    };
  },
};
</script>
