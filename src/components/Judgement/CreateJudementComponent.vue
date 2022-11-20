<template>
  <v-dialog
    v-model="dialog"
    :fullscreen="!$vuetify.breakpoint.smAndUp"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon class="mr-2" v-bind="attrs" v-on="on">
        <v-icon v-text="'mdi-clipboard-alert'" color="red"></v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar dark color="primary">
        <v-toolbar-title></v-toolbar-title>
        <v-spacer>Đánh giá chuyên cần nhân viên</v-spacer>
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-container fluid>
        <v-text-field
          :value="employee.name"
          disabled
          label="Tên"
        ></v-text-field>

        <h4 class="mb-2">CHỌN ĐÁNH GIÁ</h4>

        <v-card max-height="600" style="overflow-y: scroll" class="pa-2">
          <v-checkbox
            v-for="(judgement, index) in judgementConfigs"
            :key="judgement.id"
            v-model="selected"
            :label="judgement.name"
            :value="index"
          >
            <template v-slot:label>
              <span
                >{{ judgement.name }}
                <span class="error--text ml-1">
                  ({{ judgement.value }} điểm)
                </span>
              </span>
            </template>
          </v-checkbox>
        </v-card>
        <v-row class="my-4">
          <v-col cols="6">
            <v-btn color="error" block @click="selected = []">
              Khôi Phục
            </v-btn>
          </v-col>
          <v-col cols="6">
            <v-btn
              color="success"
              :disabled="!selected.length"
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
import { mapGetters } from 'vuex';

export default {
  name: 'CreateJudementComponent',
  props: ['employee'],
  data: () => ({
    dialog: false,
    selected: [],
  }),
  computed: {
    ...mapGetters('configs', ['judgementConfigs']),
    payload() {
      if (!this.selected.length) return [];
      return this.selected.map((jIndex) => ({
        employee_id: this.employee.id,
        reason: this.judgementConfigs[jIndex].name,
        point: this.judgementConfigs[jIndex].value,
      }));
    },
  },
  methods: {
    submit() {
    },
  },
};
</script>
<style lang="scss">
</style>
