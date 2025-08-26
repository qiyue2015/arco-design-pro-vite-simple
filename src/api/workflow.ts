import { AnyObject } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

export interface WorkflowRecord {
  id: string;
  name: string;
  content: string;
}

export interface WorkflowParams extends Partial<WorkflowRecord> {
  current: number;
  pageSize: number;
}

export interface WorkflowListRes {
  list: WorkflowRecord[];
  total: number;
}

// 例表
export function queryWorkflowList(params: WorkflowParams) {
  return axios.get<WorkflowListRes, any>('/v1/user/workflows', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 增加
export function postWorkflow(data: AnyObject) {
  return axios.post('/v1/user/workflows', data);
}

// 删除
export function deleteWorkflow(id: string) {
  return axios.delete(`/v1/user/workflows/${id}`);
}

// 修改
export function putWorkflow(id: string, data: AnyObject) {
  return axios.put(`/v1/user/workflows/${id}`, data);
}

// 详情
export function getWorkflowDetail(id: string) {
  return axios.get(`/v1/user/workflows/${id}`, {
    params: { id },
  });
}
