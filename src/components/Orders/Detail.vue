<template>
  <v-dialog
    v-model="dialog"
    max-width="480"
    persistent
    scrollable
    content-class="admin-dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" dark v-bind="attrs" v-on="on" text>
        Chi tiết
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="pb-0 pt-4 px-4">Chi tiết</v-card-title>
      <v-card-text class="pa-4">
        <SingleTicket :order="item" />
      </v-card-text>
      <v-card-actions class="pt-0 pb-4 px-4">
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="close"> Đóng </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SingleTicket from '@/components/Intake/components/SingleTicket';
import { parseNote } from '@/helpers/intakeHelper';

export default {
  name: 'OrderDetail',
  components: {
    SingleTicket,
  },
  props: {
    order: {
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
    };
  },
  computed: {
    item() {
      return {
        ...this.order,
        note: parseNote(this.order.note),
      };
    },
  },
  methods: {
    close() {
      this.dialog = false;
    },
  },
};
</script>
