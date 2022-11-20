import { privateAxios } from '@/api/api';
// import moment from 'moment';
// import _ from 'lodash';
/* eslint-disable camelcase */

const defaultState = {
  configs: [],
};
const getters = {
  judgementConfigs(state) {
    if (!state.configs.length) return [];
    return state.configs.filter(
      (conf) => conf.config_category.name === 'judgement',
    );
  },
};
// actions
const actions = {
  async fetchConfigs({ commit, dispatch }) {
    try {
      const configsRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_CONFIGS}`,
        { params: { category: 'judgement' } },
      );

      if (configsRequest.status === 200) {
        const configs = configsRequest.data.Data;
        commit('setConfigs', configs);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setConfigs(state, payload) {
    state.configs = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
  getters,
};
