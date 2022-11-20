<template>
  <v-dialog
    persistent
    :max-width="$vuetify.breakpoint.smAndUp ? 600 : null"
    v-model="dialog"
    :fullscreen="!$vuetify.breakpoint.smAndUp"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="mr-2" v-bind="attrs" @click="openDialog">
        <v-icon v-text="'mdi-clipboard-alert'" color="red"></v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title></v-toolbar-title>
        <v-spacer>Đánh giá chuyên cần nhân viên</v-spacer>
        <v-btn icon dark @click="close()">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <div>
          <div class="caption gray--text">Tên</div>
          <div classs="subtitle-1">{{ employee.name }}</div>
        </div>
        <v-row
          v-for="(item, index) in payload"
          :key="index"
          style="border-bottom: 1px solid rgb(0 0 0 / 15%)"
        >
          <v-col cols="9">
            <v-textarea
              background-color="amber lighten-4"
              class="error-message-hidden"
              v-model="item.reason"
              label="Nội dung đánh giá"
              auto-grow
              rows="1"
              filled
              dense
            ></v-textarea>
          </v-col>
          <v-col cols="3" class="d-flex align-center">
            <v-text-field
              class="error-message-hidden"
              filled
              v-model="item.point"
              type="number"
            ></v-text-field>
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-btn
              dense
              color="error"
              small
              block
              @click="payload.splice(index, 1)"
              >Xóa</v-btn
            >
          </v-col>
        </v-row>
        <div class="text-right">
          <v-btn icon color="primary" @click="add()">
            <v-icon>mdi mdi-plus</v-icon>
          </v-btn>
        </div>
        <v-row class="mt-2">
          <v-col cols="12" sm="2" offset-sm="10">
            <v-btn
              color="success"
              :disabled="!payload.length"
              block
              @click="submit"
            >
              Xong
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>
<script>
// import { publicAxios, privateAxios } from '@/api/api';
import { mapActions } from 'vuex';

export default {
  name: 'TaskJudementComponent',
  props: ['employee', 'taskName'],
  data: () => ({
    dialog: false,
    payload: [],
  }),
  methods: {
    ...mapActions('task', ['createJudgement']),
    openDialog() {
      this.payload = [];
      this.payload.push({
        employee_id: this.employee.id,
        reason: `Chưa hoàn thành tốt việc "${this.taskName}"`,
        point: -1,
      });
      this.dialog = true;
    },
    add() {
      this.payload.push({
        employee_id: this.employee.id,
        reason: '',
        point: 0,
      });
    },
    close() {
      this.dialog = false;
      this.payload = [];
    },
    async submit() {
      try {
        const judgements = this.payload.map((p) => {
          // eslint-disable-next-line camelcase
          const { reason, point, employee_id } = p;
          return { employee_id, point, reason };
        });
        await this.createJudgement(judgements);
        document.getElementById('app').scrollTop = 0;
        this.dialog = false;
        this.dispatch('toast/openToast', {
          color: 'success',
          message: 'Success. Đánh giá thành công',
        });
      } catch (err) {
        console.log(err);
        this.dialog = false;
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Có lỗi xảy ra !',
        });
      }
    },
  },
};
</script>
<style lang="scss">
.close-arlert {
  position: absolute !important;
  top: 50%;
  right: 0;
  transform: translate(-50%, -50%);
}
</style>
