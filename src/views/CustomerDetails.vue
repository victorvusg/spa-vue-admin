<template>
  <ViewLayout :viewTitle="'Thông tin khách hàng'">
    <CustomerDetails />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'CustomerView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    CustomerDetails: () =>
      import(
        /* webpackChunkName: "CustomerDetails" */ '@/components/Customer/Detail'
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
