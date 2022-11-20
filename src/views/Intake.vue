<template>
  <ViewLayout :viewTitle="$t('intake.quan_ly_don_kh')">
    <IntakeIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'IntakeView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    IntakeIndex: () =>
      import(/* webpackChunkName: "IntakeIndex" */ '@/components/Intake/Index'),
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
          text: this.$t('breadcrumbs.intake'),
          disabled: true,
          href: '/intakes',
        },
      ],
    };
  },
};
</script>
