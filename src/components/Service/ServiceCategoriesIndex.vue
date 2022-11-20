<template>
  <div>
    <v-data-table :headers="headers" :items="categories">
      <template v-slot:no-data> No service category found </template>
    </v-data-table>
    <div class="d-flex mt-3 justify-end">
      <v-btn color="blue darken-1" dark depressed @click="closeDialog()">
        {{ $t('addNewServiceForm.close') }}
      </v-btn>
    </div>
  </div>
</template>
<script>
import { privateAxios } from '@/api/api';

export default {
  name: 'ServiceCategoriesIndex',
  data() {
    return {
      serviceCategories: [],
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'descriptions' },
      ],
    };
  },
  computed: {
    categories() {
      return this.serviceCategories;
    },
  },
  methods: {
    closeDialog() {
      this.$emit('closeDialog');
    },
    async fetchData() {
      this.setLoading(true);
      try {
        const serviceCategoriesListRequest = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_CATEGORY_LIST,
        );
        if (serviceCategoriesListRequest.status === 200) {
          this.serviceCategories = serviceCategoriesListRequest.data.Data;
        }
      } catch (error) {
        // TODO: error handling
        // console.log(error.toString());
      }
      this.setLoading(true);
    },
  },
  async created() {
    await this.fetchData();
  },
};
</script>
