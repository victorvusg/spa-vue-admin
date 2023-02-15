<template>
  <div>
    <div class="d-flex align-center justify-end">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
        fullscreen
        transition="dialog-bottom-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            style="float: right"
            color="primary"
            :block="!$vuetify.breakpoint.smAndUp"
            dark
            v-bind="attrs"
            v-on="on"
          >
            + Tạo Công Việc
          </v-btn>
        </template>
        <v-card style="position: relative">
          <v-card-title
            class="d-flex align-center justify-space-between pa-2"
            style="
              position: sticky;
              top: 0;
              background: white;
              z-index: 1;
              border-bottom: thin rgba(0, 0, 0, 0.12) solid;
            "
          >
            <v-btn text @click="close()" color="primary" small> Đóng </v-btn>
            <span class="headline">Chi Tiết Công Việc</span>
            <v-btn
              text
              color="primary"
              small
              :disabled="!valid"
              @click="createTask"
            >
              + Tạo
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid">
              <v-container>
                <div>
                  <h3 class="mb-2">Tên công việc</h3>
                  <v-text-field
                    outlined
                    color="primary"
                    v-model="name"
                    class="pt-0 font-weight-bold"
                    :rules="rules.required"
                  ></v-text-field>
                </div>
                <h3 class="my-2">Phân Công</h3>
                <v-card
                  style="border: 1px solid #699e3c; position: relative"
                  elevation="0"
                  v-for="(day, index) in days"
                  :key="`day_${day.value}`"
                  class="pa-4"
                  :class="{ 'mb-4': index !== days.length - 1 }"
                >
                  <h4>{{ $t(day.value) }}</h4>
                  <v-list dense class="py-0">
                    <v-list-item
                      v-for="(assignment, assignIndex) in day.assignments"
                      :key="`assignment_${day.value}_${assignIndex}`"
                      class="px-0"
                    >
                      <v-list-item-icon
                        class="mr-2"
                        style="margin: 0px 8px 0px 0px; align-self: unset"
                      >
                        <v-btn
                          icon
                          color="primary"
                          @click="remove(index, assignIndex)"
                        >
                          <v-icon color="error">mdi mdi-minus-circle</v-icon>
                        </v-btn>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>
                          <v-select
                            class="pt-0 mt-0"
                            item-color="primary"
                            :items="employees"
                            :menu-props="{ top: false, offsetY: true }"
                            item-text="name"
                            item-value="id"
                            v-model="assignment.employee_id"
                            :rules="rules.requried"
                            hide-details
                            filled
                          >
                            <template slot="selection" slot-scope="data">
                              <!-- HTML that describe how select should render selected items -->
                              <span
                                class="font-weight-bold error--text"
                                style="font-size: 12px"
                              >
                                {{ data.item.name }}
                              </span>
                            </template>
                            <template slot="item" slot-scope="data">
                              <span
                                style="font-size: 12px"
                                :class="{
                                  'font-weight-bold error--text':
                                    assignment.employee_id === data.item.id,
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
                    <v-btn icon color="primary" @click="add(index, day.value)">
                      <v-icon>mdi mdi-plus</v-icon>
                    </v-btn>
                  </div>
                </v-card>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>
    <v-data-iterator
      :items="tasks"
      :search="search"
      class="mt-4"
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
        <h3 class="my-2 primary--text">Danh sách công việc</h3>
      </template>
      <template v-slot:default="props">
        <v-list dense>
          <template v-for="item in props.items">
            <v-list-item class="px-0" :key="item.id">
              <v-btn icon class="mr-2" @click="removeTask(item.id)">
                <v-icon v-text="'mdi-minus-circle'" color="red"></v-icon>
              </v-btn>
              <v-list-item-content>
                {{ item.name }}
              </v-list-item-content>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
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
import { mapState } from 'vuex';
import { privateAxios } from '@/api/api';
import taskMixins from '@/mixins/task.mixins';

const initialData = () => ({
  search: '',
  valid: true,
  errorMessage: '',
  rules: {
    required: [(v) => !!v || 'Không được để trống'],
  },
  dialog: false,
  name: '',
  days: [
    { value: 'mon', assignments: [] },
    { value: 'tue', assignments: [] },
    { value: 'wed', assignments: [] },
    { value: 'thu', assignments: [] },
    { value: 'fri', assignments: [] },
    { value: 'sat', assignments: [] },
    { value: 'sun', assignments: [] },
  ],
});
export default {
  name: 'CreateTaskDialog',
  mixins: [taskMixins],
  data: () => initialData(),
  computed: {
    ...mapState('employee', ['employees']),
    ...mapState('statistic', ['statistic']),
  },
  methods: {
    close() {
      Object.assign(this.$data, initialData());
    },
    add(index, day) {
      this.days[index].assignments.push({
        day,
        employee_id: null,
      });
    },
    remove(dayIndex, assignIndex) {
      this.days[dayIndex].assignments.splice(assignIndex, 1);
    },
    async createTask() {
      this.setLoading(true);
      try {
        const schedule = this.days.reduce((data, currentDay) => {
          data.push(...currentDay.assignments);
          return data;
        }, []);
        const createTaskRequest = await privateAxios.post(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK,
          { schedule, name: this.name },
        );
        if (createTaskRequest.data.IsSuccess) {
          this.setTasks(createTaskRequest.data.Data);
          this.close();
        }
      } catch (error) {
        console.log(error);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Có lỗi xảy ra !',
        });
      } finally {
        this.setLoading(false);
      }
    },
  },
};
</script>
