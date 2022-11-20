<template>
  <div class="task-management">
    <v-breadcrumbs :items="breadcrumbsItems" class="pl-0" />
    <div class="d-flex align-center justify-space-between mb-4">
      <h3>
        {{ $t('task.title') }}
      </h3>
    </div>
    <v-tabs v-model="tab" align-with-title grow>
      <v-tabs-slider color="primary"></v-tabs-slider>
      <v-tab href="#tab_task_management">Danh sách việc</v-tab>
      <v-tab href="#tab_schedule">Phân Việc</v-tab>
      <v-tab href="#tab_judgement">Đánh giá</v-tab>
    </v-tabs>
    <v-tabs-items v-model="tab" class="pa-4">
      <v-tab-item value="tab_task_management">
        <CreateTaskDialog />
      </v-tab-item>
      <v-tab-item value="tab_schedule">
        <tasks-mobile />
      </v-tab-item>
      <v-tab-item value="tab_judgement">
        <judgement v-if="tab === 'tab_judgement'" />
      </v-tab-item>
    </v-tabs-items>
  </div>
</template>
<script>
import routeHelper from '@/helpers/routeHelper';
import CreateTaskDialog from '@/components/Task/CreateTaskDialog';
import taskMixins from '@/mixins/task.mixins';
import Judgement from '@/components/Judgement/Index';
import TasksMobile from './fragments/TasksMobile';

export default {
  name: 'Task',
  mixins: [taskMixins],
  components: {
    CreateTaskDialog,
    TasksMobile,
    Judgement,
  },
  data() {
    return {
      tab: 'tab_task_management',
      breadcrumbsItems: [
        {
          text: this.$t('breadcrumbs.dashboard'),
          disabled: false,
          href: routeHelper.getPath('Dashboard'),
        },
        {
          text: this.$t('breadcrumbs.tasks'),
          disabled: true,
          href: '/tasks',
        },
      ],
    };
  },
  async created() {
    this.setLoading(true);
    await this.fetchEmployees();
    await this.fetchTasks();
    await this.fetchReminders();
    this.setLoading(false);
  },
};
</script>
<style lang="scss">
.task-management {
  a.v-tab {
    margin-left: unset !important;
  }
}
.chores-table {
  .v-data-table__mobile-table-row {
    .v-data-table__mobile-row {
      border-bottom: thin solid rgba(0, 0, 0, 0.12) !important;

      &:first-child {
        background-color: mistyrose;
        .v-data-table__mobile-row__header {
          display: none;
        }
      }
    }
  }
}
</style>
