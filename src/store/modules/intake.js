import { privateAxios, defaultPaginationParams } from '@/api/api';
import { mapIntakeFunc } from '@/helpers/intakeHelper';
import moment from 'moment';
import IntakeCustomerModel from '@/models/intake-cusomter.model';

const defaultState = {
  intakes: [],
  intakeDetail: null,
  fetchIntakeDetailStatus: false,
};

// actions
const actions = {
  async fetchIntakes({ commit, dispatch }, options) {
    let customerId = null;
    let filterOptions = null;
    customerId = options && options.customerId ? options.customerId : null;
    // eslint-disable-next-line operator-linebreak
    filterOptions =
      options && options.filterOptions ? options.filterOptions : null;

    try {
      let route = process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST;
      if (customerId) route = `${route}?customer_id=${customerId}`;
      const intakeListRequest = await privateAxios.get(route, {
        params: { ...defaultPaginationParams, ...filterOptions },
      });

      if (intakeListRequest.status === 200) {
        const intakeItems = intakeListRequest.data.Data.sort((a, b) => {
          const timeA = moment(a.created_at);
          const timeB = moment(b.created_at);
          return timeB - timeA;
        });
        intakeItems.forEach((intk) => {
          if (!intk.customer) {
            // eslint-disable-next-line no-param-reassign
            intk.customer = new IntakeCustomerModel();
          }
        });
        commit('setIntakes', intakeItems);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  async fetchIntakeDetail({ commit, dispatch }, intakeId) {
    commit('toggleIntakeDetailStatus', false);
    try {
      if (!intakeId) throw new Error('no intake id');
      const intakeDetailRequest = await privateAxios.get(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST}/${intakeId}`,
      );
      if (intakeDetailRequest.status === 200) {
        const intakeDetailInfo = intakeDetailRequest.data.Data;
        if (!intakeDetailInfo.customer) {
          intakeDetailInfo.customer = new IntakeCustomerModel();
        }
        const mappedIntakeInfo = mapIntakeFunc(intakeDetailInfo);
        commit('setIntakeDetail', mappedIntakeInfo);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
    commit('toggleIntakeDetailStatus', true);
  },
  async approveIntake({ commit, dispatch }, payload) {
    commit('toggleIntakeDetailStatus', false);
    let results = false;
    const { intakeId } = payload;
    try {
      if (!intakeId) throw new Error('no intake id');
      const intakeApproveRequest = await privateAxios.put(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST}/${intakeId}/approve`,
        {
          discount_point: payload.tickets * 50,
          additional_discount_price: payload.amount,
          discount_note: payload.reason,
        },
      );

      if (intakeApproveRequest.status === 200) {
        results = true;
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
    commit('toggleIntakeDetailStatus', true);
    return results;
  },
  async removeIntake({ dispatch }, payload) {
    let results = false;
    const { intakeId } = payload;
    try {
      if (!intakeId) throw new Error('no intake id');
      const intakeRemoveRequest = await privateAxios.delete(
        `${process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST}/${intakeId}`,
      );

      if (intakeRemoveRequest.status === 200) {
        results = true;
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
    dispatch('fetchIntakes');
    return results;
  },
};

// mutations
const mutations = {
  setIntakes(state, payload) {
    state.intakes = payload;
  },
  setIntakeDetail(state, payload) {
    state.intakeDetail = payload;
  },
  toggleIntakeDetailStatus(state, payload) {
    state.fetchIntakeDetailStatus = payload;
  },
};

// getters
export default {
  namespaced: true,
  state: defaultState,
  actions,
  mutations,
};
