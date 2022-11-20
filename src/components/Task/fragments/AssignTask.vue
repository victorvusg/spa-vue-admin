<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on, attrs }">
      <v-icon
        v-text="'mdi-plus'"
        color="primary"
        v-bind="attrs"
        v-on="on"
      ></v-icon>
    </template>
    <v-card v-if="dialog">
      <v-card-title>
        <span class="headline">{{ item.name }} - {{ $t(day) }}</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid">
          <v-container>
            <h3 class="mb-2">Phân Công</h3>
            <v-list dense class="py-0" v-if="item.assignments.length">
              <v-list-item
                v-for="(assignment, index) in item.assignments"
                :key="`assignments_${day}_${index}`"
                class="px-0"
              >
                <v-btn
                  icon
                  color="primary"
                  @click="removeTaskAssignment(assignment.id)"
                >
                  <v-icon color="error">mdi mdi-minus-circle</v-icon>
                </v-btn>
                <v-list-item-content>
                  {{ assignment.employee.name }}
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-list dense class="py-0" v-if="schedule.length">
              <v-list-item
                v-for="(assignee, index) in schedule"
                :key="`assignee_${day}_${index}`"
                class="px-0"
              >
                <v-list-item-icon
                  class="mr-2"
                  style="margin: 0px 8px 0px 0px; align-self: unset"
                >
                  <v-btn icon color="primary" @click="remove(index)">
                    <v-icon color="error">mdi mdi-minus-circle</v-icon>
                  </v-btn>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title>
                    <v-select
                      filled
                      class="pt-0 mt-0"
                      hide-details
                      item-color="primary"
                      :items="unassignedEmployees"
                      :menu-props="{ top: false, offsetY: true }"
                      item-text="name"
                      item-value="id"
                      item-disabled="disabled"
                      v-model="assignee.employee_id"
                      :rules="rules.required"
                    >
                      <template slot="selection" slot-scope="data">
                        <!-- HTML that describe how select should render selected items -->
                        <span class="font-weight-bold error--text">
                          {{ data.item.name }}
                        </span>
                      </template>
                      <template slot="item" slot-scope="data">
                        <span
                          :class="{
                            'font-weight-bold error--text':
                              assignee.employee_id === data.item.id,
                          }"
                          >{{ data.item.name }}</span
                        >
                      </template>
                    </v-select>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <div class="text-right">
              <v-btn icon color="primary" @click="add()" :disabled="!isAddAble">
                <v-icon>mdi mdi-plus</v-icon>
              </v-btn>
            </div>
          </v-container>
        </v-form>
        <small>*Không được bỏ trống</small>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" @click="close()"> ĐÓNG </v-btn>
        <v-btn :disabled="!valid" color="primary" @click="assign()">
          PHÂN CÔNG
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import taskMixins from '@/mixins/task.mixins';

export default {
  name: 'AssignTask',
  mixins: [taskMixins],
  props: {
    item: {
      required: true,
      type: Object,
    },
    day: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    valid: true,
    errorMessage: '',
    rules: {
      required: [(v) => !!v || 'Không được để trống'],
    },
    dialog: false,
    schedule: [],
  }),
  computed: {
    isAddAble() {
      return !!this.employees.filter(
        (n) => !this.beingAssignedEmployeeIds.includes(n.id),
      ).length;
    },
    beingAssignedEmployeeIds() {
      const assignedEmployeeId = this.item.assignments.map(
        (i) => i.employee_id,
      );
      const beingAssignedEmployeeId = this.schedule.map((i) => i.employee_id);
      return [...assignedEmployeeId, ...beingAssignedEmployeeId];
    },
    unassignedEmployees() {
      return this.employees.map((n) => ({
        ...n,
        disabled: this.beingAssignedEmployeeIds.includes(n.id),
      }));
    },
  },
  methods: {
    close() {
      this.schedule = [];
      this.dialog = false;
    },
    async assign() {
      try {
        await this.createTaskAssignments({
          name: this.item.name,
          task_id: this.item.id,
          schedule: this.schedule,
        });
        this.dispatch('toast/openToast', {
          color: 'success',
          message: 'Success. Update thành công !',
        });
        this.close();
      } catch (error) {
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Có lỗi xảy ra !',
        });
      }
    },
    add() {
      this.schedule.push({
        day: this.day,
        employee_id: null,
      });
    },
    remove(assignIndex) {
      this.schedule.splice(assignIndex, 1);
    },
  },
};
</script>
