<template>
  <ViewLayout :viewTitle="'Danh sách kỹ thuật viên'">
    <EmployeeIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'EmployeesView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    EmployeeIndex: () =>
      import(
        /* webpackChunkName: "EmployeeIndex" */ '@/components/Employee/Index'
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
          text: this.$t('breadcrumbs.employees'),
          disabled: true,
          href: '/employees',
        },
      ],
    };
  },
};
</script>
