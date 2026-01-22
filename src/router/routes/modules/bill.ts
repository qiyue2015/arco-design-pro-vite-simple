import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const BILL: AppRouteRecordRaw = {
  path: '/bill',
  name: 'Bill',
  redirect: '/bill/index',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '账单',
    requiresAuth: true,
    icon: 'icon-safe',
    order: 3,
  },
  children: [
    {
      path: 'index',
      name: 'BillIndex',
      component: () => import('@/views/bill/index.vue'),
      meta: {
        title: '交易账单',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-file',
      },
    },
  ],
};

export default BILL;
