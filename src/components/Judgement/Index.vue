<template>
  <CoreTable
    :headers="headers"
    :url="url"
    :extraParams="extraParams"
    :ref="tableRf"
  >
    <template v-slot:item.employee="{ item }">
      <span
        class="font-weight-bold"
        :class="item.point > 0 ? 'green--text' : 'red--text'"
        >{{ item.employee.name }}</span
      >
    </template>
    <template v-slot:item.point="{ item }">
      <span v-if="item.point > 0" class="green--text font-weight-bold">
        Cộng {{ item.point }} điểm
      </span>
      <span v-if="item.point < 0" class="red--text font-weight-bold">
        Trừ {{ item.point * -1 }} điểm
      </span>
      <span v-if="item.point === 0">0</span>
    </template>
    <template v-slot:no-data>
      Không có dữ liệu
    </template>
  </CoreTable>
</template>
<script>
import { privateAxios } from '@/api/api';
import CoreTable from '@/core/components/CoreTable';

export default {
  name: 'JudgementsIndex',
  props: ['employee'],
  components: {
    CoreTable,
  },
  data() {
    return {
      judgements: [],
      tableRf: 'judgementTable',
      url: process.env.VUE_APP_CLIENT_API_ENDPOINT_JUDGEMENTS,
      extraParams: {},
      searchString: '',
      headers: [
        { text: 'Nhân viên', value: 'employee' },
        { text: 'Nội dung đánh giá', value: 'reason' },
        { text: 'Điểm', value: 'point' },
        { text: 'Ngày tạo', value: 'created_at' },
      ],
    };
  },
  methods: {
    async fetchJudgements() {
      this.setLoading(true);
      try {
        const judgementsRequest = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_JUDGEMENTS,
          {
            params: { employee_id: this.employee.id },
          },
        );
        if (judgementsRequest.status === 200) {
          this.judgements = judgementsRequest.data.Data.map((j) => {
            // eslint-disable-next-line camelcase
            const { created_at, ...rest } = j;
            return {
              created_at: this.$options.filters.formatDate(created_at),
              ...rest,
            };
          });
        }
        this.setLoading(false);
      } catch (error) {
        this.setLoading(false);
      }
    },
  },
};
</script>
<style lang="scss" scoped></style>
