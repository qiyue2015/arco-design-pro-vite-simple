import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'Dashboard',
  redirect: '/dashboard/overview',
  component: DEFAULT_LAYOUT,
  meta: {
    requiresAuth: true,
  },
  children: [
    {
      path: 'overview',
      name: 'Overview',
      component: () => import('@/views/dashboard/overview.vue'),
      meta: {
        title: '概览',
        requiresAuth: true,
        icon: 'icon-dashboard',
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
