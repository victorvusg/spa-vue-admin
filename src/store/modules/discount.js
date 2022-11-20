import { privateAxios, defaultPaginationParams } from '@/api/api';
// import moment from 'moment';
import _ from 'lodash';

const defaultState = {
  isEditing: [],
  discounts: null,
  discountInfo: {
    reason: '',
    amount: 0,
    tickets: 0,
  },
};

// actions
const actions = {
  async fetchDiscounts({ commit, dispatch }, params = {}) {
    try {
      const route = process.env.VUE_APP_CLIENT_API_ENDPOINT_DISCOUNT;
      const discountRequest = await privateAxios.get(route, {
        params: { ...defaultPaginationParams, ...params },
      });

      commit('setDiscounts', discountRequest.data.Data);
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async createDiscount({ dispatch }, payload) {
    try {
      const route = process.env.VUE_APP_CLIENT_API_ENDPOINT_DISCOUNT;
      const discountRequest = await privateAxios.post(route, payload);
      if (discountRequest.data.IsSuccess) {
        return Promise.resolve(true);
      }
      return Promise.reject(new Error('fail'));
    } catch (error) {
      console.log(error);
      dispatch('app/updateErrors', error, { root: true });
      return Promise.reject(error);
    }
  },
  updateDiscountInfo({ commit }, payload) {
    commit('updateDiscountInfo', payload);
  },
  resetDiscountInfo({ commit }) {
    commit('updateDiscountInfo', {});
  },
  async updateDiscount({ commit, dispatch }, updateData) {
    const { id, ...payload } = updateData;
    try {
      commit('addToIsEditing', id);
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_DISCOUNT}/${id}`;
      const discountRequest = await privateAxios.put(route, payload);
      if (discountRequest.data.IsSuccess) {
        commit('update', { id, ...payload });
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    } finally {
      commit('removeFromIsEditing', id);
    }
  },
  async deleteDiscount({ commit, dispatch }, item) {
    try {
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_DISCOUNT}/${item.id}`;
      const discountRequest = await privateAxios.delete(route);
      if (discountRequest.data.IsSuccess) {
        commit('delete', item.id);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setDiscounts(state, payload) {
    state.discounts = payload;
  },
  addToIsEditing(state, id) {
    state.isEditing.push(id);
  },
  addNewDiscount(state, discount) {
    state.discounts.push(...discount);
  },
  removeFromIsEditing(state, id) {
    const index = state.isEditing.indexOf(id);
    if (index > -1) {
      state.isEditing.splice(index, 1);
    }
  },
  update(state, payload) {
    const updateItem = _.find(state.discounts, { id: payload.id });
    if (updateItem) {
      Object.assign(updateItem, payload);
    }
  },
  delete(state, id) {
    const deleteIndex = state.discounts.findIndex((item) => item.id === id);
    if (deleteIndex > -1) {
      state.discounts.splice(deleteIndex, 1);
    }
  },
  updateDiscountInfo(state, payload) {
    if (Object.keys(payload).length === 0) {
      state.discountInfo = {};
    } else {
      state.discountInfo = { ...state.discountInfo, ...payload };
    }
  },
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
