import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKPLACE: AppRouteRecordRaw = {
  path: '/',
  name: 'Home',
  redirect: '/workplace',
  component: DEFAULT_LAYOUT,
  meta: {
    locale: 'menu.workplace',
    requiresAuth: true,
    icon: 'icon-dashboard',
    hideChildrenInMenu: true,
    order: 0,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/workplace/index.vue'),
      meta: {
        locale: 'menu.workplace',
        requiresAuth: true,
        roles: ['*'],
        activeMenu: 'Home',
      },
    },
  ],
};

export default WORKPLACE;
