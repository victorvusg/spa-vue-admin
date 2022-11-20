<template>
  <ViewLayout :viewTitle="$t('combos.combo_management')">
    <PackageIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'PackageView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    PackageIndex: () =>
      import(
        /* webpackChunkName: "DiscountIndex" */ '@/components/Package/Index'
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
