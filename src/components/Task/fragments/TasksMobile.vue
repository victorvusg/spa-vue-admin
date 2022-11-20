<template>
  <div>
    <v-stepper alt-labels class="weekdays-stepper mb-4" v-model="currentDay">
      <v-stepper-header>
        <v-stepper-step
          v-for="day in dd"
          :step="day"
          @click="currentDay = day"
          color="primary"
          :key="`daysofWeek_${day}`"
          style="cursor: pointer"
        >
          {{ $t(`${DD[day]}`) }}
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>
    <v-data-iterator
      :items="listOfChores"
      :search="search"
      :footer-props="{
        itemsPerPageText: 'Per Page',
      }"
    >
      <template v-slot:header>
        <v-text-field
          solo
          flat
          clearable
          outlined
          v-model="search"
          class="error-message-hidden"
          label="Tìm công việc"
        ></v-text-field>
        <h3 class="my-2 primary--text">Danh sách phân công</h3>
      </template>
      <template v-slot:default="props">
        <masonry :cols="{ default: 3, 600: 1, 1024: 2 }" gutter="15">
          <div v-for="item in props.items" :key="item.id">
            <v-card
              class="mb-4"
              elevation="0"
              style="border: 1px solid #699e3c"
            >
              <v-card-title
                class="subheading font-weight-bold d-flex align-center justify-space-between"
              >
                <span class="task-name">{{ item.name }}</span>
                <AssignTask :item="item" :day="DD[currentDay]" />
              </v-card-title>
              <v-divider></v-divider>

              <v-list dense v-if="item.assignments.length">
                <v-list-item
                  v-for="(each, index) in item.assignments"
                  :key="index"
                >
                  <v-btn
                    icon
                    class="mr-2"
                    @click="removeTaskAssignment(each.id)"
                  >
                    <v-icon v-text="'mdi-minus-circle'" color="red"></v-icon>
                  </v-btn>
                  <v-list-item-content>
                    {{ each.employee.name }}
                  </v-list-item-content>
                  <TaskJudementComponent
                    :employee="each.employee"
                    :taskName="item.name"
                    v-if="loggedRole === 'admin' || loggedRole === 'supervisor'"
                  />
                </v-list-item>
              </v-list>
              <v-list v-else>
                <v-list-item>
                  <v-list-item-content class="error--text">
                    Chưa có người làm
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </v-card>
          </div>
        </masonry>
      </template>
      <template v-slot:no-results>
        <div class="px-4 d-flex align-center justify-center">
          Không tìm thấy công việc
        </div>
      </template>
      <template v-slot:no-data>
        <div class="px-4 d-flex align-center justify-center">
          Chưa có danh sách công việc
        </div>
      </template>
    </v-data-iterator>
  </div>
</template>
<script>
import taskMixins from '@/mixins/task.mixins';
import AssignTask from '@/components/Task/fragments/AssignTask';
import TaskJudementComponent from '@/components/Judgement/TaskJudementComponent';
import moment from 'moment';

export default {
  name: 'TasksMobile',
  mixins: [taskMixins],
  components: {
    AssignTask,
    TaskJudementComponent,
  },
  data() {
    return {
      search: '',
      currentDay: 'T2',
      dd: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
      DD: {
        T2: 'mon',
        T3: 'tue',
        T4: 'wed',
        T5: 'thu',
        T6: 'fri',
        T7: 'sat',
        CN: 'sun',
      },
    };
  },
  computed: {
    listOfChores() {
      const currentDD = this.DD[this.currentDay];
      return this.tasks.map((task) => {
        const { id, name } = task;
        return {
          id,
          name,
          assignments: task[currentDD] || [],
        };
      });
    },
  },
  created() {
    const today = moment().day();
    this.currentDay = this.$t(`daysOfWeek.DAY_${today}`);
  },
};
</script>
<style lang="scss">
.weekdays-stepper {
  box-shadow: unset !important;
  background: transparent !important;
  .v-stepper__header {
    box-shadow: unset !important;
  }
  .v-stepper__step {
    flex-basis: unset !important;
    padding: 0px !important;
  }
}
.task-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: calc(100% - 24px);
}
</style>
