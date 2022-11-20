import { privateAxios } from '@/api/api';
import { formatCurrency } from '@/helpers/filters';
const defaultState = {
  combos: [],
  comboDetail: null,
};

// actions
const actions = {
  async fetchCombos({ commit, dispatch }, customerId = null) {
    try {
      let route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_COMBO_LIST}?per_page=10000`;
      if (customerId) route = `${route}&customer_id=${customerId}`;
      const comboListRequest = await privateAxios.get(route);
      if (comboListRequest.status === 200) {
        const comboItems = comboListRequest.data.Data.map((item) => ({
          item,
          id: item.id,
          service: item.variant.service.name,
          price: formatCurrency(item.total_price),
          is_valid: item.is_valid,
          customer: item.customer.name,
          number_used: `${item.number_used} / ${item.amount}`,
        }));
        commit('setCombos', comboItems);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async fetchComboDetail({ commit, dispatch }, comboId) {
    try {
      if (!comboId) throw new Error('no combo id');
      const comboDetailRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_COMBO_LIST}/${comboId}`,
      );

      if (comboDetailRequest.status === 200) {
        const comboDetail = comboDetailRequest.data.Data;
        commit('setComboDetail', comboDetail);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setCombos(state, payload) {
    state.combos = payload;
  },
  setComboDetail(state, payload) {
    state.comboDetail = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
