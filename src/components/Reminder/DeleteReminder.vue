<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <v-icon size="20px" color="error" @click="open" v-bind="attrs"
        >mdi-trash-can</v-icon
      >
    </template>
    <v-card>
      <v-card-title class="text-h5"> Lệnh Xóa </v-card-title>
      <v-card-text>
        <div>Bạn đang xóa nhắc nhở:</div>
        <div class="message-layout">
          <div class="mb-2 text-caption d-flex align-center">
            <v-icon size="15" class="mr-1">mdi-account</v-icon>
            <strong>{{ item.employee.name }}</strong>
          </div>
          <div v-html="item.title"></div>
        </div>
      </v-card-text>
      <v-card-actions class="pt-0">
        <v-spacer></v-spacer>
        <v-btn color="gray darken-1" text @click="dialog = false"> Hủy </v-btn>
        <v-btn color="error" text @click="confirmDelete"> Đồng ý </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'DeleteReminder',
  props: ['item', 'disabled'],

  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    ...mapActions('reminder', ['deleteReminder']),
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
    },
    async confirmDelete() {
      this.setLoading(true);
      this.cancel();
      await this.deleteReminder(this.item);
      this.setLoading(false);
    },
  },
};
</script>
