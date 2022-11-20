import { privateAxios, defaultPaginationParams } from '@/api/api';

const defaultState = {
  customers: [],
  ranks: [],
  customerDetail: null,
};

// actions
const actions = {
  async fetchCustomers({ commit, dispatch }) {
    try {
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_CUSTOMER_LIST}`;
      const customerListRequest = await privateAxios.get(route, {
        params: defaultPaginationParams,
      });

      if (customerListRequest.status === 200) {
        const customerList = customerListRequest.data.Data;
        commit('setCustomers', customerList);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async fetchCustomerDetail({ commit, dispatch }, customerid) {
    try {
      if (!customerid) throw new Error('no customer id');
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_CUSTOMER_LIST}/${customerid}`;
      const customerDetailRequest = await privateAxios.get(route);

      if (customerDetailRequest.status === 200) {
        const customerDetail = customerDetailRequest.data.Data;
        commit('setCustomerDetail', customerDetail);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async fetchRanks({ commit, dispatch }) {
    try {
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_RANK}`;
      const customerListRequest = await privateAxios.get(route, {
        params: defaultPaginationParams,
      });

      if (customerListRequest.status === 200) {
        const customerList = customerListRequest.data.Data;
        commit('setRanks', customerList);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setCustomers(state, payload) {
    state.customers = payload;
  },
  setCustomerDetail(state, payload) {
    state.customerDetail = payload;
  },
  setRanks(state, payload) {
    state.ranks = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
