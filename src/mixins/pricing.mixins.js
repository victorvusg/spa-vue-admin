export default {
  methods: {
    calculateTotalPrice(orders, field) {
      return orders.reduce((acc, current) => {
        if (current.combo_id === null) {
          // eslint-disable-next-line no-param-reassign
          acc += current[field] * current.amount;
        }
        return acc;
      }, 0);
    },
  },
};
