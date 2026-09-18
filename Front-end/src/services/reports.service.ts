import apiClient from './api/axios';

export interface DashboardSummary {
  kpis: {
    revenue: number;
    expenses: number;
    netProfit: number;
    cashInflow: number;
    knownCashOutflow: number;
    cashBalanceEstimate: number;
    receivables: number;
    payables: number;
  };
  counts: {
    sales: number;
    projects: number;
    units: number;
    availableUnits: number;
    vendors: number;
    pendingVendorBills: number;
  };
  recentVouchers: Array<{
    ref: string;
    description: string;
    date: string;
    status: string;
    amount: number;
  }>;
  projectProgress: Array<{
    name: string;
    type: string;
    units: number;
    totalUnits: number;
    progress: number;
  }>;
}

export const getDashboardSummary = async (): Promise<DashboardSummary> =>
  (await apiClient.get<DashboardSummary>('/reports/dashboard')).data;
