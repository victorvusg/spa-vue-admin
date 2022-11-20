<template>
  <ViewLayout :viewTitle="'Danh Sách Giao Dịch Xu'">
    <InvoiceIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'IntakeView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    InvoiceIndex: () =>
      import(
        /* webpackChunkName: "DiscountIndex" */ '@/components/Invoices/Index'
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
          text: this.$t('breadcrumbs.combo'),
          disabled: true,
          href: '/Packages',
        },
      ],
    };
  },
};
</script>
