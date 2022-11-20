import { privateAxios, defaultPaginationParams } from '@/api/api';

const defaultState = {
  orders: [],
};

// actions
const actions = {
  async fetchOrders({ commit, dispatch }, options = null) {
    let customerId = null;
    let filterOptions = null;
    customerId = options && options.customerId ? options.customerId : null;
    // eslint-disable-next-line operator-linebreak
    filterOptions =
      options && options.filterOptions ? options.filterOptions : null;

    try {
      let route = process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST;
      if (customerId) route = `${route}?customer_id=${customerId}`;
      const ordersListRequest = await privateAxios.get(route, {
        params: { ...defaultPaginationParams, ...filterOptions },
      });

      if (ordersListRequest.status === 200) {
        commit('setOrders', ordersListRequest.data.Data);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setOrders(state, payload) {
    state.orders = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
