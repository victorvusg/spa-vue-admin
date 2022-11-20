import { privateAxios } from '@/api/api';

const defaultState = {
  statistic: null,
};

// actions
const actions = {
  async fetchStatistic({ commit, dispatch }) {
    try {
      const statisticRequest = await privateAxios.get(
        process.env.VUE_APP_CLIENT_API_ENDPOINT_STATISTIC,
      );

      if (statisticRequest.status === 200) {
        const statisticDetail = statisticRequest.data.Data;
        commit('setStatistic', statisticDetail);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setStatistic(state, payload) {
    state.statistic = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
