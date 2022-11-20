<template>
  <v-dialog
    v-model="dialog"
    persistent
    scrollable
    content-class="admin-dialog"
    max-width="400"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-show="intake.is_valid"
        v-bind="attrs"
        v-on="on"
        block
        elevation="0"
        dark
        color="error"
        >Xem bill</v-btn
      >
    </template>
    <v-card>
      <v-card-title>Phiếu thanh toán</v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 pb-4" style="height: 90vh; overflow-x: hidden">
        <div id="receipt-print">
          <template v-if="dialog">
            <Receipt :intake="intake" :autoPrint="autoPrint" />
          </template>
        </div> </v-card-text
      ><v-divider></v-divider>

      <v-card-actions
        class="d-flex align-center justify-space-between px-4 pb-4"
      >
        <v-btn color="error" dark depressed @click="print" rounded>
          <v-icon class="mr-2">mdi-printer</v-icon>In Lại
        </v-btn>
        <v-btn
          color="error"
          text
          rounded
          dark
          depressed
          @click="dialog = false"
        >
          Đóng
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Receipt from '@/components/Intake/components/Receipt';
import { Printd } from 'printd';

export default {
  name: 'ReceiptModal',
  props: {
    intake: {
      required: true,
    },
  },
  components: {
    Receipt,
  },
  data() {
    return {
      dialog: false,
      autoPrint: false,
      printInstance: null,
      loadingAutoPrint: false,
      cssText: [
        'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
      ],
    };
  },
  methods: {
    openAndPrint() {
      this.dialog = true;
      this.$nextTick(() => {
        this.print();
      });
    },
    print() {
      const printArea = document.getElementById('receipt-print');
      this.printInstance.print(printArea, this.cssText);
    },
  },
  mounted() {
    this.printInstance = new Printd();
    const { contentWindow } = this.printInstance.getIFrame();
    if (contentWindow.matchMedia) {
      const mediaQueryList = contentWindow.matchMedia('print');
      mediaQueryList.addListener((mql) => {
        if (mql.matches) {
          this.loadingAutoPrint = true;
        } else {
          this.loadingAutoPrint = false;
        }
      });
    }
    // if (this.autoPrint) {
    //   this.loadingAutoPrint = true;
    //   this.$nextTick(() => {
    //     this.print();
    //   });
    // }
  },
};
</script>
