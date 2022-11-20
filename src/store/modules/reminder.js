import { privateAxios } from '@/api/api';

const defaultState = {
  reminders: [],
};

// actions
const actions = {
  async fetchReminders({ commit }) {
    try {
      const params = {
        per_page: 10000,
        page: 1,
      };
      const tasksRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_REMINDER}`,
        { params },
      );
      if (tasksRequest.data.IsSuccess) {
        commit('setReminders', tasksRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async deleteReminder({ commit, dispatch }, item) {
    try {
      const route = `${process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK_ASSIGNMENT}/${item.id}`;
      const discountRequest = await privateAxios.delete(route);
      if (discountRequest.data.IsSuccess) {
        commit('delete', item.id);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async createReminder({ commit }, payload) {
    try {
      const createRequest = await privateAxios.post(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_REMINDER}`,
        payload,
      );
      if (createRequest.data.IsSuccess) {
        commit('setReminders', createRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
    }
  },
};

// mutations
const mutations = {
  setReminders(state, reminders) {
    state.reminders = reminders;
  },
  delete(state, id) {
    const deleteIndex = state.reminders.findIndex((item) => item.id === id);
    if (deleteIndex > -1) {
      state.reminders.splice(deleteIndex, 1);
    }
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
