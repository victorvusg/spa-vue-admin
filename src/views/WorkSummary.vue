<template>
  <ViewLayout :viewTitle="'Thống kê công việc'">
    <WorkSummary />
  </ViewLayout>
</template>
<script>
export default {
  name: 'CustomerView',
  components: {
    ViewLayout: () =>
      import(/* webpackChunkName: "ViewLayout" */ '@/layout/ViewLayout'),
    WorkSummary: () =>
      import(
        /* webpackChunkName: "WorkSummary" */ '@/components/WorkSummary/Index'
      ),
  },
};
</script>
