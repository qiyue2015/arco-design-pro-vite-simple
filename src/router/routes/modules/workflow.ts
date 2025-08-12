import { WORKFLOW_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKFLOW: AppRouteRecordRaw = {
  path: '/workflows',
  name: 'Workflow',
  component: WORKFLOW_LAYOUT,
  meta: {
    locale: 'menu.workplace',
    requiresAuth: true,
    icon: 'icon-dashboard',
    hideInMenu: true,
  },
  children: [
    {
      path: ':id',
      name: 'WorkflowDetail',
      component: () => import('@/views/workflow/index.vue'),
      meta: {
        locale: 'menu.workflow.edit',
        requiresAuth: true,
        roles: ['*'],
        hideInMenu: true,
      },
    },
  ],
};

export default WORKFLOW;
