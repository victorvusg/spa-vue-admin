const defaultToast = {
  message: '',
  color: '',
};
export default {
  openToast({ commit }, dialog) {
    commit('setValue', {
      key: 'model',
      value: true,
    });
    commit('setValue', {
      key: 'config',
      value: { ...defaultToast, ...dialog },
    });
  },
  closeToast({ commit }) {
    commit('setValue', {
      key: 'model',
      value: false,
    });
  },
};
