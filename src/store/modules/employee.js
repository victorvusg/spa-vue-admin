import { privateAxios } from '@/api/api';
import moment from 'moment';

const defaultState = {
  employees: [],
  employeeDetail: null,
};

// actions
const actions = {
  async fetchEmployees({ commit, dispatch }) {
    try {
      const employeeListRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEE_LIST}`,
        { params: { roleId: 2, per_page: 10000 } },
      );

      if (employeeListRequest.status === 200) {
        const employeeList = employeeListRequest.data.Data;
        commit('setEmployees', employeeList);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async fetchEmployeeDetail({ commit, dispatch }, employeeId) {
    try {
      if (!employeeId) throw new Error('no employee id');
      const employeeDetailRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_EMPLOYEE_LIST}/${employeeId}?show_commission=1&show_point=1`,
      );

      if (employeeDetailRequest.status === 200) {
        const employeeDetail = employeeDetailRequest.data.Data;
        const tasksRequest = privateAxios.get(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_ORDERS_LIST}`,
          {
            params: {
              employee_id: employeeDetail.id,
              is_valid: 1,
              page: 1,
              from_date: moment()
                .startOf('month')
                .subtract(1, 'months')
                .format('YYYY-MM-DD hh:mm:ss'),
              per_page: 100000,
            },
          },
        );
        const comboRequest = privateAxios.get(
          `${process.env.VUE_APP_CLIENT_API_ENDPOINT_PACKAGE_LIST}`,
          {
            params: {
              employee_id: employeeDetail.id,
              is_valid: 1,
              perPage: 10000,
              page: 1,
            },
          },
        );
        const requestHandler = await Promise.all([tasksRequest, comboRequest]);
        const tasksResult = requestHandler[0];
        const comboResult = requestHandler[1];

        if (tasksResult.data.Data) {
          employeeDetail.tasks = tasksResult.data.Data;
        }
        if (comboResult.data.Data) {
          employeeDetail.combos = comboResult.data.Data;
        }
        commit('setEmployeeDetail', employeeDetail);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
};

// mutations
const mutations = {
  setEmployees(state, payload) {
    state.employees = payload;
  },
  setEmployeeDetail(state, payload) {
    state.employeeDetail = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
