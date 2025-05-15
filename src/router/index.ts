import { createRouter, createWebHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';
import { DEFAULT_ROUTE_NAME } from './constants';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: { name: DEFAULT_ROUTE_NAME },
    },
    {
      path: '/auth',
      redirect: '/auth/login',
      component: () => import('@/views/auth/index.vue'),
      children: [
        {
          path: 'login',
          name: 'login',
          component: () => import('@/views/auth/login.vue'),
          meta: {
            requiresAuth: false,
            locale: 'auth.login',
          },
        },
        {
          path: 'register',
          name: 'register',
          component: () => import('@/views/auth/register.vue'),
          meta: {
            requiresAuth: false,
            locale: 'auth.register',
          },
        },
      ],
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
