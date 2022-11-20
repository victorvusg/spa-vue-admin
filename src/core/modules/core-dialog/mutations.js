export default {
  setValue(state, data) {
    state[data.key] = data.value;
  },
  setValues(state, data) {
    data.forEach((prop) => {
      state[prop.key] = prop.value;
    });
  },
};
