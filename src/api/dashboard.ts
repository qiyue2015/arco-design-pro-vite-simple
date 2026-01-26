import axios from 'axios';

export interface DashboardOverviewRes {
  merchant: any;
  ability: any;
  stores: any[];
}

export interface DevelopSettingsRes {
  mch_id: string;
  app_id: number;
  allowed_ips: string[] | null;
  driver: string;
  driver_config: {
    appid: string;
    pay_url: string;
    order_url: string;
    token_url: string;
    member_url: string;
    refund_url: string;
  };
}

export function getDashboardOverview() {
  return axios.get<DashboardOverviewRes>('store/admin/dashboard/overview');
}

export function getDevelopSettings() {
  return axios.get<DevelopSettingsRes>('store/admin/dashboard/develop-settings');
}
