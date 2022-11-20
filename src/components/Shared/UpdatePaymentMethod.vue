<template>
  <v-radio-group
    class="mt-0"
    hide-details
    :value="model"
    @change="updatePaymentMethod"
  >
    <v-row class="mx-n2">
      <v-col
        cols="6"
        class="pa-2"
        v-for="paymentMethod in paymentOptions"
        :key="paymentMethod.value"
      >
        <v-radio :value="paymentMethod.value">
          <template v-slot:label>
            <div>
              {{ $t(paymentMethod.text) }}
            </div>
          </template>
        </v-radio>
      </v-col>
    </v-row>
  </v-radio-group>
</template>
<script>
import { privateAxios } from '@/api/api';
import { mapState } from 'vuex';

export default {
  name: 'UpdatePaymentMethod',
  props: {
    id: {
      required: true,
    },
    model: {
      type: String || Object,
      default: null,
    },
    paymentField: {
      required: true,
    },
    apiUrl: {
      type: String,
      default: '',
    },
  },
  model: {
    prop: 'model',
    event: 'change',
  },
  computed: {
    ...mapState('app', ['paymentMethods']),
    paymentOptions() {
      return this.paymentMethods.reduce((methods, m) => {
        if (m.id !== 'credit') methods.push({ value: m.id, text: m.id });
        return methods;
      }, []);
    },
  },
  methods: {
    async updatePaymentMethod(method) {
      try {
        this.setLoading(true);
        const response = await privateAxios.put(`${this.apiUrl}/${this.id}`, {
          [this.paymentField]: method,
        });
        if (response.status === 200) {
          this.$emit('change', method);
          this.dispatch('toast/openToast', {
            color: 'success',
            message: 'Cập nhật thành công',
          });
        }
        this.setLoading(false);
      } catch (error) {
        console.log(error);
        this.setLoading(false);
        this.dispatch('toast/openToast', {
          color: 'error',
          message: 'Cập nhật thất bại',
        });
      }
    },
  },
};
</script>
