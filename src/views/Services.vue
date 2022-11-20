<template>
  <ViewLayout :viewTitle="$t('services.manage')">
    <ServiceIndex />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'ServicesView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    ServiceIndex: () =>
      import(
        /* webpackChunkName: "ServiceIndex" */ '@/components/Service/Index'
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
