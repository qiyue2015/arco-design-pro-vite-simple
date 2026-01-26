import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/develop',
  name: 'Develop',
  redirect: '/playground/index',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '开发',
    order: 5,
    requiresAuth: true,
  },
  children: [
    {
      path: 'playground',
      name: 'DevelopPlayground',
      component: () => import('@/views/playground/index.vue'),
      meta: {
        title: 'Playground',
        requiresAuth: true,
        icon: 'icon-code-square',
        roles: ['cashier'],
      },
    },
  ],
};

export default DASHBOARD;
