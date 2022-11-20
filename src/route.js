import ViewNotFound from '@/views/Notfound';
import ViewLogin from '@/views/Login';
import Vue from 'vue';
import VueRouter from 'vue-router';
import { nextFactory, auth, unauthorized } from '@/middlewares';
import AppWrapper from '@/views/AppWrapper';
// import DashboardIndex from '@/components/Dashboard/Index';
// import IntakeIndex from '@/components/Intake/Index';
// import PackageIndex from '@/components/Package/Index';
// import EmployeeIndex from '@/components/Employee/Index';
// import CustomerIndex from '@/components/Customer/Index';
// import ServiceIndex from '@/components/Service/Index';

// import EmployeeDetail from '@/components/Employee/Detail';
// import CustomerDetail from '@/components/Customer/Detail';
// import IntakeDetail from '@/components/Intake/Detail';

// import InvoiceIndex from '@/components/Invoices/Index';
// import ReportIndex from '@/components/Report/Index';
// import DiscountIndex from '@/components/Discount/Index';
// import ReminderIndex from '@/components/Reminder/Index';

// Route guard
// import loggedInGuard from './helpers/routeLoginGuard';

Vue.use(VueRouter);

const routes = [
  // {
  //   path: '/',
  //   name: 'Dashboard',
  //   redirect: { name: 'Intake' },
  //   meta: {
  //     middleware: [auth],
  //   },
  // },
  {
    path: '/',
    meta: {
      middleware: [auth],
    },
    component: AppWrapper,
    children: [
      {
        path: '/',
        name: 'Dashboard',
        redirect: { name: 'Intake' },
      },
      {
        path: '/intakes',
        name: 'Intake',
        components: {
          default: () =>
            import(/* webpackChunkName: "IntakeView" */ '@/views/Intake'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/intake/:id',
        name: 'IntakeDetails',
        components: {
          default: () =>
            import(/* webpackChunkName: "IntakeDetails" */ '@/views/IntakeDetails'),
        },
      },
      {
        path: 'discount',
        name: 'Discount',
        components: {
          default: () =>
            import(/* webpackChunkName: "DiscountView" */ '@/views/Discount'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: 'invoices',
        name: 'Invoices',
        components: {
          default: () =>
            import(/* webpackChunkName: "InvoiceView" */ '@/views/Invoices'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: 'packages',
        name: 'Packages',
        components: {
          default: () =>
            import(/* webpackChunkName: "PackageView" */ '@/views/Package'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: 'customers',
        name: 'Customers',
        components: {
          default: () =>
            import(/* webpackChunkName: "DiscountView" */ '@/views/Customer'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/customers/:customerId',
        name: 'CustomerDetails',
        components: {
          default: () =>
            import(
              /* webpackChunkName: "CustomerDetailView" */ '@/views/CustomerDetails'
            ),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/employees',
        name: 'Employees',
        components: {
          default: () =>
            import(/* webpackChunkName: "EmployeeView" */ '@/views/Employees'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/services',
        name: 'Services',
        components: {
          default: () =>
            import(/* webpackChunkName: "ServicesView" */ '@/views/Services'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/report',
        name: 'Report',
        components: {
          default: () =>
            import(/* webpackChunkName: "ReportView" */ '@/views/Report'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/work-summary',
        name: 'WorkSummary',
        components: {
          default: () =>
            import(/* webpackChunkName: "WorkSummary" */ '@/views/WorkSummary'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
      {
        path: '/tasks',
        name: 'Tasks',
        components: {
          default: () =>
            import(/* webpackChunkName: "Tasks" */ '@/views/Tasks'),
          navbar: () =>
            import(/* webpackChunkName: "Navbar" */ '@/layout/Navbar'),
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: ViewLogin,
    meta: {
      middleware: [unauthorized],
    },
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
  if (to.meta.middleware) {
    const middleware = Array.isArray(to.meta.middleware)
      ? to.meta.middleware
      : [to.meta.middleware];

    const context = {
      from,
      next,
      router,
      to,
    };
    const nextMiddleware = nextFactory(context, middleware, 1);

    return middleware[0]({ ...context, next: nextMiddleware });
  }

  return next();
});
export { router, routes };
