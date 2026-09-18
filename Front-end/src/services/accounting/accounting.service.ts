import apiClient from '../api/axios';
import { handleApiError } from '../api/error-handler';

export interface TaxConfiguration {
  id: string;
  type: 'VAT' | 'TDS';
  code: string;
  name: string;
  ratePercent: number;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo?: string;
  outputAccountCode?: string;
  inputAccountCode?: string;
  withholdingAccountCode?: string;
}

export type TaxConfigurationInput = Omit<TaxConfiguration, 'id'>;

export const getTaxConfigurations = async (): Promise<TaxConfiguration[]> => {
  try {
    const response = await apiClient.get('/accounting/taxes');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createTaxConfiguration = async (data: TaxConfigurationInput) => {
  try {
    const response = await apiClient.post('/accounting/taxes', data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateTaxConfiguration = async (id: string, data: Partial<TaxConfigurationInput>) => {
  try {
    const response = await apiClient.patch(`/accounting/taxes/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export interface TaxReport {
  fromDate: string;
  toDate: string;
  outputVat: number;
  inputVat: number;
  netVat: number;
  tds: number;
  totals: Record<string, number>;
  entryCount: number;
}

export const getTaxReport = async (fromDate: string, toDate: string): Promise<TaxReport> => {
  try {
    const response = await apiClient.get('/accounting/taxes/report', { params: { fromDate, toDate } });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Chart of Accounts
export const getChartOfAccounts = async () => {
  try {
    const response = await apiClient.get('/accounting/chart-of-accounts');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createAccount = async (accountData: any) => {
  try {
    const response = await apiClient.post('/accounting/chart-of-accounts', accountData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAccountSummary = async () => {
  try {
    const response = await apiClient.get('/accounting/chart-of-accounts/summary');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAccountMappings = async () => {
  try {
    const response = await apiClient.get('/accounting/chart-of-accounts/account-mappings');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAccountMapping = async (mappingKey: string, accountCode: string) => {
  try {
    const response = await apiClient.patch(`/accounting/chart-of-accounts/account-mappings/${mappingKey}`, { accountCode });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const activateAccount = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/chart-of-accounts/${id}/activate`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deactivateAccount = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/chart-of-accounts/${id}/deactivate`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateAccount = async (id: string, accountData: any) => {
  try {
    const response = await apiClient.patch(`/accounting/chart-of-accounts/${id}`, accountData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteAccount = async (id: string) => {
  try {
    const response = await apiClient.delete(`/accounting/chart-of-accounts/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Vouchers
export const getVouchers = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/vouchers', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createVoucher = async (voucherData: any) => {
  try {
    const response = await apiClient.post('/accounting/vouchers', voucherData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateVoucher = async (id: string, voucherData: any) => {
  try {
    const response = await apiClient.patch(`/accounting/vouchers/${id}`, voucherData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const deleteVoucher = async (id: string) => {
  try {
    const response = await apiClient.delete(`/accounting/vouchers/${id}`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const approveVoucher = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/vouchers/${id}/approve`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const rejectVoucher = async (id: string, reason: string) => {
  try {
    const response = await apiClient.post(`/accounting/vouchers/${id}/reject`, { reason });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const reverseManualVoucher = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/vouchers/${id}/reverse`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// General Ledger
export const getGeneralLedger = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/general-ledger', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getAccountLedger = async (accountId: string, params?: any) => {
  try {
    const response = await apiClient.get(`/accounting/general-ledger/${accountId}`, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Cash & Bank
export const getCashBankAccounts = async () => {
  try {
    const response = await apiClient.get('/accounting/cash-bank');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCashBankAccount = async (accountData: any) => {
  try {
    const response = await apiClient.post('/accounting/cash-bank', accountData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCashBankTransactions = async (params?: { account?: string; fromDate?: string; toDate?: string }) => {
  try {
    const response = await apiClient.get('/accounting/cash-bank/transactions', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createCashBankTransfer = async (transferData: {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  transferDate: string;
  reference?: string;
  remarks?: string;
}) => {
  try {
    const response = await apiClient.post('/accounting/cash-bank/transfers', transferData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCashBankBalance = async () => {
  try {
    const response = await apiClient.get('/accounting/cash-bank/balance');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Receivables
export const getReceivables = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/receivables', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createReceivable = async (receivableData: any) => {
  try {
    const response = await apiClient.post('/accounting/receivables', receivableData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getClientCollection = async (clientId: string, collectionData: any) => {
  try {
    const response = await apiClient.post(`/accounting/receivables/${clientId}/collection`, collectionData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getOverdueReceivables = async () => {
  try {
    const response = await apiClient.get('/accounting/receivables/overdue');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Payables
export const getPayables = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/payables', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createPayable = async (payableData: any) => {
  try {
    const response = await apiClient.post('/accounting/payables', payableData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const approvePayable = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/payables/${id}/approve`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getPendingPayables = async () => {
  try {
    const response = await apiClient.get('/accounting/payables/pending');
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Bank Reconciliation
export const getBankReconciliations = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/bank-reconciliation', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createReconciliation = async (reconciliationData: any) => {
  try {
    const response = await apiClient.post('/accounting/bank-reconciliation', reconciliationData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const matchTransaction = async (reconciliationId: string, transactionId: string, voucherNo?: string, note?: string) => {
  try {
    const response = await apiClient.post(`/accounting/bank-reconciliation/${reconciliationId}/match`, { transactionId, voucherNo, note });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const unmatchTransaction = async (reconciliationId: string, transactionId: string) => {
  try {
    const response = await apiClient.post(`/accounting/bank-reconciliation/${reconciliationId}/unmatch`, { transactionId });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Invoices & Receipts
export const getInvoices = async (params?: any) => {
  try {
    const response = await apiClient.get('/accounting/invoices', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const createInvoice = async (invoiceData: any) => {
  try {
    const response = await apiClient.post('/accounting/invoices', invoiceData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const updateInvoice = async (id: string, invoiceData: any) => {
  try {
    const response = await apiClient.patch(`/accounting/invoices/${id}`, invoiceData);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const printInvoice = async (id: string) => {
  try {
    const response = await apiClient.post(`/accounting/invoices/${id}/print`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

// Reports
export const getTrialBalance = async (params: { fromDate: string; toDate: string }) => {
  try {
    const response = await apiClient.get('/accounting/trial-balance', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const exportTrialBalance = async (params: { fromDate: string; toDate: string }) => {
  try {
    const response = await apiClient.post('/accounting/trial-balance/export', {}, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getProfitLoss = async (params: { period?: string; year?: string; fromDate?: string; toDate?: string }) => {
  try {
    const response = await apiClient.get('/accounting/profit-loss', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const exportProfitLoss = async (params: { period?: string; year?: string; fromDate?: string; toDate?: string }) => {
  try {
    const response = await apiClient.post('/accounting/profit-loss/export', {}, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getBalanceSheet = async (params: { asOfDate: string }) => {
  try {
    const response = await apiClient.get('/accounting/balance-sheet', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const exportBalanceSheet = async (params: { asOfDate: string }) => {
  try {
    const response = await apiClient.post('/accounting/balance-sheet/export', {}, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const getCashFlow = async (params: { period?: string; year?: string }) => {
  try {
    const response = await apiClient.get('/accounting/cash-flow', { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

export const exportCashFlow = async (params: { period?: string; year?: string }) => {
  try {
    const response = await apiClient.post('/accounting/cash-flow/export', {}, { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
