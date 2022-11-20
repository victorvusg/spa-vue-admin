<template>
  <v-dialog
    v-model="dialog"
    persistent
    max-width="400"
    eager
    scrollable
    content-class="admin-dialog"
  >
    <v-card>
      <v-card-title class="d-flex align-center justify-center">
        <span class="headline font-weight-bold"> In hoá đơn </span>
      </v-card-title>
      <v-divider />
      <v-card-text id="receipt-print" style="padding: 10px; font-size: 14px">
        <PackageReceipt :pack="pack" />
      </v-card-text>
      <v-divider />
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
import { Printd } from 'printd';
import PackageReceipt from '@/components/Package/PackageReceipt/PackageReceipt';

export default {
  name: 'PackageReceiptDialog',
  components: {
    PackageReceipt,
  },
  props: {
    pack: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      cssText: [
        'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
      ],
      loadingAutoPrint: false,
      printInstance: null,
    };
  },
  methods: {
    open() {
      this.dialog = true;
    },
    print() {
      const printArea = document.getElementById('receipt-print');
      this.$nextTick(() => {
        this.printInstance.print(printArea, this.cssText);
      });
    },
    init() {
      this.printInstance = new Printd();
      // const { contentWindow } = this.printInstance.getIFrame();
      // if (contentWindow.matchMedia) {
      //   const mediaQueryList = contentWindow.matchMedia('print');
      //   mediaQueryList.addListener((mql) => {
      //     if (mql.matches) {
      //       this.loadingAutoPrint = true;
      //     } else {
      //       this.loadingAutoPrint = false;
      //     }
      //   });
      // }
    },
  },
  mounted() {
    this.init();
  },
};
</script>
