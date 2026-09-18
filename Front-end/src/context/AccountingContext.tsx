import React, { createContext, useContext, useState } from 'react';
import {
  getChartOfAccounts,
  getAccountSummary,
  getVouchers,
  getGeneralLedger,
  getCashBankAccounts,
  getReceivables,
  getPayables,
  getBankReconciliations,
  getInvoices,
  getTrialBalance,
  getProfitLoss,
  getBalanceSheet,
  getCashFlow,
} from '@/services/accounting/accounting.service';

interface AccountingContextType {
  // Chart of Accounts
  chartOfAccounts: any[];
  chartOfAccountsLoading: boolean;
  chartOfAccountsError: string | null;
  fetchChartOfAccounts: () => Promise<void>;
  accountSummary: Record<string, number>;
  fetchAccountSummary: () => Promise<void>;

  // Vouchers
  vouchers: any[];
  vouchersLoading: boolean;
  vouchersError: string | null;
  fetchVouchers: (params?: any) => Promise<void>;

  // General Ledger
  generalLedger: any[];
  generalLedgerLoading: boolean;
  generalLedgerError: string | null;
  fetchGeneralLedger: (params?: any) => Promise<void>;

  // Cash & Bank
  cashBankAccounts: any[];
  cashBankLoading: boolean;
  cashBankError: string | null;
  fetchCashBankAccounts: () => Promise<void>;

  // Receivables
  receivables: any[];
  receivablesLoading: boolean;
  receivablesError: string | null;
  fetchReceivables: (params?: any) => Promise<void>;

  // Payables
  payables: any[];
  payablesLoading: boolean;
  payablesError: string | null;
  fetchPayables: (params?: any) => Promise<void>;

  // Bank Reconciliation
  bankReconciliations: any[];
  bankReconciliationLoading: boolean;
  bankReconciliationError: string | null;
  fetchBankReconciliations: (params?: any) => Promise<void>;

  // Invoices
  invoices: any[];
  invoicesLoading: boolean;
  invoicesError: string | null;
  fetchInvoices: (params?: any) => Promise<void>;

  // Reports
  trialBalance: any;
  trialBalanceLoading: boolean;
  trialBalanceError: string | null;
  fetchTrialBalance: (params: any) => Promise<void>;

  profitLoss: any;
  profitLossLoading: boolean;
  profitLossError: string | null;
  fetchProfitLoss: (params?: any) => Promise<void>;

  balanceSheet: any;
  balanceSheetLoading: boolean;
  balanceSheetError: string | null;
  fetchBalanceSheet: (params: any) => Promise<void>;

  cashFlow: any;
  cashFlowLoading: boolean;
  cashFlowError: string | null;
  fetchCashFlow: (params?: any) => Promise<void>;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

export const AccountingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Chart of Accounts
  const [chartOfAccounts, setChartOfAccounts] = useState<any[]>([]);
  const [chartOfAccountsLoading, setChartOfAccountsLoading] = useState(false);
  const [chartOfAccountsError, setChartOfAccountsError] = useState<string | null>(null);
  const [accountSummary, setAccountSummary] = useState<Record<string, number>>({});

  // Vouchers
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [vouchersLoading, setVouchersLoading] = useState(false);
  const [vouchersError, setVouchersError] = useState<string | null>(null);

  // General Ledger
  const [generalLedger, setGeneralLedger] = useState<any[]>([]);
  const [generalLedgerLoading, setGeneralLedgerLoading] = useState(false);
  const [generalLedgerError, setGeneralLedgerError] = useState<string | null>(null);

  // Cash & Bank
  const [cashBankAccounts, setCashBankAccounts] = useState<any[]>([]);
  const [cashBankLoading, setCashBankLoading] = useState(false);
  const [cashBankError, setCashBankError] = useState<string | null>(null);

  // Receivables
  const [receivables, setReceivables] = useState<any[]>([]);
  const [receivablesLoading, setReceivablesLoading] = useState(false);
  const [receivablesError, setReceivablesError] = useState<string | null>(null);

  // Payables
  const [payables, setPayables] = useState<any[]>([]);
  const [payablesLoading, setPayablesLoading] = useState(false);
  const [payablesError, setPayablesError] = useState<string | null>(null);

  // Bank Reconciliation
  const [bankReconciliations, setBankReconciliations] = useState<any[]>([]);
  const [bankReconciliationLoading, setBankReconciliationLoading] = useState(false);
  const [bankReconciliationError, setBankReconciliationError] = useState<string | null>(null);

  // Invoices
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);

  // Reports
  const [trialBalance, setTrialBalance] = useState<any>(null);
  const [trialBalanceLoading, setTrialBalanceLoading] = useState(false);
  const [trialBalanceError, setTrialBalanceError] = useState<string | null>(null);

  const [profitLoss, setProfitLoss] = useState<any>(null);
  const [profitLossLoading, setProfitLossLoading] = useState(false);
  const [profitLossError, setProfitLossError] = useState<string | null>(null);

  const [balanceSheet, setBalanceSheet] = useState<any>(null);
  const [balanceSheetLoading, setBalanceSheetLoading] = useState(false);
  const [balanceSheetError, setBalanceSheetError] = useState<string | null>(null);

  const [cashFlow, setCashFlow] = useState<any>(null);
  const [cashFlowLoading, setCashFlowLoading] = useState(false);
  const [cashFlowError, setCashFlowError] = useState<string | null>(null);

  // Chart of Accounts
  const fetchChartOfAccounts = async () => {
    setChartOfAccountsLoading(true);
    setChartOfAccountsError(null);
    try {
      const data = await getChartOfAccounts();
      setChartOfAccounts(data);
    } catch (error: any) {
      setChartOfAccountsError(error.message || 'Failed to fetch chart of accounts');
    } finally {
      setChartOfAccountsLoading(false);
    }
  };

  const fetchAccountSummary = async () => {
    try {
      setAccountSummary(await getAccountSummary());
    } catch (error: any) {
      setChartOfAccountsError(error.message || 'Failed to fetch account summary');
    }
  };

  // Vouchers
  const fetchVouchers = async (params?: any) => {
    setVouchersLoading(true);
    setVouchersError(null);
    try {
      const data = await getVouchers(params);
      setVouchers(data);
    } catch (error: any) {
      setVouchersError(error.message || 'Failed to fetch vouchers');
    } finally {
      setVouchersLoading(false);
    }
  };

  // General Ledger
  const fetchGeneralLedger = async (params?: any) => {
    setGeneralLedgerLoading(true);
    setGeneralLedgerError(null);
    try {
      const data = await getGeneralLedger(params);
      setGeneralLedger(data);
    } catch (error: any) {
      setGeneralLedgerError(error.message || 'Failed to fetch general ledger');
    } finally {
      setGeneralLedgerLoading(false);
    }
  };

  // Cash & Bank
  const fetchCashBankAccounts = async () => {
    setCashBankLoading(true);
    setCashBankError(null);
    try {
      const data = await getCashBankAccounts();
      setCashBankAccounts(data);
    } catch (error: any) {
      setCashBankError(error.message || 'Failed to fetch cash & bank accounts');
    } finally {
      setCashBankLoading(false);
    }
  };

  // Receivables
  const fetchReceivables = async (params?: any) => {
    setReceivablesLoading(true);
    setReceivablesError(null);
    try {
      const data = await getReceivables(params);
      setReceivables(data);
    } catch (error: any) {
      setReceivablesError(error.message || 'Failed to fetch receivables');
    } finally {
      setReceivablesLoading(false);
    }
  };

  // Payables
  const fetchPayables = async (params?: any) => {
    setPayablesLoading(true);
    setPayablesError(null);
    try {
      const data = await getPayables(params);
      setPayables(data);
    } catch (error: any) {
      setPayablesError(error.message || 'Failed to fetch payables');
    } finally {
      setPayablesLoading(false);
    }
  };

  // Bank Reconciliation
  const fetchBankReconciliations = async (params?: any) => {
    setBankReconciliationLoading(true);
    setBankReconciliationError(null);
    try {
      const data = await getBankReconciliations(params);
      setBankReconciliations(data);
    } catch (error: any) {
      setBankReconciliationError(error.message || 'Failed to fetch bank reconciliations');
    } finally {
      setBankReconciliationLoading(false);
    }
  };

  // Invoices
  const fetchInvoices = async (params?: any) => {
    setInvoicesLoading(true);
    setInvoicesError(null);
    try {
      const data = await getInvoices(params);
      setInvoices(data);
    } catch (error: any) {
      setInvoicesError(error.message || 'Failed to fetch invoices');
    } finally {
      setInvoicesLoading(false);
    }
  };

  // Reports
  const fetchTrialBalance = async (params: any) => {
    setTrialBalanceLoading(true);
    setTrialBalanceError(null);
    try {
      const data = await getTrialBalance(params);
      setTrialBalance(data);
    } catch (error: any) {
      setTrialBalanceError(error.message || 'Failed to fetch trial balance');
    } finally {
      setTrialBalanceLoading(false);
    }
  };

  const fetchProfitLoss = async (params?: any) => {
    setProfitLossLoading(true);
    setProfitLossError(null);
    try {
      const data = await getProfitLoss(params);
      setProfitLoss(data);
    } catch (error: any) {
      setProfitLossError(error.message || 'Failed to fetch profit & loss');
    } finally {
      setProfitLossLoading(false);
    }
  };

  const fetchBalanceSheet = async (params: any) => {
    setBalanceSheetLoading(true);
    setBalanceSheetError(null);
    try {
      const data = await getBalanceSheet(params);
      setBalanceSheet(data);
    } catch (error: any) {
      setBalanceSheetError(error.message || 'Failed to fetch balance sheet');
    } finally {
      setBalanceSheetLoading(false);
    }
  };

  const fetchCashFlow = async (params?: any) => {
    setCashFlowLoading(true);
    setCashFlowError(null);
    try {
      const data = await getCashFlow(params);
      setCashFlow(data);
    } catch (error: any) {
      setCashFlowError(error.message || 'Failed to fetch cash flow');
    } finally {
      setCashFlowLoading(false);
    }
  };

  const value: AccountingContextType = {
    chartOfAccounts,
    chartOfAccountsLoading,
    chartOfAccountsError,
    fetchChartOfAccounts,
    accountSummary,
    fetchAccountSummary,
    vouchers,
    vouchersLoading,
    vouchersError,
    fetchVouchers,
    generalLedger,
    generalLedgerLoading,
    generalLedgerError,
    fetchGeneralLedger,
    cashBankAccounts,
    cashBankLoading,
    cashBankError,
    fetchCashBankAccounts,
    receivables,
    receivablesLoading,
    receivablesError,
    fetchReceivables,
    payables,
    payablesLoading,
    payablesError,
    fetchPayables,
    bankReconciliations,
    bankReconciliationLoading,
    bankReconciliationError,
    fetchBankReconciliations,
    invoices,
    invoicesLoading,
    invoicesError,
    fetchInvoices,
    trialBalance,
    trialBalanceLoading,
    trialBalanceError,
    fetchTrialBalance,
    profitLoss,
    profitLossLoading,
    profitLossError,
    fetchProfitLoss,
    balanceSheet,
    balanceSheetLoading,
    balanceSheetError,
    fetchBalanceSheet,
    cashFlow,
    cashFlowLoading,
    cashFlowError,
    fetchCashFlow,
  };

  return <AccountingContext.Provider value={value}>{children}</AccountingContext.Provider>;
};

export const useAccounting = () => {
  const context = useContext(AccountingContext);
  if (context === undefined) {
    throw new Error('useAccounting must be used within AccountingProvider');
  }
  return context;
};
