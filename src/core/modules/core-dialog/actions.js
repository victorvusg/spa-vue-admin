const defaultDialog = {
  title: '',
  type: '',
  content: '',
  contentProps: {},
  callBackFunc: null,
  closeBtnLabel: 'Đóng',
  agreeBtnLabel: 'Đồng Ý',
  agreeBtnDisable: false,
};
export default {
  openDialog({ commit }, dialog) {
    commit('setValue', {
      key: 'model',
      value: true,
    });
    commit('setValue', {
      key: 'config',
      value: { ...defaultDialog, ...dialog },
    });
  },
  closeDialog({ commit }) {
    commit('setValue', {
      key: 'model',
      value: false,
    });
    commit('setValue', {
      key: 'config',
      value: defaultDialog,
    });
  },
};
