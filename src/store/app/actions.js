export default {
  setShowNav({ commit }, value) {
    commit('setValue', {
      key: 'showNav',
      value,
    });
  },
  setShowSideBar({ commit }, value) {
    commit('setValue', {
      key: 'showSideBar',
      value,
    });
  },
  setLoading({ commit }, value) {
    commit('setValue', {
      key: 'isLoading',
      value,
    });
  },
  updateErrors({ commit, state }, payload) {
    commit('setValue', {
      key: 'errors',
      value: [...state.errors, payload],
    });
  },
  SET_PAYMENT_METHODS({ commit }, value) {
    commit('setValue', {
      key: 'paymentMethods',
      value,
    });
  },
};
