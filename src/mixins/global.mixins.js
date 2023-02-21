import { mapState } from 'vuex';
import store from './store.mixins';

export default {
  mixins: [store],
  created() {
    window.scrollTop = 0;
  },
  computed: {
    ...mapState('app', ['showNav', 'showSideBar', 'toast']),
    cashierName() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (user) return user.name;
      return null;
    },
    drawer: {
      get() {
        return this.showSideBar;
      },
      set(val) {
        this.dispatch('app/setShowSideBar', val);
      },
    },
    loggedRole() {
      const loggedUser = JSON.parse(localStorage.getItem('user'));
      return loggedUser ? loggedUser.role : null;
    },
    isMobile() {
      return this.$vuetify.breakpoint.width <= 1024;
    },
  },
  methods: {
    addZero(i) {
      let r = i;
      if (i < 10) {
        r = `0${i}`;
      }
      return r;
    },
    // variantName(variant) {
    //   const mapper = variant.service.mapper || 'default';
    //   const fields = variantNameMappers[mapper];
    //   return fields
    //     .reduce((result, key) => {
    //       const value = _get(variant, key);
    //       if (value) {
    //         result.push(value);
    //       }
    //       return result;
    //     }, [])
    //     .join(' - ');
    // },
    promotionPrice(variants) {
      return variants.reduce((sum, v) => {
        if (!v.is_free) {
          // eslint-disable-next-line no-param-reassign
          sum += v.sale_price;
        }
        return sum;
      }, 0);
    },
    async setLoading(val) {
      await this.dispatch('app/setLoading', val);
    },
    priceCalculation({ id, type, value }) {
      if (!id) return '';
      let discount = 0;
      let finalPrice = 0;
      const stockPrice = this.variantsData.find((el) => el.value === id)
        .sale_price;
      if (type === 'percentage') discount = (stockPrice * value) / 100;
      else discount = value;
      finalPrice = stockPrice - discount;
      return `Giá gốc <span class="font-weight-bold">${stockPrice}k</span>, giảm <span class="red--text">-${discount}k</span>,  còn <span class="primary--text">${finalPrice}k</span>`;
    },
    variantName(variant) {
      if (variant.variant_category === 'goods') {
        return variant.name;
      }
      return variant.name;
    },
  },
};
