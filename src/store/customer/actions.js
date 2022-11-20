import { privateAxios } from '@/api/api';
// import { mapIntakeFunc } from '@/helpers/intakeHelper';

export default (() => {
  const api = process.env.VUE_APP_CLIENT_API_ENDPOINT_CUSTOMER_LIST;
  return {
    async FETCH_DETAILS({ commit, dispatch }, id) {
      let resource;
      try {
        if (!id) throw new Error('no id');
        const response = await privateAxios.get(`${api}/${id}`);
        if (response.status === 200) {
          resource = response.data.Data;
        }
      } catch (error) {
        resource = null;
        dispatch('app/updateErrors', error, { root: true });
      } finally {
        commit('setValue', {
          key: 'resource',
          value: resource,
        });
      }
    },
    async RESET_RESOURCE({ commit }) {
      commit('setValue', {
        key: 'resource',
        value: null,
      });
    },
    async FETCH_RANKS({ commit, dispatch }) {
      try {
        const response = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_RANK,
        );

        if (response.status === 200) {
          commit('setValue', {
            key: 'ranks',
            value: response.data.Data,
          });
        }
      } catch (error) {
        dispatch('app/updateErrors', error, { root: true });
      }
    },
  };
})();
