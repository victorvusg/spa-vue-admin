<template>
  <ReceiptLayout id="receipt-print">
    <div style="padding: 8px">
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>KHÁCH HÀNG</span>
        <span style="font-weight: 700; text-transform: capitalize">
          {{ invoice.customer.name }}
        </span>
      </div>
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>TẠO ĐƠN</span>
        <span style="font-weight: 700; text-transform: capitalize">
          {{ invoice.employee.name }}
        </span>
      </div>
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>THU NGÂN</span>
        <span style="font-weight: 700; text-transform: capitalize">
          {{ cashierName }}
        </span>
      </div>
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>NGÀY</span>
        <span
          style="font-weight: 700; text-transform: capitalize; color: black"
        >
          {{ invoice.created_at | formatDate }}
        </span>
      </div>
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>LOẠI GIAO DỊCH</span>
        <span
          style="font-weight: 700; text-transform: capitalize; color: black"
        >
          {{
            invoice.type === 'withdraw' && invoice.note === 'cashout'
              ? 'Rút xu'
              : $t(invoice.type)
          }}
        </span>
      </div>
      <div
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>SỐ XU</span>
        <span
          style="font-weight: 700; text-transform: capitalize; color: black"
        >
          {{ invoice.amount | coin }}
        </span>
      </div>
      <div
        v-if="invoice.promotion_amount"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>SỐ XU ĐƯỢC TẶNG</span>
        <span
          style="font-weight: 700; text-transform: capitalize; color: black"
        >
          {{ invoice.promotion_amount | coin }}
        </span>
      </div>
      <div
        v-if="invoice.type === 'deposit'"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>THÀNH TIỀN MẶT</span>
        <span style="font-weight: 700; text-transform: capitalize">
          {{ invoice.amount | currency }}
        </span>
      </div>
      <div
        v-if="invoice.type === 'deposit' && invoice.status === 'paid'"
        style="
          display: flex;
          align-item: center;
          justify-content: space-between;
          padding: 8px;
          border: solid;
          border-color: rgba(0, 0, 0, 0.12);
          border-width: 0 0 thin 0;
        "
      >
        <span>SỐ DƯ VÍ HIỆN TẠI</span>
        <span style="font-weight: 700; text-transform: capitalize">
          {{ invoice.customer.balance | coin }}
        </span>
      </div>
      <div style="padding: 8px" v-if="invoice.note !== 'cashout'">
        <p style="margin-bottom: 2px">GHI CHÚ</p>
        <p style="white-space: pre-line; font-size: 12px">
          {{ invoice.note }}
        </p>
      </div>
    </div>
    <div
      v-if="invoice.signature"
      style="
        display: flex;
        align-items: flex-end;
        flex-direction: column;
        justify-content: center;
        padding: 8px 10px;
        font-size: 16px;
      "
    >
      <span>CHỮ KÝ KHÁCH HÀNG</span>
      <img :src="invoice.signature" width="150px" height="auto" />
    </div>
  </ReceiptLayout>
</template>
<script>
import { Printd } from 'printd';
import ReceiptLayout from '@/layout/ReceiptLayout';

export default {
  name: 'InvoiceDetail',
  components: {
    ReceiptLayout,
  },
  props: {
    invoice: {
      required: true,
    },
  },
  data() {
    return {
      printInstance: null,
      loadingAutoPrint: false,
      cssText: [
        'https://cdn.jsdelivr.net/npm/vuetify@2.x/dist/vuetify.min.css',
      ],
    };
  },
  methods: {
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
  },
};
</script>
<style></style>
