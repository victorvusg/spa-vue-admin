<template>
  <v-card elevation="0" class="core-table">
    <v-card-title
      class="align-center flex-column flex-sm-row justify-space-between"
    >
      <v-text-field
        v-if="searchable"
        v-model="search"
        prepend-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
        :disabled="isLoading"
      ></v-text-field>
      <slot name="filter" v-bind="{ isLoading, fetchData }"></slot>
      <v-btn
        class="mt-4 mt-sm-0"
        depressed
        color="secondary"
        small
        :block="!$vuetify.breakpoint.smAndUp"
        @click="fetchData"
        :disabled="isLoading"
        ><v-icon small>mdi-refresh</v-icon></v-btn
      >
    </v-card-title>
    <!-- Data List -->
    <template>
      <v-data-table
        :headers="headers"
        :items="items"
        :page.sync="page"
        :loading="isLoading"
        loading-text="Loading... Please wait"
        :items-per-page="itemsPerPage"
        hide-default-footer
        disable-sort
      >
        <template v-slot:body v-if="isLoading">
          <tbody>
            <template v-if="isMobile">
              <tr class="v-data-table__mobile-table-row">
                <td class="v-data-table__mobile-row px-4" />
              </tr>
            </template>
            <template v-else>
              <tr v-for="item in itemsPerPage" :key="item">
                <td v-for="cell in headersLength" :key="`loading_${cell}`">
                  <v-skeleton-loader
                    type="text"
                    boilerplate
                  ></v-skeleton-loader>
                </td>
              </tr>
            </template>
          </tbody>
        </template>
        <template
          v-for="(_, name) in $scopedSlots"
          :slot="name"
          slot-scope="slotData"
        >
          <slot :name="name" v-bind="{ ...slotData, fetchData }" />
        </template>
      </v-data-table>
      <div
        class="d-flex align-center justify-space-between pa-4"
        :class="{ 'flex-column': isMobile }"
      >
        <div>
          Showing {{ from }} {{ $t('to') }} {{ to }} {{ $t('of') }}
          {{ totalItems }}
        </div>
        <v-pagination
          :disabled="isLoading"
          v-model="page"
          @input="pageChange"
          :length="pageCount"
          :total-visible="5"
          circle
          class="core-pagination"
        ></v-pagination>
      </div>
    </template>
  </v-card>
</template>
<script>
import { privateAxios as api } from '@/api/api';
import { debounce } from 'lodash';

export default {
  name: 'CoreTable',
  props: {
    url: {
      default: null,
    },
    searchable: {
      default: false,
    },
    headers: {
      default: () => [],
    },
    extraParams: {
      default: () => {},
    },
    itemsPerPage: {
      default: 10,
    },
  },
  data() {
    return {
      search: '',
      isLoading: true,
      items: [],
      page: 1,
      pageCount: 10,
      totalItems: 0,
    };
  },
  computed: {
    from() {
      return this.itemsPerPage * (this.page - 1) + 1;
    },
    to() {
      return this.page * this.itemsPerPage;
    },
    headersLength() {
      return this.headers.length;
    },
  },
  methods: {
    async fetchData() {
      if (this.isMobile) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth',
        });
      }
      const options = {
        params: {
          per_page: this.itemsPerPage,
          page: this.page,
          ...this.extraParams,
        },
      };
      this.isLoading = true;
      try {
        const response = await api.get(this.url, options);
        if (response.status !== 200) this.items = [];
        const { Data, Pagination } = response.data;
        this.totalItems = Pagination.TotalItems;
        this.pageCount = Math.ceil(Pagination.TotalItems / this.itemsPerPage);
        this.items = Data;
      } catch (err) {
        console.log(err);
      } finally {
        this.isLoading = false;
      }
    },
    pageChange: debounce(async function deb() {
      window.scrollTo({
        top: 0,
        left: 0,
      });
      await this.fetchData();
    }, 500),
  },
  watch: {
    extraParams: debounce(async function deb() {
      if (this.page !== 1) {
        this.page = 1;
      }
      await this.fetchData();
    }, 500),
  },
  async mounted() {
    this.fetchData();
  },
};
</script>
