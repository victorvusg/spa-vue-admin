<template>
  <div>
    <div style="font-size: 14px">
      <div>
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
          <span>SỐ XU THANH TOÁN</span>
          <span
            v-if="intakeValid"
            style="font-weight: 700; text-transform: capitalize;"
          >
            {{ invoice.amount | coin}}
          </span>
          <span
            v-else
            style="font-weight: 700; text-transform: capitalize;"
          >
            {{ paidAmount | coin}}
          </span>
        </div>
        <div style="padding: 8px" v-if="invoice.note">
          <p style="margin-bottom: 2px">GHI CHÚ</p>
          <p style="white-space: pre-line; font-size: 12px">
            {{ invoice.note }}
          </p>
        </div>
      </div>
      <!-- <div
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
      </div> -->
    </div>
  </div>
</template>
<script>

export default {
  name: 'InvoiceCard',
  props: {
    invoice: {
      required: true,
    },
    intakeValid: {
      default: true,
    },
    paidAmount: {
      default: 0,
    },
  },
};
</script>
<style></style>
