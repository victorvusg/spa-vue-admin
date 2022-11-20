import { mapMutations, mapState, mapActions } from 'vuex';

const computed = {
  ...mapState('employee', ['employees']),
  ...mapState('task', ['tasks']),
  ...mapState('reminder', ['reminders']),
};

const methods = {
  ...mapMutations('ask', ['setTasks']),
  ...mapActions('employee', ['fetchEmployees']),
  ...mapActions('reminder', ['fetchReminders']),
  ...mapActions('task', ['fetchTasks', 'removeTaskAssignment', 'createTaskAssignments', 'removeTask', '']),
};

export default {
  computed,
  methods,
};
