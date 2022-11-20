<template>
  <ViewLayout :viewTitle="'Báo cáo thống kê'">
    <ReportIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'EmployeesView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    ReportIndex: () =>
      import(/* webpackChunkName: "ReportIndex" */ '@/components/Report/Index'),
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
          text: this.$t('breadcrumbs.report'),
          disabled: true,
          href: '/report',
        },
      ],
    };
  },
};
</script>
