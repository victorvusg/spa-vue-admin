import { get } from 'lodash';

export default {
  methods: {
    state(variable) {
      return get(this.$store.state, variable);
    },
    commit(mutation, data) {
      this.$store.commit(mutation, data);
    },
    async dispatch(action, data) {
      const promise = await this.$store.dispatch(action, data);
      return promise;
    },
  },
};
