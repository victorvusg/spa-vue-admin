import { privateAxios } from '@/api/api';
// import { mapIntakeFunc } from '@/helpers/intakeHelper';

const intakeURL = process.env.VUE_APP_CLIENT_API_ENDPOINT_INTAKE_LIST;
export default {
  SET_REQUEST_OPTIONS({ commit }, { key, value }) {
    commit('setValue', {
      key,
      value,
    });
  },
  async GET_LIST({ state, commit }) {
    let response;
    const options = state.listRequestOptions;
    try {
      response = await privateAxios.get(intakeURL, options);
      if (response.status !== 200) {
        response = null;
      }
    } catch (error) {
      response = null;
    } finally {
      commit('setValue', {
        key: 'listResponse',
        value: response,
      });
    }
  },
  async removeIntake({ dispatch }, payload) {
    let results = false;
    const { intakeId } = payload;
    try {
      if (!intakeId) throw new Error('no intake id');
      const intakeRemoveRequest = await privateAxios.delete(
        `${intakeURL}/${intakeId}`,
      );
      if (intakeRemoveRequest.status !== 200) results = false;
      results = true;
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
    return results;
  },
  async FETCH_INTAKE_DETAILS({ commit, dispatch }, id) {
    let intake;
    try {
      if (!id) throw new Error('no intake id');
      const response = await privateAxios.get(`${intakeURL}/${id}`);
      if (response.status === 200) {
        intake = response.data.Data;
      }
    } catch (error) {
      intake = null;
      dispatch('app/updateErrors', error, { root: true });
    } finally {
      commit('setValue', {
        key: 'intake',
        value: intake,
      });
    }
  },
  async RESET_INTAKE({ commit }) {
    commit('setValue', {
      key: 'intake',
      value: null,
    });
  },
};
