import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'Order',
  redirect: '/order/list',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '订单管理',
    requiresAuth: true,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/list.vue'),
      meta: {
        title: '订单列表',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'refund',
      name: 'OrderRefund',
      component: () => import('@/views/order/refund.vue'),
      meta: {
        title: '退款管理',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default ORDER;
