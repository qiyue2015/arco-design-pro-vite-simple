import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ORDER: AppRouteRecordRaw = {
  path: '/order',
  name: 'Order',
  redirect: '/order/list',
  component: DEFAULT_LAYOUT,
  meta: {
    title: '订单',
    requiresAuth: true,
    icon: 'icon-list',
    order: 2,
  },
  children: [
    {
      path: 'list',
      name: 'OrderList',
      component: () => import('@/views/order/list.vue'),
      meta: {
        title: '交易订单',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-list',
      },
    },
    {
      path: 'refund',
      name: 'OrderRefund',
      component: () => import('@/views/order/refund.vue'),
      meta: {
        title: '退款列表',
        requiresAuth: true,
        roles: ['*'],
        icon: 'icon-undo',
      },
    },
  ],
};

export default ORDER;
