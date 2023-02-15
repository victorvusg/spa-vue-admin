import { privateAxios, defaultPaginationParams } from '@/api/api';

const defaultState = {
  serviceCategories: [],
  variants: [],
};

//  getters
const getters = {
  services: (state) => {
    if (!state.variants.length) return {};
    return state.variants.reduce((result, currentValue) => {
      const variantCategory = currentValue.service.service_category;
      if (!result[variantCategory.name]) {
        result[variantCategory.name] = { ...variantCategory, services: [] };
      }
      const { services } = result[variantCategory.name];
      const serviceObject = services.find(
        (s) => s.id === currentValue.service.id,
      );
      if (!serviceObject) {
        services.push({
          ...currentValue.service,
          variants: [{ ...currentValue }],
        });
      } else {
        serviceObject.variants.push({ ...currentValue });
      }
      return result;
    }, {});
  },
};

// actions
const actions = {
  async fetchServices({ commit, dispatch }) {
    try {
      const variantListRequest = await privateAxios.get(
        process.env.VUE_APP_CLIENT_API_ENDPOINT_VARIANTS_LIST,
        {
          params: { ...defaultPaginationParams },
        },
      );
      if (variantListRequest.status === 200) {
        const variants = variantListRequest.data.Data;
        const caregoriesRequest = await privateAxios.get(
          process.env.VUE_APP_CLIENT_API_ENDPOINT_SERVICE_CATEGORY_LIST,
          {
            params: { ...defaultPaginationParams, is_active: 1 },
          },
        );
        if (caregoriesRequest.status === 200) {
          const caregories = caregoriesRequest.data.Data.map((s) => ({
            name: s.name,
            id: s.id,
            descriptions: s.descriptions,
          }));
          commit('setServiceCategories', caregories);
        }
        commit('setVariants', variants);
      }
    } catch (error) {
      dispatch('app/updateErrors', error, { root: true });
    }
  },
  PUSH_VARIANTS({ state, commit }, payload) {
    const variants = JSON.parse(JSON.stringify(state.variants));
    payload.forEach((element) => {
      const findIndex = variants.findIndex((v) => v.id === element.id);
      if (findIndex === -1) variants.push(element);
      else {
        variants[findIndex] = { ...variants[findIndex], ...element };
      }
    });
    commit('setVariants', variants);
  },
};

// mutations
const mutations = {
  setServices(state, payload) {
    state.services = payload;
  },
  setServiceCategories(state, payload) {
    state.serviceCategories = payload;
  },
  setVariants(state, payload) {
    state.variants = payload;
  },
};

export default {
  namespaced: true,
  state: defaultState,
  getters,
  actions,
  mutations,
};
