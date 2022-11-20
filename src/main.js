/* eslint-disable object-curly-newline */
import Vue from 'vue';
import { router } from '@/route.js';
import VueMasonry from 'vue-masonry-css';
import VueI18n from 'vue-i18n';
import VueSignaturePad from 'vue-signature-pad';
import mixins from '@/mixins/global.mixins';
import {
  formatDate,
  formatPhone,
  formatCurrency,
  formatCoin,
  formatPoint,
} from '@/helpers/filters';
import VuetifyMoney from 'vuetify-money';
import App from './App';

// vuex
import store from './store';

import vuetify from './plugins/vuetify';
import '@babel/polyfill';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

// styles
import '@/assets/scss/style.scss';

// multilang
import vnMessage from './lang/vn.json';
import enMessage from './lang/en.json';

Vue.use(VuetifyMoney);
Vue.use(VueMasonry);
Vue.use(VueI18n);
const messages = {
  vn: vnMessage,
  en: enMessage,
};
const i18n = new VueI18n({
  locale: 'vn', // set locale
  messages,
  fallbackLocale: 'vn',
});

/**
 * Router
 */

Vue.filter('formatDate', formatDate);
Vue.filter('formatPhone', formatPhone);
Vue.filter('currency', formatCurrency);
Vue.filter('coin', formatCoin);
Vue.filter('point', formatPoint);
Vue.directive('rank', {
  bind(el, binding) {
    let color;
    switch (binding.value) {
      case 'diamond':
        color = 'rgb(33, 150, 243)';
        break;
      case 'gold':
        color = 'rgb(255, 214, 0)';
        break;
      case 'silver':
        color = 'rgb(158, 158, 158)';
        break;
      default:
        color = 'inherit';
        break;
    }
    el.style.color = color;
  },
});

/**
 * Ultilities
 */
Vue.use(VueSignaturePad);
// or, using the defaults with no stylesheet
Vue.mixin(mixins);

new Vue({
  router,
  i18n,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
