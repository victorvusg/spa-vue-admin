<template>
  <ViewLayout :viewTitle="'Phân công việc'">
    <Tasks />
  </ViewLayout>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';

export default {
  name: 'TasksView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    Tasks: () =>
      import(
        /* webpackChunkName: "TaskIndex" */ '@/components/Task/Tasks'
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
      ],
    };
  },
};
</script>
