import axios from 'axios';
import qs from 'query-string';

// 导出账单接口参数
export interface ExportBillsParams {
  store_id?: number;
  start_time: string;
  end_time: string;
}

// 导出账单响应
export interface ExportBillsRes {
  url: string;
  filename: string;
}

// 导出账单（获取下载链接）
export function exportBills(params: ExportBillsParams) {
  return axios.get<ExportBillsRes>('/store/admin/bills/export', {
    params,
    paramsSerializer: (obj) => {
      return qs.stringify(obj);
    },
  });
}
