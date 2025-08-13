import { WORKFLOW_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const WORKFLOW: AppRouteRecordRaw = {
  path: '/workflows/:id',
  name: 'Workflow',
  component: WORKFLOW_LAYOUT,
  meta: {
    requiresAuth: true,
    hideInMenu: true,
  },
};

export default WORKFLOW;
