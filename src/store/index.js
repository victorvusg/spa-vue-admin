import Vue from 'vue';
import Vuex from 'vuex';
import intake from '@/store/intake';
import coreModules from '@/core/modules';
import app from './app';
import discount from './modules/discount';
import service from './modules/service';
import customer from './customer';
import employee from './modules/employee';
import statistic from './modules/statistic';
import task from './modules/task';
import reminder from './modules/reminder';
import spaPackage from './modules/spaPackage';
import order from './modules/order';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    ...coreModules,
    app,
    discount,
    service,
    intake,
    customer,
    employee,
    statistic,
    task,
    spaPackage,
    order,
    reminder,
  },
});
