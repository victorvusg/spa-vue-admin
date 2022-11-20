import { privateAxios } from '@/api/api';

const defaultState = {
  tasks: [],
};

// actions
const actions = {
  async fetchTasks({ commit }) {
    try {
      const params = {
        per_page: 10000,
        page: 1,
      };
      const tasksRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK_ASSIGNMENT}`,
        { params },
      );
      if (tasksRequest.data.IsSuccess) {
        commit('setTasks', tasksRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  },
  async removeTask({ commit }, id) {
    try {
      const deleteRequest = await privateAxios.delete(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK}/${id}`,
      );
      if (deleteRequest.data.IsSuccess) {
        commit('setTasks', deleteRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async removeTaskAssignment({ commit }, id) {
    try {
      const deleteRequest = await privateAxios.delete(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK_ASSIGNMENT}/${id}`,
      );
      if (deleteRequest.data.IsSuccess) {
        commit('setTasks', deleteRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createTaskAssignments({ commit }, payload) {
    try {
      const createRequest = await privateAxios.post(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_TASK_ASSIGNMENT}`,
        payload,
      );
      if (createRequest.data.IsSuccess) {
        commit('setTasks', createRequest.data.Data);
      }
    } catch (error) {
      console.log(error);
    }
  },
  async createJudgement({ dispatch }, payload) {
    try {
      await privateAxios.post(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_JUDGEMENTS}`,
        payload,
      );
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setTasks(state, tasks) {
    state.tasks = tasks;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
