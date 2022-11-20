<template>
  <ViewLayout viewTitle="Danh sách chương trình giảm giá">
    <DiscountIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'DiscountView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    DiscountIndex: () =>
      import(
        /* webpackChunkName: "DiscountIndex" */ '@/components/Discount/Index'
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
          text: 'Chương trình giảm giá',
          disabled: true,
          href: '/discount',
        },
      ],
    };
  },
};
</script>
