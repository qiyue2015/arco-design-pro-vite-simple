import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SHOP: AppRouteRecordRaw = {
  path: '/shop',
  name: 'Shop',
  redirect: '/shop/index',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '门店',
    requiresAuth: true,
    icon: 'icon-apps',
    order: 1,
  },
  children: [
    {
      path: 'index',
      name: 'ShopIndex',
      component: () => import('@/views/shop/index.vue'),
      meta: {
        title: '门店例表',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-home',
      },
    },
  ],
};

export default SHOP;
