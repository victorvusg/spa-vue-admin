<template>
  <v-dialog v-model="dialog" persistent max-width="290">
    <template v-slot:activator="{ on, attrs }">
      <!-- <v-btn
        class="px-0"
        color="error"
        text
        x-small
        v-bind="attrs"
        @click="open"
        :disabled="disabled"
      >
        Xóa
      </v-btn> -->
      <v-icon size="20px" color="error" @click="open" v-bind="attrs"
        >mdi-trash-can</v-icon
      >
    </template>
    <v-card>
      <v-card-title class="text-h5"> Lệnh Xóa </v-card-title>
      <v-card-text>
        <div>Bạn đang xóa chương trình giảm giá:</div>
        <div style="background-color: #f5f5f5" class="pa-4">
          {{ item.name }}
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
  name: 'DeleteDiscount',
  props: ['item', 'disabled'],

  data() {
    return {
      dialog: false,
    };
  },
  methods: {
    ...mapActions('discount', ['deleteDiscount']),
    open() {
      this.dialog = true;
    },
    cancel() {
      this.dialog = false;
    },
    async confirmDelete() {
      this.setLoading(true);
      this.cancel();
      await this.deleteDiscount(this.item);
      this.setLoading(false);
    },
  },
};
</script>
