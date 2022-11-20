<template>
  <v-dialog
    v-model="status"
    max-width="480"
    persistent
    scrollable
    content-class="admin-dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="info" depressed text small v-bind="attrs" v-on="on">
        Xem
      </v-btn>
    </template>
    <v-card v-if="status">
      <v-card-title>
        Phiếu thanh toán
        <span
          class="ml-1 red--text"
          v-if="invoice.type === 'deposit' && invoice.status === 'pending'"
          >( Chưa xác thực )</span
        >
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text class="px-4 pb-4" style="height: 90vh; overflow-x: hidden">
        <ReceiptDetail :invoice="invoice" ref="invoiceDetailRef" />
        <div class="my-2">
          <div class="subtitle-2 grey--text text--darken-1">
            Hình thức thanh toán:
          </div>
          <UpdatePaymentMethod
            :id="invoice.id"
            v-model="invoice.payment_method_id"
            :api-url="'api/v1/invoice'"
            :payment-field="'payment_method_id'"
          />
        </div>
      </v-card-text>

      <v-divider></v-divider>
      <v-card-actions
        class="d-flex align-center justify-space-between px-4 pb-4"
      >
        <v-btn
          color="error"
          dark
          depressed
          @click="deleteInvoice()"
          v-if="invoice.type === 'deposit' && invoice.status === 'pending'"
        >
          HỦY
        </v-btn>
        <v-btn
          color="error"
          dark
          depressed
          @click="printBill()"
          rounded
          v-if="invoice.status !== 'pending'"
        >
          <v-icon class="mr-2">mdi-printer</v-icon>In Lại
        </v-btn>
        <v-btn
          class="ml-auto"
          color="error"
          text
          rounded
          dark
          depressed
          @click="status = false"
        >
          ĐÓNG
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import ReceiptDetail from '@/components/Invoices/Detail/Receipt';
import { privateAxios } from '@/api/api';
import UpdatePaymentMethod from '@/components/Shared/UpdatePaymentMethod';

export default {
  name: 'DetailModal',
  props: {
    invoiceProps: {
      require: false,
    },
  },
  components: {
    ReceiptDetail,
    UpdatePaymentMethod,
  },
  created() {
    this.invoice = { ...this.invoiceProps };
  },
  data() {
    return {
      invoice: null,
      status: false,
    };
  },
  methods: {
    printBill() {
      this.$refs.invoiceDetailRef.print();
    },
    closeDialog() {
      this.status = false;
    },
    async verifiyInvoice() {
      this.setLoading(true);
      try {
        const request = await privateAxios.put(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INVOICE_LIST}/approve/${this.invoice.id}`,
        );
        const result = request.data.Data;
        this.invoice.status = result.status;
        this.invoice.updated_ay = result.updated_at;
        this.$nextTick(() => {
          this.$refs.invoiceDetailRef.print();
        });
        this.status = false;
        this.setLoading(false);
        this.$emit('reload-list');
      } catch (error) {
        console.log(error);
        this.setLoading(false);
        throw error;
      }
    },
    async deleteInvoice() {
      this.setLoading(true);
      try {
        await privateAxios.delete(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INVOICE_LIST}/${this.invoice.id}`,
        );
        this.status = false;
        this.setLoading(false);
        this.$emit('reload-list');
      } catch (error) {
        console.log(error);
        this.setLoading(false);
        throw error;
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
