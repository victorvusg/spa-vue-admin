import ViewNotFound from '@/views/Notfound';
import ViewLogin from '@/views/Login';
import Vue from 'vue';
import VueRouter from 'vue-router';

import DashboardIndex from '@/components/Dashboard/Index';
import Tasks from '@/components/Task/Tasks';
import IntakeIndex from '@/components/Intake/Index';
import PackageIndex from '@/components/Package/Index';
import EmployeeIndex from '@/components/Employee/Index';
import CustomerIndex from '@/components/Customer/Index';
import ServiceIndex from '@/components/Service/Index';

import EmployeeDetail from '@/components/Employee/Detail';
import CustomerDetail from '@/components/Customer/Detail';
import IntakeDetail from '@/components/Intake/Detail';

import InvoiceIndex from '@/components/Invoices/Index';
import ReportIndex from '@/components/Report/Index';
import DiscountIndex from '@/components/Discount/Index';
import ReminderIndex from '@/components/Reminder/Index';

// Route guard
// import loggedInGuard from './helpers/routeLoginGuard';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: { name: 'Intake' },
  },
  {
    path: '/',
    redirect: { name: 'Intake' },
  },
  {
    path: '/summary',
    name: 'Summary',
    component: DashboardIndex,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: Tasks,
    meta: { requiresAuth: true, roles: ['admin'] },
  },
  {
    path: '/intakes',
    name: 'Intake',
    component: IntakeIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/intakes/:intakeid',
    name: 'IntakeDetail',
    component: IntakeDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/packages',
    name: 'Packages',
    component: PackageIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/employees',
    name: 'Employees',
    component: EmployeeIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/employees/:employeeid',
    name: 'EmployeeDetail',
    component: EmployeeDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/customers',
    name: 'Customers',
    component: CustomerIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/customers/:customerid',
    name: 'CustomerDetail',
    component: CustomerDetail,
    meta: { requiresAuth: true },
  },
  {
    path: '/services',
    name: 'Services',
    component: ServiceIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/invoices',
    name: 'Invoices',
    component: InvoiceIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: ViewLogin,
  },
  {
    path: '/report',
    name: 'Report',
    component: ReportIndex,
    meta: { requiresAuth: true, roles: ['admin', 'cashier'] },
  },
  {
    path: '/discount',
    name: 'Discount',
    component: DiscountIndex,
    meta: { requiresAuth: true, roles: ['admin', 'cashier'] },
  },
  {
    path: '/reminder',
    name: 'Reminder',
    component: ReminderIndex,
    meta: { requiresAuth: true },
  },
  {
    path: '*',
    name: 'NotFound',
    component: ViewNotFound,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes, // short for `routes: routes`
});

router.beforeEach((to, from, next) => {
  const isLogged = localStorage.getItem('jwt');
  if (to.path === '/login') {
    if (isLogged) {
      next('/');
      return;
    }
  }
  // Required requiresAuth check

  if (
    to.matched.length &&
    to.matched[0].meta &&
    to.matched[0].meta.requiresAuth
  ) {
    if (!isLogged) {
      next('/login');
      return;
    }
    if (to.matched[0].meta.roles) {
      const allowRoles = to.matched[0].meta.roles;
      const loggedRole = JSON.parse(isLogged).user.role;
      if (allowRoles.indexOf(loggedRole) === -1) {
        next({ path: 'error' });
        return;
      }
    }
  }
  next();
});
export { router, routes };
