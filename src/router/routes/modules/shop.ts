import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const SHOP: AppRouteRecordRaw = {
  path: '/shop',
  name: 'Shop',
  redirect: '/shop/index',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '店铺管理',
    requiresAuth: true,
  },
  children: [
    {
      path: 'index',
      name: 'ShopIndex',
      component: () => import('@/views/shop/index.vue'),
      meta: {
        title: '店铺主页',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default SHOP;
