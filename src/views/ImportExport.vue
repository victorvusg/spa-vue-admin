<template>
  <ViewLayout :viewTitle="$t('services.manage')">
    <ImportExport />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'ServicesView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    ImportExport: () =>
      import(
        /* webpackChunkName: "Warehouse-ImportExport" */ '@/components/Warehouse/ImportExport/ImportExport'
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
          text: this.$t('breadcrumbs.services'),
          disabled: true,
          href: '/services',
        },
      ],
    };
  },
};
</script>
