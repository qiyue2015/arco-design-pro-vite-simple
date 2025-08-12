import { AnyObject } from '@/types/global';
import axios from 'axios';
import qs from 'query-string';

export interface WorkflowRecord {
  id: number;
  title: string;
  description: string;
  thumb: string;
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
  return axios.get<WorkflowListRes, any>('/api/user/workflows', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}

// 增加
export function postWorkflow(data: AnyObject) {
  return axios.post('/api/user/workflows', data);
}

// 删除
export function deleteWorkflow(id: number) {
  return axios.delete(`/api/user/workflows/${id}`);
}

// 修改
export function putWorkflow(id: number, data: AnyObject) {
  return axios.put(`/api/user/workflows/${id}`, data);
}

// 详情
export function getWorkflowDetail(id: number) {
  return axios.get(`/api/user/workflows/${id}`, {
    params: { id },
  });
}
