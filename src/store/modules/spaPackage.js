import { privateAxios } from '@/api/api';
import { totalPackagePrice } from '@/helpers/intakeHelper';

const defaultState = {
  packs: [],
};

// actions
const actions = {
  async fetchPackages({ commit, dispatch }, queryParamString = null) {
    try {
      let route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST}?per_page=10000`;
      if (queryParamString) route = `${route}&${queryParamString}`;
      const packageListRequest = await privateAxios.get(route);
      if (packageListRequest.status === 200) {
        const packageItems = packageListRequest.data.Data.map((item) => ({
          item,
          id: item.id,
          price: totalPackagePrice(item),
          is_valid: item.is_valid,
          customer: item.customer.name,
        }));
        commit('setPacks', packageItems);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setPacks(state, payload) {
    state.packs = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
